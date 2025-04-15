<template>
	<view class="first">
		<view class="center" v-if="firstContent.queueName">
			<view class="title" v-if="callObj.deptName">
				<view class="clinic">
					{{callObj.deptName ?callObj.deptName :''}}
				</view>
				
				<view class=" title-calling">
					<view class="left">
					   <view class="no">
						    {{callObj.waitCallNo?callObj.waitCallNo+'号':''}}
					    </view>
						
					    <view class="text">
						    就诊序号
					    </view>
				    </view>
					<view class="middle">
					    <view class="call">
							{{callObj.callNo?callObj.callNo+'号':''}}
					    </view>
					    <view class="text">
						    正在呼叫
					    </view>
					</view>
				    <view class="right">
					    <view class="time">
				    		{{callObj.queueWaitNum?callObj.queueWaitNum:''}}
					    </view>
					    <view class="text">
						    等候人数
					    </view>
				    </view>
				</view>
			</view>
			<view class="wire-box wireState">
				<view class="wire" v-if="callObj.deptName">
					<image src="@/static/image/Group 679.png" mode=""></image>
				    <image src="@/static/image/Group 679.png" mode=""></image>
				</view>
			</view>
			<view class="content">
				<view class="icon" v-if="firstContent.queueName">
					<text>已签到</text>
					<image src="@/static/image/Union2.png" mode="widthFix"></image>
				</view>
				<ul>
					<li v-if="firstContent.queueName">
						<view class="attribute">
							挂号科室:
						</view>
						<view class="name">
							{{firstContent.queueName}}
						</view>
					</li>
					<li v-if="firstContent.doctorName">
						<view class="attribute">
							挂号医生:
						</view>
						<view class="name">
							{{firstContent.doctorName}}
						</view>
					</li>
					<!-- <li v-if="firstContent.callState=='已签到' && callObj.medicalTreatmentNumber">
						<view class="attribute">
							就诊序号:
						</view>
						<view class="name">
							{{callObj.medicalTreatmentNumber}}号
						</view>
					</li> -->
					<li v-if="firstContent.appointmentTime">
						<view class="attribute">
							预约时间:
						</view>
						<view class="name">
							{{firstContent.appointmentTime}}
						</view>
					</li>
					<li v-if="firstContent.queueLocation">
						<view class="attribute">
							科室位置:
						</view>
						<view class="name">
							{{firstContent.queueLocation}}
						</view>
					</li>
					<li v-if="firstContent.precautions">
						<view class="attribute">
							注意事项:
						</view>
						<view class="name">
							{{firstContent.precautions}}
						</view>
					</li>
					
				</ul>
				<view class="btn" v-if="firstContent.queueName">
					<view>
						<button class="cu-btn" @click="getQueueingMessage">刷新信息</button>
						<button class="cu-btn" @click="cancelRegistration">退号</button>
					    <!-- <button class="cu-btn" >更改预约</button>
					    <button class="cu-btn" >预约车位</button>
					    <button class="cu-btn" @click="navigation">导航到院</button> -->
					</view>
				</view>
				
				<!-- <view class="footer" v-else>
					<view>
						<text>初诊已经结束，请您移步至检查检验科室继续就诊</text>
					</view>
				</view> -->
				<view class="inquiry" v-if="firstContent.queueName">
					<view>
						<view class="inquiry-box">
							<view class="left">
								<image src="../../../static/image/inquiry.png" mode=""></image>
								<text>智能问诊</text>
							</view>
							<view class="inquiryBtn" @click="navigateToPage">
								去填写
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="subscribeObj.department">
			<view class="center">
				<view class="head" v-if="subscribeObj.days && subscribeObj.days!=='0'">
					<view class="">
						距离您的就诊日还有 {{subscribeObj.days}} 天
					</view>
				</view>
				<view class="wire-box wireState"></view>
				<view class="content">
					<view class="icon">
						<text>{{subscribeObj.days && subscribeObj.days!=='0'?'预约中':''}}</text>
						<!-- <image src="@/static/image/Union.png" mode="widthFix"></image> -->
						<image v-if="subscribeObj.days && subscribeObj.days!=='0'" src="@/static/image/Union2.png" mode="widthFix"></image>
					</view>
					<ul>
						<li v-if="subscribeObj.department">
							<view class="attribute">
								挂号科室:
							</view>
							<view class="name">
								{{subscribeObj.department}}
							</view>
						</li>
						<li v-if="subscribeObj.doctor">
							<view class="attribute">
								挂号医生:
							</view>
							<view class="name">
								{{subscribeObj.doctor}}
							</view>
						</li>
						
						<li v-if="subscribeObj.admitDate">
							<view class="attribute">
								预约时间:
							</view>
							<view class="name">
								{{subscribeObj.admitDate}}
							</view>
						</li>
						
					</ul>
					<view class="btn">
						<view>
							<button  v-if="subscribeObj.days>='0'" class="cu-btn" @click="cancelAppointmentRegister(subscribeObj.orderCode)">取消预约</button>
							<button v-if="subscribeObj.days==='0'" class="cu-btn" @click="takeANumberPrePay(subscribeObj)">预约取号</button>
						</view>
					</view>
					
				</view>
			</view>
		</view>
		
		<Toast v-if="toastObj.state" @back="closeToast" :type="toastObj.type" :message="toastObj.message"/>
	</view>
