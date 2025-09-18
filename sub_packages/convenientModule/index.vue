<template>
	<view class="inventory">
		<bar />
		<view class="date">
			<uni-datetime-picker 
				type="date" 
				:clear-icon="false" 
				v-model="range"
				@maskClick="maskClick" 
				style="border: none !important; border-radius: 15rpx !important;"
			/>
		</view>
		<view class="center">
			<view class="top" v-for="(item, index) in visibleData" :key="index">
					<view class="title">
						<view class="left">{{startDate}} {{item.tradeTime}}</view>
					</view>
					<view class="content">科室：{{item.deptName}}</view>
					<view class="content">项目：{{item.itemName}}</view>
					<view class="content">单价：￥{{parseFloat(item.itemPrice/100).toFixed(2)}}元</view>
					<view class="content">规格：{{item.itemQty}} {{item.itemUnits}}</view>
					<view class="content">费用：￥{{parseFloat(item.cost/100).toFixed(2)}}元</view>
				</view>
				
				<!-- 加载状态提示 -->
				<view v-if="loading" class="loading-text">加载中...</view>
				<view v-if="noMoreData" class="no-more-text">没有更多数据了</view>
				
				<view v-if="recordList.length === 0" class="without">
					<image src="https://aiwz.sdtyfy.com:8099/img/wu.png" mode="widthFix"></image>
				</view>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import { mapState } from 'vuex';
	import bus from "@/utils/bus.js";
	import bar from '../components/bar.vue'
	import hospitalizationApi from '@/api/hospitalizationApi.js';
	export default {
		components:{
			bar,
		},
		data() {
			return {
				date:{},
				recordList: [],
				defaultValue: {},
				visibleData: [],  // 当前展示的数据（每次8条）
				currentPage: 1,   // 当前页
				pageSize: 10,     // 每页条数
				loading: false,   // 加载状态
				noMoreData: false, // 是否无更多数据
				range: dayjs().format('YYYY-MM-DD'),
				bankCardNo: '',
				startDate: dayjs().format('YYYY-MM-DD'),
				endDate: dayjs().format('YYYY-MM-DD'),
			}
		},
		computed: {
			...mapState(['footData','department']),
		},
		watch: {
			range(newval) {
				this.startDate = newval;
				this.endDate = newval;
				this.fetchAllData();
			},
		},
		mounted() {
			let loginValue = uni.getStorageSync("loginData");
			this.defaultValue = loginValue.defaultArchives;
			this.getHospitalizationRecord();
		},
		onReachBottom() {
			this.loadMore(); // 触底加载更多
		},
		methods: {
			maskClick(e){
				console.log('maskClick事件:', e);
			},
			getHospitalizationRecord() {
				let data = {
					operId: 'YPZ',
					cardNo: this.defaultValue.patientCard, 
					cardType:'',
					patientId: ''
				}
				hospitalizationApi.getHospitalizationRecord(data).then(res => {
					this.information = {};
					if (res.data.code === 200) {
						let resData = res.data.data.Response;
						if (resData.ResultCode == 0) {
							this.bankCardNo = resData.ResultData.patientHosId
							this.fetchAllData()
						}
					}
				});
			},
			
			fetchAllData() {
				this.loading = true;
				try {
					let data = {
						patientId: this.bankCardNo,
						startDate: this.startDate,
						endDate: this.endDate,
						cardNo: '',
						cardType: '',
					}
					hospitalizationApi.getHospitalizationList(data).then(res => {
						this.recordList = []; this.visibleData = [];
						if (res.data.code === 200) {
							let resData = res.data.data.ResultData.RecordList.RecordInfo
							this.recordList = resData;
							this.visibleData = this.recordList.slice(0, this.pageSize); 
						} else {
							this.loading = false;
							this.recordList = [];
							this.visibleData = [];
						}
					});
				} catch (error) {
					console.error("数据加载失败:", error);
				} finally {
					this.loading = false;
				}
			},
			
			loadMore() {
				if (this.noMoreData || this.loading) return;
				this.loading = true;
				setTimeout(() => { 
					const nextPageData = this.recordList.slice(
						this.currentPage * this.pageSize,
						(this.currentPage + 1) * this.pageSize
					);
	
					if (nextPageData.length === 0) {
						this.noMoreData = true;
					} else {
						this.visibleData = [...this.visibleData, ...nextPageData];
						this.currentPage++;
					}
					this.loading = false;
				}, 800);
			},
			
		},
	}
</script>

<style lang="less" scoped>
	.moveR-enter-active,  .moveR-leave-active {
	    transition: all 4s linear;
	    transform: translateX(0);
	  }
	   .moveR-enter,  .moveR-leave {
	    transform: translateX(100%);
	  }
	   .moveR-leave-to{
	     transform: translateX(100%);
	   }
	.inventory{
		.date {
			margin: 15rpx auto;
			width: 92%;
			border: 3rpx solid #4286ff
		}
		.center {
			margin:28rpx 33rpx 0 33rpx;
			width: 684rpx;
			background: #ffffff;
			border-radius: 12rpx;
			padding: 20rpx 0;
			
			.loading-text,
			.no-more-text {
			  text-align: center;
			  padding: 20rpx;
			  color: #999;
			}
			
			&:last-of-type{
				margin:28rpx 33rpx 28rpx 33rpx;
			}
			
			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10rpx 0 15rpx;
				margin:0 20rpx;
				.right {
					image {
						width: 12rpx;
						height: 16rpx;
						margin-left: 10rpx
					}
					text {
						color: #4286FF;
					}
				}
			}
			.top {
				margin:15rpx 10rpx;
				padding: 15rpx 10rpx;
				border-bottom: 1px solid #eee;
				.content {
					margin:15rpx 20rpx;
					text-align: left;
				}
			}
			.bottom {
				background: #f8f8f8;
				margin: 20rpx 10rpx 0 10rpx;
				.content {
					margin:0 20rpx;
					text-align: left;
					.btn {
						width: 100%;
						text-align: right;
						padding-bottom: 20rpx;
						button {
							width: 180rpx;
							height: 48rpx;
							background: linear-gradient(353deg,#479cff 0%, rgba(71,188,253,0.89) 54%, rgba(71,216,251,0.80) 100%);
							border-radius: 70rpx;
							color: #ffffff;
							white-space: nowrap;
						}
					}
				}
				
			}
		}
	}
</style>
