<template>
	<view class="box" v-if="showState">
		<bar />
		<date @handle="show" />
		<view class="head">
			<view>
				<view class="name" @click="headBtn(1)">
					<view :class="{black:headIndex===1}">
						未缴费
					<view class="wire" :class="{blue:headIndex===1}"></view>
					</view>
				</view>
				<view class="name" @click="headBtn(2)">
					<view :class="{black:headIndex===2}">
						缴费记录
						<view class="wire" :class="{blue:headIndex===2}"></view>
					</view>
				</view>
				
			</view>
		</view>
		<view class="information">
			<ul v-if="headIndex===1 && !loading.loadingState">
				<li v-for="(item,index) in billList" :key="index">
					<view class="middle">
						<view class="title">
							<view class="header">
								<view class="time">{{item.tradeTime}}</view>
								<view class="delete" @click="particulars(item, '未交费')">
									<text>费用明细</text>
									<image src="../static/image/Vector@2x.png" mode=""></image>
								</view>
							</view>
							<view class="clinic"><text>就诊时间：{{item.billDate}}</text></view>
							<view class="clinic"><text>就诊科室：{{item.deptName}}</text></view>
							<view class="clinic"><text>就诊医生：{{item.doctName}}</text></view>
						</view>
					</view>
					<view class="totalMoney">
						<view class="">
							<text>待缴费金额：</text>
							<text>￥{{item.billFee / 100}}元</text>
						</view>
					</view>
					<view class="btn" v-if="item.AdmReasonCode == 1">
						<view class="self-paying" @click="pay(item)">立即缴费</view>
					</view>
					<view class="message" v-else>
						<uni-icons type="info" size="20" style="padding-right: 6rpx;"></uni-icons>
						注意：请到缴费窗口进行缴费
					</view>
				</li>
			</ul>
			<view class="loading" v-if="loading.loadingState">
				<van-loading size="24px" vertical>{{loading.loadingName}}</van-loading>
			</view>
			<zanwu v-if="headIndex===1 && !billList.length && !loading.loadingState" />
			<ul v-if="headIndex===2">
				<template v-if="alreadyList.length">
					<li @click="particulars(item, '已缴费')" v-for="(item,index) in alreadyList" :key="index">
						<view class="middle">
							<view class="title">
								<view class="header">
									<view class="time">{{item.tradeTime}}</view>
									<view class="delete">
										<text>费用明细</text>
										<image src="../static/image/Vector@2x.png" mode=""></image>
									</view>
								</view>
							</view>
							<!-- <view class="list">
									<view>
									<text>就诊科室：</text>
									<text>{{item.itemName}}</text>
								</view>
							<view>
									<text>就诊医生：</text>
									<text>{{item.admDoctor}}</text>
								</view>
							</view> -->
						</view>
						<view class="totalMoney">
							<view>
								<text>费用合计：</text>
								<text class="black">￥{{item.billFee / 100}}元</text>
							</view>
						</view>
					</li>
				</template>
			</ul>
			<zanwu v-if="headIndex===2 && !alreadyList.length && !loading.loadingState" />
		</view>
		<Toast v-if="toastObj.state" @back="closeToast" :type="toastObj.type" :message="toastObj.message"/>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import mixin from '@/mixins/mixin'
	import bar from '../components/bar.vue'
	import date from '../components/date.vue'
	import zanwu from '../components/zanwu.vue'
	import Toast from '../components/toast.vue'
	import { mapState } from 'vuex'
	import bus from '@/utils/bus.js'
	import outpatientExpenditureApi from '@/api/outpatientExpenditureApi.js'
	import registrationApi from '@/api/registrationApi.js'
	import guideApi from '@/api/guideApi.js'
	import healthCard from '@/api/healthCard.js'
	
	export default {
		mixins: [mixin],
		components:{
			bar,
			Toast,
			date,
			zanwu,
		},
		data(){
			return {
				headIndex:1,
				list1:[],
				list2:[],
				billList:[],
				alreadyList:[],
				loading:{
					loadingState:true,
					loadingName:'加载中',
				},
				second:3,
				message:'',
				toastObj:{
					state:false,
				},
				checkState:false,
				date: {},
				siginData: {},
				loginValue: {},
			}
		},
		computed: {
			...mapState(['footData','showState']),
		},
		onLoad(option) {
			this.loginValue = uni.getStorageSync("loginData");
			if (!this.loginValue) {
				uni.reLaunch({ url:"/sub_packages/login/index?title=青岛西海岸新区第二中医医院" })
			} else {
				this.siginData = this.loginValue.defaultArchives ? this.loginValue.defaultArchives : {}
				this.loading.loadingState = false
				if(option.checkState){
					this.checkState = option.checkState
				}
				this.reportHISData();
			}
		},
		
		methods: {
			closeToast(state){
				this.toastObj.state = state
			},
			particulars(detail, type){
				uni.navigateTo({ url: `/sub_packages/outpatientExpenditure/particulars?detail=${encodeURIComponent(JSON.stringify(detail))}&type=${type}`});
			},
			//时间插件
			show(time){
				const datePattern = /^\d{4}-\d{2}-\d{2}$/.test(time.startTime);
				if(datePattern){
					this.date = time
					this.headIndex === 1 ? this.queryMedicalRecords() : this.getPaymentRecord();
				}
			},
			headBtn(num){
				this.loading.loadingState = false
				this.headIndex = num
				num === 1 ? this.queryMedicalRecords() : this.getPaymentRecord();
			},
			//检测用卡数据
			async reportHISData() {
				let data = {
					qrCodeText: this.siginData.qrCodeText,
					time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
					hospitalCode: '40088',
					scene: '0101051',
					department: '',
					cardType: '11',
					cardChannel: '0402',
					cardCostTypes: '0100',
					openId: this.loginValue.xcxOpenId,
				}
				let res = await healthCard.reportHISData(data);
			},
			//未交费
			async queryMedicalRecords() {
				if (this.siginData.patientCard) {
					let data = {
						cardNo: this.siginData.patientCard,
						patientId: '',
						startDate: this.date.startTime,
						endDate: this.date.endTime,
						operId: 'YPZ',
					};
					outpatientExpenditureApi.getToBePaid(data).then(res => {
						let result = res.data;
						if (result.code === 200) {
							this.billList = result.data.Response.ResultData.RecordList;
						} else {
							this.billList = [];
						}
					}).catch(err => {
						console.log('error：', err);
					});
					
				}
			},
			
			//缴费记录
			async getPaymentRecord(){
				try {
					let data = {
						cardNo: this.siginData.patientCard,
						patientId: '',//this.siginData.patientCard,
						startDate: this.date.startTime,
						endDate: this.date.endTime,
					}
					outpatientExpenditureApi.getQueryFeeRecord(data).then(res => {
						let result = res.data;
						if(result.code=== 200){
							this.alreadyList = result.data.Response.ResultData.RecordList;
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			
			//支付
			pay(item){
				let loginValue = uni.getStorageSync("loginData");
				let randNum = Math.floor(1000000 + Math.random() * 9000000);
				let msg = { 
					patientId: this.siginData.patientCard,
					patientName: this.siginData.patientName,
					subOpenId: loginValue.xcxOpenId,
					totalAmount: String(item.billFee), 
					merOrderId: '157Q-jf'+dayjs().format('YYYYMMDDHHmmss')+'-'+randNum
				}
				try {
					registrationApi.registerOrder(msg).then(result => {
						if(result.data.errCode){
							let { merOrderId, totalAmount, miniPayRequest } = result.data;
							uni.requestPayment({
								provider: 'wxpay', // 服务提提供商
								timeStamp: miniPayRequest.timeStamp, // 时间戳
								nonceStr: miniPayRequest.nonceStr, // 随机字符串
								package: miniPayRequest.package,
								signType: miniPayRequest.signType, // 签名算法
								paySign: miniPayRequest.paySign, // 签名
								success: (res)=> {
									this.loading = {
										loadingState:true,
										loadingName:'正在查询支付结果',
									}
									this.queryPayResultForToBePaid(result.data, item.billNo)
									this.loading = {
										loadingState:false,
									}
								},
								fail:(err)=> {
									this.queryMedicalRecords()
								}
							});
						}else {
							this.toastObj = {
							  state: true,
							  type:'fail',
							  message: result.data.msg
							};
						}
					})
				} catch (error) {
					this.toastObj = {
					  state: true,
					  type:'fail',
					  message: error.toString(),
					};
					//TODO handle the exception
				}
			},
			queryPayResultForToBePaid(data, billNo){
				//支付成功
				let msg = {
					patientId: this.siginData.patientCard,
					patientName: this.siginData.patientName,
					orderSum: data.totalAmount,
					targetOrderId: '',
					merOrderId: data.merOrderId,
					lockId: data.merOrderId
				}
				//查询支付订单
				registrationApi.queryPayResult(msg).then(res => {
					if(res.data.code === 200){
						let resMsg = JSON.parse(res.data.msg);
						//查询patientId
						let select = {
							cardNo: this.siginData.patientCard,
							cardType: 1,
							patientName: this.siginData.patientName,
						}
						
						guideApi.queryPatient(select).then((r) => {
							let result = r.data;
							if (result.code === 200) {
								//缴费结算
								let patientId = result.data.Response.ResultData.RecordList[0].patientId;
								let opPayData = {
									cardNo: this.siginData.patientCard,
									patientId,
									billNo,
									tradeMode: 'CCBJRZYPLUS',
									outTradeNo: resMsg.targetOrderld,
									transNo: resMsg.targetOrderId,
									cash: resMsg.invoiceAmount,
									operId: 'mobile',
									patientName: this.siginData.patientName,
									totalAmount: resMsg.receiptAmount,
									allSelf: 1,
								}
								registrationApi.opPay(opPayData).then((r) => {
									let uploadRes = r.data;
									if (uploadRes.code === 200) {
										this.toastObj = {
											state: true,
											type:'fail',
											message: '缴费成功',
										};
										this.queryMedicalRecords()
									} else {
										//退费
										console.log(JSON.stringify(data));
										this.reFund(data);
									}
								})
							} else {
								//退费
								this.reFund(data);
							}
						})
					}else {
						//退费
						this.reFund(data);
					}
				})
				.catch(err => {
					console.log('errrrrr：', err);
				})
			},
			
			reFund(data) {
				registrationApi.refund({merOrderId: data.merOrderId, refundAmount: data.totalAmount, targerOrderId: ''}).then(r => {
					let refundRes = r.data
					if (refundRes.code === 200) {
						this.toastObj = {
							state: true,
							type:'fail',
							message: '缴费失败，已退款',
						};
						this.queryMedicalRecords()
					} else {
						this.toastObj = {
							state: true,
							type:'fail',
							message: '退费失败，请移步人工窗口处理',
						};
						this.queryMedicalRecords()
					}
				})
			}
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
		
		.head {
			width: 681.3rpx;
			margin: 20rpx auto 0  auto;
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
			width: 100%;
			overflow: auto;
			margin: 0 auto 60rpx auto;
			ul {
				width: 681.3rpx;
				margin: 0 auto;
				background: #ffffff;
				border-radius:0 0 12rpx 12rpx;
				> li {
					width: 681.3rpx;
					&:first-child{
						>view {
							border: 0;
						}
						
					}
					
					.middle{
						padding-bottom: 20rpx;
						margin: 0 20rpx;
						border-top: 2rpx solid #eeeeee;
						
						.title {
							.time { padding: 15rpx 0; }
							.clinic { padding: 15rpx 0 0; }
							.header {
								display: flex;
								justify-content: space-between;
								align-items: center;
								image {
									width: 12rpx;
									height: 18rpx;
									margin-left:20rpx;
								}
								.delete {
									display: flex;
									align-items: center;
									font-size: 26.72rpx;
									line-height: 26.72rpx;
									font-family: PingFang SC, PingFang SC-400;
									font-weight: 400;
									color: #4286ff;
									padding-top: 15rpx;
								}
							}
							
							
							
							
							
							
						}
						.center {
							display: flex;
							.no {
								width: 100%;
								font-size: 24rpx;
								margin: 14rpx 0;
								
								.price{
									display: flex;
									justify-content: space-between;
									text {
										&:nth-child(1){
											color: #999999;
										}
										&:nth-child(2){
											color: #333333;
										}
									}
								}
								
							}
						}
						.list {
							font-size: 26rpx;
							>view {
								margin: 10rpx 0;
								>text{
									&:first-child{
										color: #888888;
									}
								}
							}
						}
					}
					.totalMoney{
						
						text-align: right;
						view {
							padding: 10rpx 0 20rpx 0;
							margin: 0 20rpx;
							text{
								&:last-child{
									color: red;
								}
							}
							.black {
								color: #000000 !important;
							}
						}
					}
					.btn {
						display: flex;
						justify-content: space-around;
						width: 681.3rpx;
						padding-bottom: 60rpx;
						margin: 0 auto;
						view {
							width: 304rpx;
							height: 84rpx;
							border-radius: 46rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							color: #ffffff;
							font-size: 32rpx;
							line-height: 32rpx;
							
							&:first-child{
								background: #3cd0aa;
							}
							&:last-child{
								background: #4286ff;
							}
						}
					}
					.message {
						padding: 25rpx;
					}
					
				}
			}
			.loading {
				width: 681.3rpx;
				margin: 0 auto;
				background: #ffffff;
				min-height: 500rpx;
				display: flex;
				font-size: 40rpx;
				justify-content: center;
				align-items: center;
			}
		}
		// .without {
		// 	font-size: 40rpx;
		// 	width: 681.3rpx;
		// 	padding-bottom: 35rpx;
		// 	// height: 500rpx;
		// 	background: #ffffff;
		// 	margin: 0 auto;
		// 	border-radius: 15.27rpx;
		// 	// display: flex;
		// 	// justify-content: center;
		// 	// align-items: center;
		// 	text {
		// 		margin-top: -50rpx;
		// 		justify-content: center;
		// 		align-items: center;
		// 		display: flex;
		// 		color: #797979;
		// 		font-size: 32rpx;
		// 	}
		// }
	}
</style>