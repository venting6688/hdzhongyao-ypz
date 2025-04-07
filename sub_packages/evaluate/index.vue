<template>
	<view class="box">
		<view class="information">
			<ul>
				<li  @click="information" v-for="(item,index) in list" :key="item.patientCard">
					<view class="title">
						<view class="name">
							<text>2023年12月20日</text>
						    <!-- <image src="../static/image/icon-edit.png" mode=""></image> -->
						</view>
						<view class="delete">
							<text>查看详情</text>
							<image src="../static/image/Vector@2x.png" mode=""></image>
						</view>
					</view>
					<view class="center">
						<view class="no">
							<text>就诊人：</text>
							<text>{{item.patientName}}</text>
						</view>
						<view class="no">
							<text>就诊科室：</text>
							<text>呼吸内科门诊</text>
						</view>
						<view class="no">
							<text>就诊医生：</text>
							<text>张海松</text>
						</view>
						<view class="evaluate">
							<text>整体评价:</text>
						    <van-rate readonly color="#FF7A00":value="rateValue" />
							<text :class="{gray:!evaluateList[rateValue-1]}">{{evaluateList[rateValue-1]?evaluateList[rateValue-1]:'未评价'}}</text>
						</view>
					</view>
				</li>
			</ul>
		</view>
	</view>
</template>
<script>
	export default {
		data(){
			return {
				rateValue:null,
				list:[
					{
						patientName:'郭*康',
					},
					
				],
				evaluateList:['非常差','差','一般','好','非常好'],
			}
		},
		onShow() {
			console.log(111)
			let mean = uni.getStorageSync("mean");
			if(mean){
				this.rateValue=Number(mean)
			}
		},
		methods: {
			
			information(){
				uni.navigateTo({
					url: `/sub_packages/evaluate/details`
				})
			}
			
		},
		mounted(){
		}
	}
</script>

<style lang="less" scoped>
	.box {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		
		.information {
			width: 100%;
			overflow: auto;
			margin-bottom: 50rpx;
			padding-top: 30rpx;
			ul {
				width: 681.3rpx;
				margin: 0 auto;
				> li {
					width: 681.3rpx;
					// height: 230rpx;
					padding-bottom: 20rpx;
					background: #ffffff;
					border-radius: 15.27rpx;
					margin-top: 30rpx;
					&:first-child{
						margin: 0;
					}
					
					.title {
						margin: 0 20rpx;
						height: 70rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						
						image {
							width: 12rpx;
							height: 18rpx;
							margin-left:20rpx;
						}
						
						.name {
							display: flex;
							align-items: center;
							font-size: 28rpx;
							line-height: 34.35rpx;
							font-family: PingFang SC, PingFang SC-600;
							font-weight: 600;
							color: #000000;
							padding: 10rpx 0;
						}
						.delete {
							display: flex;
							align-items: center;
							font-size: 26.72rpx;
							line-height: 26.72rpx;
							font-family: PingFang SC, PingFang SC-400;
							font-weight: 400;
							color: #4286ff;
							padding: 10rpx 0;
						}
					}
					.center {
						margin: 0 20rpx;
						padding-bottom: 20rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.no {
							margin: 6rpx 0;
							text {
								&:nth-child(1){
									color: #999999;
								}
								&:nth-child(2){
									color: #333333;
								}
							}
						}
						.evaluate {
							margin-top: 30rpx;
							font-size: 28rpx;
							line-height: 28rpx;
							display: flex;
							align-items: center;
							text {
								
								&:last-child {
									margin-left: 18rpx;
								}
							}
							.gray {
								color: #999999;
							}
						}
					}
				}
			}
		}
		
	}
</style>