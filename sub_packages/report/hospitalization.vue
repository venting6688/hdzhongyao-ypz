<template>
	<view class="box">
		<date @handle="show" />
		<view class="information">
			<uni-section type="line">
				<view class="uni-padding-wrap uni-common-mt">
					<uni-segmented-control 
						:current="currentTab" 
						:values="tabs" 
						style-type="button"
						activeColor="#4286FF"
						@clickItem="onTabClick" 
					/>
				</view>
				<view class="tab-content">
					<view class="content" v-for="(val, i) in tabs" :key="i" v-show="currentTab === i">
						<view v-if="currentTab === i">
							<view v-if="List.length > 0">
								<view class="list" @click="information(item)" v-for="(item,index) in List" :key="index">
									<view class="top">
										<view>
											<text class="text-color">检查编号：</text>
											<text>{{item.documentID}}</text>
										</view>
										<view style="color: #4286ff;">查看报告<image src="../static/image/Vector@2x.png" mode=""></image></view>
									</view>
									<view class="bottom">
										<view>
											<text class="text-color">{{currentTab === 0 ? '检查' : '检验'}}项目：</text>
											<text>{{item.documentTitle}}</text>
										</view>
										<view class="time">
											<text class="text-color">{{currentTab === 0 ? '检查' : '检验'}}时间：</text>
											<text>{{item.updateDate}} {{item.updateTime}}</text>
										</view>
									</view>
								</view>
							</view>
							<view class="without" v-else>
								<image src="../static/image/wu.png" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
			</uni-section>
			
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import date from '../components/date.vue'
	import elseApi from '@/api/elseApi.js'
	import healthCard from '@/api/healthCard.js'
	export default {
		components:{
			date,
		},
		data(){
			return {
				currentTab: 0,
				tabs: ['检查项目', '检验项目'],
				date:{},
				List:[],
				loginData: {},
				siginData: {},
				isVerify: false,
			}
		},
		computed: {
			...mapState(['footData']),
		},
		onLoad(e) {
			let loginValue = uni.getStorageSync("loginData");
			this.loginData = loginValue ? JSON.parse(loginValue) : {};
			this.siginData = this.loginData.defaultArchives ? this.loginData.defaultArchives : {};
			this.isVerify = true;
		},
		methods: {
			onTabClick(e) {
				this.currentTab = e.currentIndex
				let type = this.currentTab === 0 ? '00' : '99';
				this.getVisitRecord(type)
			},
			
			show(time){
				const datePattern = /^\d{4}-\d{2}-\d{2}$/.test(time.startTime);
				if(datePattern){
					this.date = time
					if (this.isVerify) {
						let type = this.currentTab === 0 ? '00' : '99';
						this.getVisitRecord(type)
					}
				}
			},

			getVisitRecord(type){
				uni.showLoading({
					title: '加载中...',
					mask: true 
				})
				let data = {
					patientID: this.footData.patientUniquelyIdentifies,  //'0000837231'
					visitNumber: '',
					documentType: type,
					startDate: this.date.startTime,
					endDate: this.date.endTime,
					admType: 'I',
				}
				elseApi.getDocumentRetrieval(data).then(res => {
					this.List = []
					if(res.data.code===200){
						this.List = res.data.data
					}
				}).catch(err => {
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					});
				}).finally(() => {
					setTimeout(() => {
						uni.hideLoading();
					}, 300);
				});
				
			},
			information(item){
				if(this.currentTab === 0){
					//检查
					uni.navigateTo({
						url: `/sub_packages/report/examine?report=${encodeURIComponent(JSON.stringify(item))}`
					})
				}else {
					//检验
					uni.navigateTo({
						url: `/sub_packages/report/checkout?report=${encodeURIComponent(JSON.stringify(item))}`
					})
				}
			}
		},
	}
</script>

<style lang="less" scoped>
	::v-deep .segmented-control__text {
	  font-size: 30rpx !important;
	}
	.box {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		
		.head {
			width: 681.3rpx;
			margin: 0 auto;
			background: #ffffff;
			// height: 120rpx;
			
			border-radius: 12rpx 12rpx 0 0;
			>view{
				padding-top: 20rpx;
				margin: 0 20rpx;
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #eeeeee;
				.name {
					display: flex;
					align-items: center;
					margin-right:40rpx;
					font-family: PingFang SC, PingFang SC-600;
					color: #000000;
					padding: 10rpx 0;
					font-size: 32rpx;
					line-height: 32rpx;
					color: #8a8a8a;
										
				}
				
				.wire {
					width: 92rpx;
					height: 8rpx;
					margin: 18rpx auto 0 auto;
					border-radius: 8rpx;
				}
				.blue {
					background: #4286ff;
				}
				.black {
					color: #000000;
				}
			}
		}
		.information {
			margin: 20rpx;
			overflow: auto;
			border-radius: 10rpx;
			background: #fff;
			.text-color {
				color: #666;
			}
			.tab-content {
				padding: 15rpx 0;
				margin: 0 15rpx;
				.content {
					display: flex;
					flex-direction: column;
					.list {
						padding: 15rpx;
						margin-bottom: 15rpx;
						border-bottom: 1px solid #ccc;
						.top {
							height: 50rpx;
							display: flex;
							justify-content: space-between;
							align-items: right;
							image {
								width: 12rpx;
								height: 18rpx;
								margin-left:20rpx;
							}
						}
						.bottom {
							.time {
								margin-top: 20rpx;
							}
						}
					}
					
				}
			}
		}
		.without {
			font-size: 40rpx;
			width: 681.3rpx;
			height: 500rpx;
			background: #ffffff;
			margin: 0 auto;
			border-radius: 15.27rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 75%
			}
		}
	}
</style>