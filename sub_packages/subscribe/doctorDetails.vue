<template>
	<view class="doctorsDetails">
		<view class="middle">
			<view class="center">
				<view class="datum">
					<view class="img"><image src="../../static/image/doctor.png" mode=""></image></view>
					<view class="message">
						<view class="name">
							<text>{{doctor.DoctorName||''}}</text>
							<text>{{doctor.DoctorSessType||''}}</text>
						</view>
						<view class="synopsis"></view>
					</view>
				</view>
				<view class="information">
					<view>
						<text>就诊科室</text>
						<text>{{doctor.clinic || ''}}</text>
					</view>
					<view>
						<text>科室地点</text>
						<text>{{doctor.AdmitAddress ? doctor.AdmitAddress : ''}}</text>
					</view>
					<view>
						<text>诊查费</text>
						<text class="money">￥{{doctor.Fee || ''}}</text>
					</view>
					<view>
						<text>就诊日期</text>
						<view class="time">
						    <text>{{doctor.ServiceDate||''}} {{doctor.SessionName||''}}</text>
						</view>
					</view>
					<view>
						<text>就诊时间</text>
						<view class="time">
							<text>{{doctor.StartTime||''}}-{{doctor.EndTime||''}}</text>
							<!-- <image src="@/static/image/more/FrameRight.png" mode=""></image> -->
						</view>
					</view>
				</view>
			</view>
			<view class="me">
				<view class="title">
					就诊人
				</view>
				<view class="name">
					<text>{{siginData.patientName ? siginData.patientName:''}}</text>
					<!-- <image src="@/static/image/more/FrameRight.png" mode=""></image> -->
				</view>
			</view>
			<view class="tips">
				<view class="tips-head">
					温馨提示
				</view>
				<view class="tips-middle">
					<view v-for="(item,index) in tipsList" :key="index">
						<text>★</text>
						<text>{{item}}</text>
					</view>
				</view>
			</view>
			<view class="btn">
				<view class="confirm" @click="confirm">
					<text>确定预约</text>
				</view>
				<view class="agreement">
					<view @click="agreementState = !agreementState">
					<image v-if="agreementState" src="../static/image/icon-ok.png" mode=""></image>
					<text v-else class="yuan"></text>
					<text>预约即同意</text>
					</view>
					<text class="blue" @click="appointment">《预约须知》</text>
				</view>
			</view>
			
			<uni-popup ref="QRCodePopup" type="center" :is-mask-click="false" background-color="#fff">
				<view class="pay-box">
					<view class="text-center">微信扫一扫</view>
					<canvas canvas-id="qrcode" style="width: 300rpx;height: 300rpx;"></canvas>
					<view class="text-center">请用本人微信扫描以上二维码</view>
					<button @click="closeQRCodePopup">关闭</button>
				</view>
			</uni-popup>
			
		</view>
		<Toast v-if="toastObj.state" @back="closeToast" :type="toastObj.type" :url="toastObj.url" :tips="toastObj.tips" :message="toastObj.message" />
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import { mapState } from 'vuex'
	import Toast from '../components/toast.vue'
	import registrationApi from '@/api/registrationApi.js'
	import guideApi from '@/api/guideApi.js'
	import healthCard from '@/api/healthCard.js'
	
	export default {
		components:{
			Toast,
		},
		data() {
			return {
				doctor:{
					ServiceDate:'',
					hour:'',
					DoctorName:'',
					DoctorSessType:'',
					Fee:'',
					clinic:'',
					StartTime:'',
					EndTime:''
				},
				toastObj:{
					state:false,
				},
				agreementState:false,
				tipsList:[
					'请使用患者本人身份证和医保卡(或医保电子凭证)进行预约挂号，儿童请用儿童身份证或身份信息。',
					'如需取消预约，请在就诊前一日取消。',
					'请按照候诊时间提示到医院等待就诊，请勿迟到根据国家医保政策规定，医保患者住院期间一律不得使用医保账户支付门诊费用，否则将影响住院费用的医保报销结算。',
					'同一身份证号码，30天内总计爽约5次，进入黑名单14天，14天内不能预约就诊，可以现场挂号，14天后黑名单自动解除。黑名单触发三次以上拉黑90天。'
				],
				parentName: [
					{name: '内科', index: '0300'},
					{name: '外科部', index: '0400'},
					{name: '妇产科门诊', index: '0500'},
					{name: '儿科门诊', index: '0700'},
					{name: '眼科门诊', index: '1000'},
					{name: '视光门诊', index: '1000'},
					{name: '耳鼻喉科门诊', index: '1100'},
					{name: '口腔治疗门诊', index: '1200'},
					{name: '口腔修复门诊', index: '1200'},
				],
				QRCodePopup: null,
				isShowPay: false,
				payUrl: '',
				siginData: {},
				loginValue: {},
				doctorInfo: {},
				lockId: '',
				regMode: '',
				parentDeptName: '',
				detailName: '',
			}
		},
		computed: { 
			...mapState(['footData']),
		},
		methods: {
			closeToast(state){
				this.toastObj = {
					state:state,
				}
			},
			appointment(){
				uni.navigateTo({
					url:`/sub_packages/agreement/appointment`
				})
			},
			confirm(){
				if(!this.agreementState){
					uni.showToast({
					    title: '请先阅读预约须知',
					    icon: 'none',   
					    duration: 2000 
					}) 
					 return
				}
				let loginValue = uni.getStorageSync("loginData");
				if (loginValue) {
					this.today(loginValue)
				} else {
					uni.navigateTo({ url:"/sub_packages/family/familyManage" })
				}
			},
			today(data){
				//锁号
				let lockNumData = {
					cardNo: this.siginData.patientCard,
					cardType: 1,
					scheduleId: this.doctor.scheduleId,
					doctCode: this.doctor.scheduleItemCode,
					medAmPm: this.doctor.medAmPm,
					medDate: this.doctor.ServiceDate,
					deptCode: this.doctorInfo.deptCode,
					patientName: this.siginData.patientName,
					version: 1,
					regMode: this.regMode,
					appoNo: this.doctor.appoNo,
					medBegTime: this.doctor.StartTime,
					medEndTime: this.doctor.EndTime,
				}
				registrationApi.registrationLock(lockNumData).then(r => {
					let res = JSON.parse(r.data.msg);
					if(!res.success) {
						uni.showToast({
							title: res.msg,
							icon: 'none',   
							duration: 2000 
						})
					} else {
						//用卡检测数据接口（电子健康卡）
						let parentDeptName = ['外科部', '内科'];
						let department = '';
						if (parentDeptName.includes(this.parentDeptName)) {
							let filter = this.parentName.filter(x => x.name == this.parentDeptName);
							department = filter[0].index;
						} else {
							let filterRes = this.parentName.filter(x => x.name == this.detailName);
							if (filterRes.length > 0) {
								department = filterRes[0].index;
							} else {
								department = '1800'
							}
						}
						
						let healthCardData = {
							qrCodeText: this.siginData.qrCodeText,
							time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
							hospitalCode: '40088',
							scene: '0101011',
							department,
							cardType: '11',
							cardChannel: '0402',
							cardCostTypes: '0100',
							openId: this.loginValue.xcxOpenId,
						}
						healthCard.reportHISData(healthCardData).then(healthRes => {
						});
						
						let lockId = res.data.lockId;
						
						let randNum = Math.floor(1000000 + Math.random() * 9000000);
						let datas = { 
							lockId,
							patientId: this.siginData.patientCard,
							patientName: this.siginData.patientName,
							subOpenId: data.xcxOpenId,
							totalAmount: String(this.doctor.Fee * 100), 
							merOrderId: '157Q-'+dayjs().format('YYYYMMDDHHmmss')+'-'+randNum,
							uploadData: {
								lockId,
								accountNo: '',
								cardNo: this.siginData.patientCard,
								deptCode: this.doctor.deptCode,
								doctCode: this.doctor.doctCode,
								extend: this.doctorInfo.extend,
								idNo: this.siginData.patientCard,
								medAmPm: this.doctor.medAmPm,
								medDate: this.doctorInfo.medDate,
								patientId: this.siginData.patientUniquelyIdentifies,
								patientName: this.siginData.patientName,
								scheduleId: this.doctor.scheduleId,
							}
						}
						registrationApi.registerOrder(datas).then(res => {
							let { merOrderId, totalAmount } = res.data;
							uni.requestPayment({
								provider: 'wxpay', // 服务提提供商
								timeStamp: res.data.miniPayRequest.timeStamp, // 时间戳
								nonceStr: res.data.miniPayRequest.nonceStr, // 随机字符串
								package: res.data.miniPayRequest.package,
								signType: res.data.miniPayRequest.signType, // 签名算法
								paySign: res.data.miniPayRequest.paySign, // 签名
								success:(result)=> {
									//支付成功
									let msg = {
										patientId: this.siginData.patientCard,
										patientName: this.siginData.patientName,
										orderSum: totalAmount,
										targetOrderId: '',
										merOrderId,
										lockId
									}
									//查询支付记录
									registrationApi.queryPayResult(msg).then(r => {
										if (r.data.code === 200) {
											let resMsg = JSON.parse(r.data.msg);
											let uploadOrder = {
												accountNo: '',
												cardNo: this.siginData.patientCard,
												cardType: '1',
												cash: resMsg.invoiceAmount,
												deptCode: this.doctor.deptCode,
												doctCode: this.doctor.doctCode,
												extend: this.doctorInfo.extend,
												idNo: this.siginData.patientCard,
												lockId,
												medAmPm: this.doctor.medAmPm,
												medDate: this.doctorInfo.medDate,
												patientId: this.footData.patientUniquelyIdentifies,
												patientName: this.siginData.patientName,
												scheduleId: this.doctor.scheduleId,
												tradeMode: 'CCBJRZYPLUS',
												tradeTime: resMsg.responseTimestamp,
												outTradeNo: resMsg.targetOrderld,
												transNo: resMsg.targetOrderId,
												merOrderId,
											}
											//上传支付订单信息
											registrationApi.registrationSettlement(uploadOrder).then(uploadRes => {
												let uploadResult = JSON.parse(uploadRes.data.msg);
												if (uploadResult.success) {
													this.toastObj = {
														state:true,
														message:'预约成功',
														url:'/pages/convenient/index',
													}
												} else {
													//上传失败进行解锁+退款
													let refundData = {
														merOrderId: resMsg.merOrderId, 
														refundAmount: resMsg.invoiceAmount, 
														targerOrderId: resMsg.targetOrderld
													}
													//退款
													registrationApi.refund(refundData).then(r => {
														//支付失败，取消锁号
														let unLockNumData = {
															lockId,
															version: 1,
														}
														registrationApi.unRegistrationLock(unLockNumData).then(r => {})
													})
													this.toastObj = {
														state:true,
														message: uploadResult.msg,
														url:'/pages/more/index',
													}
												}
											});
											//退款
											// registrationApi.refund({merOrderId: resMsg.merOrderId, refundAmount: resMsg.invoiceAmount, targerOrderId: resMsg.targetOrderld}).then(r => {
											// 	console.log(JSON.stringify(r.data))
											// })
										}
									}).catch(err => {
										console.log('errrrrr：', err);
									})
								},fail:(err)=> {
									//支付失败，取消锁号
									let unLockNumData = {
										lockId,
										version: 1,
									}
									registrationApi.unRegistrationLock(unLockNumData).then(r => {
										let res = JSON.parse(r.data.msg);
										if (res.success) {
											this.toastObj = {
												state:true,
												type:'fail',
												message:'支付失败，取消锁号'
											}
										}
									})
								}
							})		
						})
					}
				})
			},
			timeBtn(item){
				this.timevisitTable = item
				// uni.navigateBack({
				//     delta: 2
				// });
			},
		},
		onLoad(e) {
			wx.setNavigationBarTitle({title: e.title})
			this.doctor = JSON.parse(decodeURIComponent(e.doctor));
			let data = uni.getStorageSync('loginData');
		  this.loginValue = data;
			this.siginData = data.defaultArchives ? data.defaultArchives : {};
			this.doctorInfo = JSON.parse(decodeURIComponent(e.detail));
			this.regMode = e.regMode;
			this.parentDeptName = e.parentDeptName;
			this.detailName = e.detailDept;
		},
	}