</template>

<script>
	import guideApi from '@/api/guideApi.js'
	import mixin from '@/mixins/mixin'
	import bus from '@/utils/bus.js'
	import Toast from '../../../components/toast.vue'
	import { mapState } from 'vuex'
	export default {
		components:{ Toast },
		mixins: [mixin],
		props: { headerEmit: Object },
		data() {
			return {
				firstContent:{},
				subscribeList:[],
				subscribeObj:{},
				callObj:{
					calling:'',
					departmentName:'',
					expectToWait:'',
					medicalTreatmentNumber:''
				},
				toastObj:{
					state:false,
				},
				headerEmiter: {
					state:''
				},
				timer:null,
				timer2:null,
				timer3:null,
			}
		},
		created() {
			bus.$on('complex-data-passed',(data)=>{
				if(data.data.length){
					data.data.forEach(e => {
						console.log(e.visitNumber,'======',this.department.visitNumber)
						if(e.visitNumber===this.department.visitNumber){
							console.log('-----');
							this.firstContent = e
							this.getQueueingMessage()
						}else if(e.orderNo === this.department.visitNumber){
							console.log('000000')
							this.subscribeObj = e;
						}
					})
				}else{
					this.firstContent = {}
					this.subscribeObj = {}
					this.$set(this.headerEmiter,'state','')
					this.$emit('handle',this.headerEmiter)
					
				}
				// 回传的effectState  渐入效果渲染
				if(data.effectState){
					this.$emit('handle')
				}
			})
		},
		mounted() {
			// 只有初次创建需要渐入效果  effectState为true
			bus.$emit('refreshGetFirstVisit',{firstState:true,effectState:true})
			if(this.timer3){
				clearInterval(this.timer3)
				this.timer3 = null
			}
			this.timer3 = setInterval(()=>{
				bus.$emit('refreshGetFirstVisit',{firstState:true,effectState:false})
			},20000)
			
		},
		beforeDestroy(){
			bus.$off('complex-data-passed')
			clearInterval(this.timer)
			clearTimeout(this.timer2)
			clearInterval(this.timer3)
			this.timer3 = null
			
		},
		computed: {
			...mapState(['footData','department']),
		},
		
		methods: {
			closeToast(state){
				this.toastObj.state = state
			},
			navigation(){
				let latitude = 36.183242794928994
				let longitude = 117.07709640617486
				wx.openLocation({
					latitude: latitude,//目的地的纬度
					longitude: longitude,//目的地的经度
					name: '青岛西海岸新区第二中医院', 
				})
			},
			navigateToPage() {
				let data = JSON.stringify(this.firstContent)
				console.log(data);
				uni.navigateTo({
					url: '/sub_packages/convenientModule/inquiry?params='+data
				});
			},
			// 退号
			async cancelRegistration() {
				try{
					const res= await guideApi.cancelRegistration(this.firstContent.visitNumber).then((res) => {
						if(res.data.code===200){ 
							this.toastObj = {
								state:true,
								message:'退号成功',
							}
							this.timer2 = setTimeout(()=>{
								let msg = {
									callingInterface:true,   //调用接口
									firstState:true,     //初诊组件
									effectState:false,   //动态效果
								}
								bus.$emit('refreshGetFirstVisit',msg)
								clearTimeout(this.timer2)
								
							},4000)
						}else {
							this.toastObj = {
								state:true,
								type:'fail',
								message:res.data.msg,
							}
						}
						
				            })
				}catch(e){
					this.toastObj = {
						state:true,
						type:'fail',
						message:e.toString(),
					}
				}
			},
			// 取消预约
			async cancelAppointmentRegister(orderCode) {
				try{
					const res= await guideApi.cancelAppointmentRegister(orderCode).then((res) => {
						if(res.data.code===200){ 
							this.toastObj = {
								state:true,
								message:'取消预约成功',
							}
							this.timer2 = setTimeout(()=>{
								let msg = {
									callingInterface:true,   //调用接口
									firstState:true,     //初诊组件
									effectState:false,   //动态效果
								}
								bus.$emit('refreshGetFirstVisit',msg)
								clearTimeout(this.timer2)
							},4000)
						}else {
							this.toastObj = {
								state:true,
								type:'fail',
								message:res.data.msg,
							}
						}
						
				            })
				}catch(e){
					this.toastObj = {
						state:true,
						type:'fail',
						message:e.toString(),
					}
				}
			},
			// 预约取号
			async takeANumberPrePay (item) {
				try{
					let loginValue = uni.getStorageSync("loginData");
					let data = JSON.parse(loginValue)
					const msg = {
					  patientID: this.footData.patientUniquelyIdentifies,
					  patientName: this.footData.patientName,
					  patientOpenid:data.xcxOpenId,
					  orderCode:item.orderCode,
					  amount:item.regFee,
					};
					const res= await guideApi.takeANumberPrePay(msg).then((result) => {
						if(result.data.code===200){
							let obj = result.data.data.prePayResponse
							uni.requestPayment({
								provider: 'wxpay', // 服务提提供商
								timeStamp: obj.body.miniPayRequest.timeStamp, // 时间戳
								nonceStr: obj.body.miniPayRequest.nonceStr, // 随机字符串
								package: obj.body.miniPayRequest.pkg,
								signType: obj.body.miniPayRequest.signType, // 签名算法
								paySign: obj.body.miniPayRequest.paySign, // 签名
								success: (res)=> {
									uni.showLoading({
										title:'正在查询结果'
									})
									this.queryPayResultForTakeANumber(result.data.data)
								},
								fail:(err)=> {
									console.log('支付失败',err);
								}
							});
						}else {
							this.toastObj = {
								state:true,
								type:'fail',
								message:res.data.msg,
							}
						}
						
				            })
				}catch(e){
					this.toastObj = {
						state:true,
						type:'fail',
						message:e,
					}
				}
			},
			// 查询取号的支付结果
			async queryPayResultForTakeANumber(data){
				try{
					const res= await guideApi.queryPayResultForTakeANumber(data).then((res) => {
						if(res.data.code===200){ 
							// 让headerBar更新数据
							let msg = {
								callingInterface:true,   //调用接口
								firstState:true,     //初诊组件
								effectState:false,   //动态效果
							}
							bus.$emit('refreshGetFirstVisit',msg)
							uni.hideLoading()
							this.toastObj = {
								state:true,
								message:res.data.msg,
							}
						}else{
							this.toastObj = {
								state:true,
								type:'fail',
								message:res.data.msg,
							}
						}
						
				            })
				}catch(e){
					this.toastObj = {
						state:true,
						type:'fail',
						message:e,
					}
				}
			},
			// 刷新信息
			async getQueueingMessage() {
				// try{
				// 	let data = {
				// 		patientID:this.footData.patientUniquelyIdentifies,
				// 		DepartmentCode:this.firstContent.queueId,
			 //        }
				// 	const res= await guideApi.getQueueingMessage(data).then((res) => {
				// 		if(res.data.code===200){
				// 			this.callObj = res.data.data.queLists.queList[0] || {}
				// 		}else{
				// 			// this.toastObj = {
				// 			// 	state:true,
				// 			// 	type:'fail',
				// 			// 	message:res.data.msg,
				// 			// }
				// 		}
			 //                })
				// }catch(e){
				// 	this.toastObj = {
				// 		state:true,
				// 		type:'fail',
				// 		message:e,
				// 	}
				// }
			},
			
		},
		
		
	}
