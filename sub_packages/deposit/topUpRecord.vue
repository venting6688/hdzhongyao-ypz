<template>
	<view class="box">
		<view class="center">
			<!-- <image src="../static/image/warn.png" mode="widthFix"></image> -->
			<image v-if="index==1" src="../static/image/success.png" mode=""></image>
			<image v-if="index==2" src="../static/image/await.png" mode="widthFix"></image>
			<view class="message">
				{{index==1?'充值成功':'退款申请成功'}}
			</view>
			<view class="price">
				{{index==1?'本次充值金额':'本次退款金额'}}:{{amount}}元
			</view>
			<view class="details" v-if="index==1">
				<view>
					<text>支付方式:</text>
					<text>银联微信</text>
				</view>
				<view>
					<text>充值时间:</text>
					<text>{{date}}</text>
				</view>
				<view>
					<text>交易单号:</text>
					<text>{{payOrder}}</text>
				</view>
			</view>
			<view class="tips" v-if="index==2">
				<view class="tips-1">
					退款会在三个工作日内返回到您的原充值账户
				</view>
				<view class="tips-2">
					注：银行卡充值的用户请关注微信实际到银行的时间
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		
		data(){
			return {
				index:null,
				amount: 0,
				date: '',
				payOrder: '',
			}
		},
		onLoad(e) {
			this.index = e.index
			this.amount = e.amount
			this.date = e.pay
			this.payOrder = e.payOrder
		},
		methods: {
			
			
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
		
		.center {
			width: 100%;
			text-align: center;
			margin-top: 60rpx;
			image {
				width: 132rpx;
				height: 132rpx;
			}
			.message {
				margin: 20rpx 0;
				font-size: 36rpx;
				line-height: 36rpx;
			}
			.price {
				font-size: 32rpx;
			}
			.tips {
				margin-top: 60rpx;
				width: 100%;
				display: flex;
				align-items: center;
				flex-direction: column;
				.tips-1{
					width: 560rpx;
					height: 40rpx;
					font-size: 28rpx;
					color: #808080;
					line-height: 28rpx;
				}
				.tips-2{
					margin-top: 20rpx;
					width: 474rpx;
					height: 80rpx;
					font-size: 28rpx;
					font-weight: 400;
					text-align: center;
					color: #dd5555;
					line-height: 32rpx;
				}
			}
			.details {
				width: 726rpx;
				margin: 30rpx auto 0 auto;
				text-align: left;
				font-size: 28rpx;
				line-height: 28rpx;
				background: #ffffff;
				border-radius: 12rpx;
				padding: 22rpx;
				view {
					margin: 15rpx 0;
					text {
						
						&:first-child{
							color: #888888;
							margin-right: 30rpx;
						}
					}
				}
			}
		}
		
	}
</style>