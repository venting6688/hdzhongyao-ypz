<template>
	<view class="box">
		<bar v-if="footData.patientUniquelyIdentifies" />
		<view class="application" v-if="isHospitalization">
			<view class="head">住院信息</view>
			<view class="middle">
				<view>
					<text>患者姓名:</text>
					<text>{{information.name}}</text>
				</view>
				<view>
					<text>患者病区:</text>
					<text>{{deptName}}</text>
				</view>
				<view>
					<text>床号:</text>
					<text>{{information.bedNo}}</text>
				</view>
				<view>
					<text>总费用:</text>
					<text>￥{{parseFloat(information.cost).toFixed(2)}}元</text>
				</view>
				<view>
					<text>账户余额:</text>
					<text>￥{{parseFloat(information.accBalance).toFixed(2)}}元</text>
				</view>
			</view>
		</view>
		<view class="title">
			<view>
				<view class="name" @click="outpatientTopUp(1)">
				<view :class="{black:index===1}">
					住院预交金
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
				<view class="tips">选择充值金额</view>
				<ul>
					<li v-for="item in priceList" :key="item" @click="priceClick(item)" :class="{borderBlue:price===item}">
						{{item}}
					</li>
				</ul>
				<view class="input">
					<view class="test">￥</view>
					<input v-model="price" @input="input" type="number" placeholder="输入金额" />
				</view>
			</view>
			<view class="message" v-if="!isHospitalization && index == 1">未查询到您的住院记录，无法进行充值</view>
			
			<view v-if="index != 1" class="record">
				<ul>
					<li v-for="(item, index) in list" :key="index">
						<view class="info">
							充值时间: {{item.dateTime}}
						</view>
						<view class="info">
							<view>充值金额: ￥{{parseFloat(item.cash / 100).toFixed(2)}}元</view>
							<view>科室: {{item.deptName ? item.deptName : ''}}</view>
						</view>
					</li>
				</ul>
			</view>
			<view class="without" v-if="list.length == 0 && index != 1">
				<image src="https://aiwz.sdtyfy.com:8099/img/wu.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="confirm" @click="confirm" v-if="index === 1 && isHospitalization">
			立即充值
		</view>
		<Toast v-if="toastObj.state" @back="closeToast" :type="toastObj.type" :message="toastObj.message"/>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import { mapState } from 'vuex';
	import bar from '../components/bar.vue'
	import Toast from '../components/toast.vue'
	import registrationApi from '@/api/registrationApi.js'
	import hospitalizationApi from '@/api/hospitalizationApi.js'
	export default {
		components:{
			bar,
			Toast
		},
		data(){
			return {
				index:1,
				list: [],
				price: 300,
				loginValue: {},
				defaultValue: {},
				information: {},
				bankCardNo: '',
				deptName: '',
				toastObj:{
					state:false,
				},
				isHospitalization: false,
				priceList:[300,500,800,1000,1500,2000],
			}
		},
		computed: {
			...mapState(['footData']),
		},
		onLoad() {
			this.loginValue = uni.getStorageSync("loginData");
			this.defaultValue = this.loginValue.defaultArchives;
			this.getHospitalizationRecord()
			this.getPayRecord();
		},
		methods: {
			closeToast(state){
				this.toastObj.state = state
			},
			outpatientTopUp(num){
				this.index = num
				wx.setNavigationBarTitle({
					title: this.index===1 ? '住院充值' : '充值记录'
				})
			},
			priceClick(item){
				this.price = item
			},
			input(e){
				this.price = e.detail.value
			},
			getPayRecord() {
				let data = {
					cardNo: this.defaultValue.patientCard,
				}
				hospitalizationApi.getPayRecord(data).then(res => {
					this.list = [];
					if (res.data.code === 200) {
						res.data.data.map(v => {
							v.dateTime = dayjs(v.tradeTime).format('YYYY-MM-DD HH:mm:ss');
						})
						this.list = res.data.data;
					}
				});   
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
							let deptName = resData.ResultData.deptName;
							let splitName = deptName.includes('-') ? deptName.split('-') : deptName;
							splitName = deptName.includes('-') ? splitName[1] : splitName
							this.deptName = splitName;
							this.bankCardNo = resData.ResultData.patientHosId
							this.information = resData.ResultData;
							this.isHospitalization = true;
						}
					}
				});
			},
			confirm(){
				if(this.index===1){
					let randNum = Math.floor(1000000 + Math.random() * 9000000);
					let msg = {
						patientId: this.defaultValue.patientCard, //'370223196007020466',
						patientName: this.defaultValue.patientName, //'潘秀霞',
						subOpenId: this.loginValue.xcxOpenId,
						totalAmount: String(this.price*100), 
						merOrderId: '157Q-zy-'+dayjs().format('YYYYMMDDHHmmss')+'-'+randNum
					}
					try {
						registrationApi.registerOrder(msg).then(result => {
							if (result.data.errCode) {
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
										let resData = {
											patientId: this.bankCardNo,
											operId: 'YPZ', //mobile
											cash: totalAmount,
											cardNo: this.defaultValue.patientCard,
											tradeMode: 'CCBJRZYPLUS',
											bankCardNo: '',
											tradeTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
											outTradeNo: merOrderId,
											deptName: this.deptName
										}
										this.queryPayResultForToBePaid(resData)
										this.loading = {
											loadingState:false,
										}
									},
									fail:(err)=> {
										this.queryMedicalRecords()
									}
								});
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
				}
			},
			
			queryPayResultForToBePaid(data){
				//查询支付订单
				hospitalizationApi.hospitalDepositPrePay(data).then(res => {
					if( res.data.code == 200){
						this.toastObj = {
							state: true,
							type:'fail',
							message: '缴费成功',
						};
						this.getHospitalizationRecord();
						this.getPayRecord();
					} else {
						this.reFund(data);
					}
				})
				.catch(err => {
					console.log('errrrrr：', err);
				})
			},
			
			reFund(data) {
				registrationApi.refund({merOrderId: data.outTradeNo, refundAmount: data.cash, targerOrderId: ''}).then(r => {
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
		.application {
			width: 726rpx;
			background: #ffffff;
			border-radius: 16rpx;
			margin: 20rpx auto;
			
			.head {
				padding: 15rpx 0;
				margin: 0 20rpx;
				display: flex;
				justify-content: center;
				border-bottom: 2rpx solid #d1d9e3;
				font-weight: 600;
				font-size: 32rpx;
			}
			
			.middle {
				padding: 20rpx 0;
				margin: 0 20rpx;
				view {
					padding: 10rpx 0;
					text {
						&:first-child{
							color: #888888;
							display: inline-block;
							width: 130rpx;
						}
					}
				}
			}
		}
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
					// margin: 0 30rpx;
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
					// width: 628rpx;
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
				>ul {
					>li {
						margin: 0 20rpx;
						padding-top: 20rpx;
						border-bottom: 2rpx solid #eeeeee;
						.info {
							display: flex;
							margin: 16rpx 0;
							>view {
								width: 50%;
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
		.message {
			height: 80rpx;
			background: #f0f7ff;
			text-align: center;
			line-height: 80rpx;
			margin: 20rpx 20rpx 0;
			color: #4286ff;
		}
	}
</style>