</script>

<style lang="less">
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
	.first{
		// background: fuchsia;
		
		.center {
			margin:28rpx 33rpx 0 33rpx;
			width: 684rpx;
			background: #ffffff;
			border-radius: 12rpx;
			
			&:last-of-type{
				margin:28rpx 33rpx 28rpx 33rpx;
			}
			.head {
				padding-top: 10rpx;
				view{
					width: 654rpx;
					height: 84rpx;
					border-radius: 14rpx;
					color: #499fff;
					background: #f4faff;
					margin: 10rpx auto;
					font-size: 32rpx;
					line-height: 32rpx;
					font-weight: 500;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				
			}
			
			.title {
				.clinic{
					width: 646rpx;
					height: 56rpx;
					line-height: 36rpx;
					background: #5cb5ff;
					border-radius: 12rpx;
					margin:  22rpx auto;
					transform: translate(0,20rpx);
					font-size: 36rpx;
					color: #ffffff;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				
				
				.title-calling{
					height: 95rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					font-size: 30rpx;
					.left {
					width: 33.33%;
					
					
					.no{
						font-weight: 600;
					}
					.text {
						color: #aaaaaa;
						font-size: 22rpx;
					}
				}
				.middle {
					width: 33.33%;
					border-left: 4rpx solid #DDDDDD;
					border-right:  4rpx solid #DDDDDD;
					.call{
						font-weight: 600;
					}
					.text {
						color: #aaaaaa;
						font-size: 22rpx;
					}
				}
				.right {
					width: 33.33%;
					
					.time {
						font-weight: 600;
					}
					.text {
						font-size: 22rpx;
						color: #aaaaaa;
					}
				}
				}
				
			}
			.wire-box{
				height: 10rpx;
				>.wire {
					display: flex;
					align-items: center;
					justify-content: space-between;
				    height: 0rpx;
				    border: 4rpx solid #eeeeee;
				
				    image{
					    width: 10rpx;
					    height: 36rpx;
					    margin: 0 10rpx;
				    }
			    }
			    .wireState {
			    	border: 2rpx solid #ffffff;
			    }
			}
			.content {
				margin-top: 3%;
				padding-bottom: 2.4%;
				position: relative;
				
				.icon {
					position: absolute;
					width: 110rpx;
					height: 52rpx;
					line-height: 52rpx;
					right: -12rpx;
					display: flex;
					flex-direction: column;
					text {
						display: inline-block;
						z-index: 1;
						color: #ffffff;
						font-size: 25rpx;
						
					}
					image {
						position: absolute;
						top: -10rpx;
						width: 110rpx;
						height: 52rpx;
						
						
					}
				}
				
				ul {
					li {
						margin:0 6% 0 4%;
						width: 90%;
						display: flex;
						
						&:first-of-type{
							// margin:3% 6% 0 4%;
						}
						
						.attribute{
							min-height: 36rpx;
							line-height: 36rpx;
							color: #888888;
							width: 22%;
							display: flex;
							margin-bottom:2%;
							justify-content: left;
						}
						
						.name {
							min-height: 36rpx;
							line-height: 36rpx;
							display: flex;
							align-items: center;
							flex-wrap: wrap;
							text-align: left;
							margin-bottom:2%;
							width: 70%;
						}
					}
				}
				
				.btn {
					view {
						display: flex;
						justify-content: center;
						
						// button {
							
						// 	width: 270rpx;
						// 	margin: 0 30rpx 24rpx 30rpx;
						// 	height: 72rpx;
						// 	line-height: 72rpx;
						// 	background: linear-gradient(350deg,#479cff 0%, rgba(71,216,251,0.80) 100%);
						// 	border-radius: 70rpx;
						// 	font-size: 35rpx;
						// 	color: #ffffff;
						// 	font-family: Source Han Sans CN, Source Han Sans CN-500;
						// 	font-weight: 500;
						// }
						button {
							
							width: 270rpx;
							margin: 30rpx 20rpx 24rpx 20rpx;
							height: 72rpx;
							line-height: 35rpx;
							background: linear-gradient(350deg,#479cff 0%, rgba(71,216,251,0.80) 100%);
							border-radius: 70rpx;
							font-size: 35rpx;
							color: #ffffff;
							font-family: Source Han Sans CN, Source Han Sans CN-500;
							font-weight: 500;
						}
					}
				}
				.footer {
					border-top: 2rpx solid #eeeeee;
					width: 94%;
					margin: 0 3%;
					height: 80rpx;
					font-size: 26rpx;
					line-height: 26rpx;
					color: #777777;
					display: flex;
					align-items: center;
					justify-content: center;
					view{
						text{
							
						}
					}
				}
				.inquiry{
					display: flex;
					justify-content: center;
					> view {
						display: flex;
						align-items: center;
						width: 654rpx;
						height: 92rpx;
						background: #f4faff;
						border-radius: 14rpx;
						margin-bottom:24rpx;
						
						.inquiry-box {
							width: 100%;
							height: 60rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin: 0 25rpx;
							
							.left {
								display: flex;
								align-items: center;
								height: 52rpx;
								image {
									width: 60rpx;
									height: 60rpx;
									margin-right: 10rpx;
								}
								text {
									font-size: 32rpx;
									font-weight: 500;
									color: #499fff;
									line-height: 32rpx;
									font-family: Source Han Sans CN, Source Han Sans CN-500;
									font-weight: 500;
									
								}
								
							}
							.inquiryBtn {
								display: flex;
								justify-content: center;
								align-items: center;
								width: 130rpx;
								height: 50rpx;
								font-size: 28rpx;
								line-height: 24rpx;
								color: #ffffff;
								background: #49a0ff;
								border-radius: 38rpx;
							}
						}
					}
					
				}
			}
		}
	}
</style>
