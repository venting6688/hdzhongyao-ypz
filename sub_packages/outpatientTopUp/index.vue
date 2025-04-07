<template>
	<view class="box" v-if="showState">
		<bar />
		<view class="title">
			<view>
				<view class="name" @click="outpatientTopUp(1)">
				<view :class="{black:index===1}">
					门诊充值
				<view class="wire" :class="{blue:index===1}"></view>
				</view>
				
			</view>
			<view class="name" @click="outpatientTopUp(2)">
				<view :class="{black:index===2}">
					充值记录
					<view class="wire" :class="{blue:index===2}"></view>
				</view>
				
			</view>
			</view>
			
		</view>
		<view class="middle">
			
			<view class="center" v-if="index===1">
				<view class="tips">
					选择充值金额
				</view>
				<ul>
					<li v-for="item in priceList" :key="item" @click="priceClick(item)" :class="{borderBlue:price===item}">
						{{item}}
					</li>
				</ul>
				<view class="input">
					<view class="test">￥</view>
					<input v-model="price" type="number" placeholder="输入金额" />
				</view>
			</view>
			<view v-else class="record">
				<ul v-if="rechargeRecordList.length">
					<li v-for="(item,index) in rechargeRecordList" :key="index">
						<view>
							<text>充值时间:</text>
							<text>{{item.apdate}}</text>
						</view>
						<view>
							<text>充值金额:</text>
							<text>{{item.accSum}}元</text>
						</view>
						<view>
							<text>支付方式:</text>
							<text>{{item.apmode}}</text>
						</view>
						<!-- <view class="refund">
							<view class="price">
								<text>可退金额：</text>
								<text>260元</text>
							</view>
							<view class="refundBtn" @click="confirm">
								申请退款
							</view>
						</view> -->
					</li>
				</ul>
				<view v-else class="test">
					暂无数据
				</view>
			</view>
		</view>
		<view class="tips" v-if="index===2">
			<view class="tips-title">
				温馨提示
			</view>
			<view class="tips-content">
				★  现金/银行卡退费请到窗口办理
			</view>
		</view>
		<view class="confirm" @click="confirm"  v-if="index===1">
			立即充值
		</view>
		<Toast v-if="toastObj.state" @back="closeToast" :type="toastObj.type" :url="toastObj.url" :tips="toastObj.tips" :message="toastObj.message" />
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin'
	import bar from '../components/bar.vue'
	import { mapState } from 'vuex'
	import Toast from '../components/toast.vue'
	import outpatientTopUp from '@/api/outpatientTopUp.js'
	export default {
		mixins: [mixin],
		components:{
			bar,
			Toast,
		},
		data(){
			return {
				priceList:[50,100,200,500,1000,2000],
				index:1,
				rechargeRecordList:[],
				price:null,
				accountID:'',
				toastObj:{
					state:false,
				},
			}
		},
		mounted() {
			this.getAccountInformation()
		},
		computed: {
			...mapState(['footData']),
		},
		methods: {
			closeToast(state){
				this.toastObj.state = state
			},
			getAccountInformation(){
				try {
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						cardType:this.footData.cardTypeCode,
					}
					outpatientTopUp.getAccountInformation(data).then(res => {
						if(res.data.code===200){
							this.accountID = res.data.data.accountID
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			outpatientTopUp(num){
				this.index = num
				console.log(this.index)
				wx.setNavigationBarTitle({
				      title: this.index===1?'门诊充值':'充值记录'
				})
				if(num===2){
					this.rechargeRecord()
				}
			},
			async rechargeRecord(){
				try {
					const time = await this.getWeek('上一周');
					const msg = {
					  patientID: this.footData.patientUniquelyIdentifies,
					  startTime: time.startDate,
					  endTime: time.endDate,
					  accountID:this.accountID,
					};
					outpatientTopUp.rechargeRecord(msg).then(res => {
						if(res.data.code===200){
							this.rechargeRecordList = res.data.data.accDetailS.accDetailInfo|| []
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			priceClick(item){
				this.price = item
			},
			
			confirm(){
				if(this.index===1){
					this.pay()
					// uni.navigateTo({
					// url: `/sub_packages/outpatientTopUp/topUpRecord?index=${this.index}`
				 //    })
				}else {
					let _this = this
					uni.showModal({
					    title: '温馨提示',
					    content: '退款会原路返回至充值账户，请确定是否退款?',
					    success: function (res) {
					        if (res.confirm) {
								uni.navigateTo({
								url: `/sub_packages/outpatientTopUp/topUpRecord?index=${_this.index}`
								})
					        } 
					    }
					});
				}
				
			},
			pay(){
				try {
					let loginValue = uni.getStorageSync("loginData");
					let data = JSON.parse(loginValue)
					let msg = {
						patientID:this.footData.patientUniquelyIdentifies,
						patientName:this.footData.patientName,
						patientOpenid:data.xcxOpenId,
						accountID:this.accountID,
						amount:this.price,
					}
					outpatientTopUp.outpatientRechargePreOrder(msg).then(result => {
						if(result.data.code===200){
							let obj = result.data.data.prePayResponse
							uni.requestPayment({
								provider: 'wxpay', // 服务提提供商
								timeStamp: obj.body.miniPayRequest.timeStamp,
								nonceStr: obj.body.miniPayRequest.nonceStr, 
								package: obj.body.miniPayRequest.pkg,
								signType: obj.body.miniPayRequest.signType, 
								paySign: obj.body.miniPayRequest.paySign, 
								success: (res)=> {
									this.queryOutpatientRechargeResult(result.data.data)
								},
								fail:(err)=> {
									
								}
							});
						}else {
							this.toastObj = {
							  state: true,
							  type:'fail',
							  message: res.data.msg
							};
						}
					})
				} catch (error) {
					console.log(error)
					this.toastObj = {
					  state: true,
					  type:'fail',
					  message: error.toString(),
					};
					//TODO handle the exception
				}
			},
			async queryOutpatientRechargeResult(data){
				try {
					outpatientTopUp.queryOutpatientRechargeResult(data).then(res => {
						if(res.data.code===999){
							this.queryOutpatientRechargeResult(data)
						}else if(res.data.code===200){
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
		
		.title {
			margin: 20rpx auto 0 auto;
			width: 722rpx;
			background: #ffffff;
			border-radius:12rpx 12rpx 0 0;
			>view {
				margin: 0 20rpx;
				height: 100rpx;
				display: flex;
				border-bottom: 2rpx solid #eeeeee;
				
				.name {
					display: flex;
					align-items: center;
					margin-right:40rpx;
					font-family: PingFang SC, PingFang SC-600;
					color: #000000;
					padding-top: 10rpx;
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
		
		.middle {
			width: 722rpx;
			background: #ffffff;
			border-radius:0 0 12rpx 12rpx;
			margin:  0 auto;
			padding-bottom: 40rpx;
			overflow: auto;
			
			
			.center {
				margin: 0 20rpx;
				.tips {
					color: #222222;
					margin: 30rpx 0;
				}
				>ul {
					margin: 0 30rpx;
					height: 240rpx;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					align-content: space-between;
					li {
						width: 180rpx;
						height: 100rpx;
						border: 2rpx solid #d9d9d9;
						border-radius: 8rpx;
						color: #777777;
						font-size: 32rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.borderBlue {
						border: 2rpx solid #4286FF;
						color: #4286FF;
					}
				}
				.input {
					margin: 30rpx auto 0 auto;
					width: 628rpx;
					height: 90rpx;
					background: #f5f5f5;
					border-radius: 8rpx;
					display: flex;
					// justify-content: center;
					align-items: center;
					
					.test {
						margin: 0 15rpx;
						font-size: 36rpx;
						color: #4286FF;
					}
					input {
						width: 550rpx;
					}
				}
			}
			.record {
				overflow: auto;
				// max-height: 800rpx;
				>ul {
					// background-color: #000000;
					>li {
						margin: 0 20rpx;
						padding-top: 20rpx;
						border-bottom: 2rpx solid #eeeeee;
						>view {
							margin: 16rpx 0;
							text {
								&:first-child{
									color: #888888;
								}
								&:last-child{
									margin-left: 15rpx;
								}
							}
							&:last-child{
								margin: 26rpx 0 16rpx 0;
							}
						}
						.refund {
							display: flex;
							align-items: center;
							justify-content: space-between;
							.price {
								font-size: 32rpx;
								line-height: 32rpx;
								text {
									&:last-child{
										color: red;
									}
								}
							}
							.refundBtn{
								width: 180rpx;
								height: 56rpx;
								border: 2rpx solid #4286ff;
								border-radius: 15rpx;
								font-size: 32rpx;
								line-height: 32rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								color: #4286ff;
							}
						}
						
					}
				}
				.test{
					height: 300rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 38rpx;
				}
			}
		}
		.tips {
			margin:40rpx 30rpx 80rpx 30rpx;
			.tips-title {
				
			}
			.tips-content {
				margin-top: 20rpx;
			}
		}
		.confirm {
			margin: 74rpx auto 0 auto;
			width: 512rpx;
			height: 92rpx;
			background: #4286ff;
			border-radius: 46rpx;
			font-size: 32rpx;
			line-height: 32rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #ffffff;
		}
	}
</style>