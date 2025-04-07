<template>
	<view class="box">
		<view class="center">
			<image v-if="payTips==='充值结果查询中'" src="../static/image/await.png" mode="widthFix"></image>
			<image v-if="payTips==='充值失败'" src="../static/image/warn.png" mode="widthFix"></image>
			<image v-if="payTips==='充值成功'" src="../static/image/success.png" mode=""></image>
			<view class="message">
				{{payTips}}
			</view>
			<view class="price">
				本次{{payTips?'充值':'退款'}}金额:{{payResult.amount}}元
			</view>
			<view class="details" v-if="payTips">
				<view>
					<text>支付方式:</text>
					<text>银联微信</text>
				</view>
				<view>
					<text>充值时间:</text>
					<text>2023年7月14日 11:23:11</text>
				</view>
				<view>
					<text>交易单号:</text>
					<text>SN1023232373271347134193741823</text>
				</view>
			</view>
			<view class="tips"   v-if="payState==2">
				<view class="tips-1">
					退款会在三个工作日内返回到您的原充值账户
				</view>
				<view class="tips-2">
					注：银行卡充值的用户请关注微信实际到银行的时间
				</view>
			</view>
		</view>
		<Toast v-if="toastObj.state" @back="closeToast" :type="toastObj.type" :message="toastObj.message"/>
	</view>
</template>

<script>
	import outpatientTopUp from '@/api/outpatientTopUp.js'
	import Toast from '../components/toast.vue'
	export default {
		
		data(){
			return {
				payResult:null,
				payTips:'',
				toastObj:{
					state:false,
				},
			}
		},
		onLoad(e) {
			this.payResult = JSON.parse(decodeURIComponent(e.payResult))
			if(this.payResult){
				this.payTips = '充值结果查询中'
				this.queryOutpatientRechargeResult()
			}
			console.log('this.payResult',this.payResult)
		},
		mounted(){
			
		},
		methods: {
			closeToast(state){
				this.toastObj.state = state
			},
			async queryOutpatientRechargeResult(){
				try {
					outpatientTopUp.queryOutpatientRechargeResult(this.payResult).then(res => {
						if(res.data.code===200){
							this.payTips = '充值成功'
							this.toastObj = {
								state:true,
								message:'充值成功',
								url:'/pages/more/index',
								tips:'秒自动为您切换到更多服务',
							}
						}else{
							this.toastObj = {
							  state: true,
							  type:'fail',
							  message: '充值失败，已退款',
							  url:'/sub_packages/outpatientTopUp/index',
							  tips:'秒自动为您切换到门诊充值',
							};
						}
					})
				} catch (error) {
					this.toastObj = {
					  state: true,
					  type:'fail',
					  message: error.toString(),
					};
					console.log(error)
					//TODO handle the exception
				}
			},
		},
		
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
				font-size: 24rpx;
				
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