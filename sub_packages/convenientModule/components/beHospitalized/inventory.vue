<template>
	<view class="inventory">
		<view class="center">
			<view class="top" @click="showDetail(item.value)" v-for="(item, index) in dayList" :key="index">
				<view class="title">
					<view class="left">{{item.date}}</view>
					<view class="right">
						<text>查看详情</text>
						<image src="../../../static/image/Vector@2x.png" mode=""></image>
					</view>
				</view>
				<view class="content">本日消费金额：￥{{item.totalAmount}}元</view>
			</view>
			<view v-if="dayList.length === 0" class="without">
				<image src="https://aiwz.sdtyfy.com:8099/img/wu.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import { mapState } from 'vuex';
	import bus from "@/utils/bus.js";
	import hospitalizationApi from '@/api/hospitalizationApi.js';
	export default {
		props: { headerEmit: Object, },
		data() {
			return {
				dayList: [],
			}
		},
		computed: {
			...mapState(['footData','department']),
		},
		mounted() {
			this.getHospitalizationDaysList()
		},
		
		methods: {
			async getHospitalizationDaysList () {
				let data = {
					patientID: this.footData.patientUniquelyIdentifies,
					AimFlag: 'Dep'
				}
				let res = await hospitalizationApi.getHospitalRecord(data);
				if (res.data.code === 200 && res.data.data.admInfoList != undefined) {
					let admID = res.data.data.admInfoList.admInfo[0].admID;
					let startDate =res.data.data.admInfoList.admInfo[0].admDate;
					let endDate = dayjs().format('YYYY-MM-DD');
					let str = {
						startDate,
						endDate,
						admID
					}
					let data = await hospitalizationApi.getHospitalizationDaysList(str);
					if (data.data.code === 200) {
						this.dayList = data.data.data;
						this.dayList.sort((a, b) => new Date(b.date) - new Date(a.date))
					}
				}
			},
			
			showDetail(data) {
				uni.navigateTo({
					url: `/sub_packages/convenientModule/detail?data=${encodeURIComponent(JSON.stringify(data))}`
				})
			}
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
		// background: fuchsia;
		
		.center {
			margin:28rpx 33rpx 0 33rpx;
			width: 684rpx;
			background: #ffffff;
			border-radius: 12rpx;
			padding: 20rpx 0;
			
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
					margin:0 20rpx;
					text-align: left;
				}
			}
			.bottom {
				background: #f8f8f8;
				margin:20rpx 10rpx 0 10rpx;
				.content {
					margin:0 20rpx;
					// display: flex;
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