</script>

<style lang="less" scoped>
    .doctorsDetails {
	    width: 100vw;
	    height: 100%; 
	    background-color: #f5f5f5;
	    display: flex;
		// align-items: center;
	    flex-direction: column;
		
		.middle {
			overflow: auto;
			margin: 15rpx  0 50rpx 0;
			
			.center {
				width: 680rpx;
				height: 480rpx;
				background: #ffffff;
				border-radius: 11.45rpx;
				margin: 25rpx auto;
				
			
				
				.datum{
					margin:0 10rpx;
					padding: 17rpx 0;
					display: flex;
					
					.img{
						width: 122.14rpx;
						height: 152.67rpx;
						border-radius: 9.54rpx;
						image{
							width: 122.14rpx;
							height: 152.67rpx;
							border-radius: 9.54rpx;
						}
					}
					.message {
						margin-left:24rpx;
						.name {
							display: flex;
							align-items: center;
							position: relative;
							text {
								
								&:nth-of-type(1){
									font-size: 36rpx;
									line-height: 27rpx;
									margin-right: 20rpx;
								}
								&:nth-of-type(2){
									font-size: 30rpx;
									line-height: 23rpx;
									color: #999999;
									margin-right: 20rpx;
								}
							}
						}
						.synopsis {
							width: 508rpx;
							height: 99rpx;
							margin-top: 18rpx;
							font-size: 23rpx;
							line-height: 26rpx;
							color: #999999;
							overflow: hidden;
							display: -webkit-box; //将元素设为盒子伸缩模型显示
							-webkit-box-orient: vertical; //伸缩方向设为垂直方向
							-webkit-line-clamp: 4;  //超出3行隐藏，并显示省略号
							
						}
					}
				}
				.information {
					> view {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 30rpx;
						margin: 16rpx 20rpx;
						
						> text {
							&:first-child{
								color: #999999;
							}
						}
						.money{
							color: #FFC03D;
						}
						.time {
							display: flex;
							align-items: center;
							color: #4286FF;
							text {
								margin-left: 20rpx;
							}
							
							.twoDays {
								width: 64.89rpx;
								height: 26.72rpx;
								background: #fffaf0;
								border-radius: 17.18rpx;
								color: #FFC03D;
								font-size: 15.27rpx;
								display: flex;
								justify-content: center;
								align-items: center;
							
							}
							
							image {
								width: 27rpx;
								height: 27rpx;
								margin-left: 10rpx;
							}
						}
						
												
					}
				}
			}
			.me {
				width: 680rpx;
				height: 72rpx;
				background: #ffffff;
				border-radius: 11.45rpx;
				margin: 25rpx auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 27rpx;
				
				>.title {
					color: #999999;
					line-height: 27rpx;
					margin-left: 20rpx;
				}
				>.name {
					margin-right: 20rpx;
					color: #4286ff;
					display: flex;
					align-items: center;
					
					text {
						line-height: 27rpx;
					}
					
					image {
						width: 27rpx;
						height: 27rpx;
						margin-left: 10rpx;
					}
				}
			}
			.tips {
				width: 680rpx;
				height: 500rpx;
				background: #ffffff;
				border-radius: 11.45rpx;
				margin: 25rpx auto;
				
				.tips-head {
					margin: 20rpx 15rpx;
					padding-top: 20rpx;
				}
				
				.tips-middle {
					> view {
						margin: 20rpx 15rpx;
						display: flex;
						font-size: 22.9rpx;
						line-height: 40 rpx;
						
						&:first-child{
							color: #FFC03D;
						}
						
						text {
							&:first-child{
								margin-right: 14rpx;
							}
						}
					}
				}
			}
			.btn {
				width: 100%;
				position: absolute;
				bottom: 110rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.confirm{
					width: 681.3rpx;
					height: 87.79rpx;
					background: #4286ff;
					border-radius: 43.89rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #ffffff;
					font-size: 30.53rpx;
					line-height: 30.53rpx;
					margin-bottom: 40rpx;
					
					text {
						letter-spacing: 4rpx;
						padding-left: 4rpx;
					}
					
				}
				.agreement {
					display: flex;
					align-items: center;
					justify-content: center;
					color: #999999;
					
					>view {
						display: flex;
						align-items: center;
						justify-content: center;
						.yuan{
							width: 26rpx;
							height: 26rpx;
							border: 2rpx solid #999999;
							border-radius: 50%;
							margin-right: 15rpx;
						}
						image {
							width: 32rpx;
							height: 32rpx;
							margin-right: 12rpx;
						}
					}
					
					
					.blue {
						color: #076AFF;
					}
					
				}
			}
			
		}
		
	}
</style>
