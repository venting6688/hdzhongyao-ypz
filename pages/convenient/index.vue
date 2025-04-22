<template>
	<view class="box">
		<view class="head" :class="{convenient:footState===2}">
			<image class="background" src="../../static/image/bjdy.png" mode="widthFix"></image>
			<view class="dist">
				<ul v-if="footState===2 && departmentList.length">
					<li v-for="(item,index) in departmentList" :key="index">
						<view class="test" @click="departmentBtn(item,index)"  :class="{ barBackground: headerEmit.visitNumber == item.visitNumber || headerEmit.visitNumber==item.orderNo }">
							<view>{{item.queueName?item.queueName.replace('门诊',''):''}}</view>
							<view>{{item.doctorName?item.doctorName:''}}</view>
						</view>
						<view class="wire">
						</view>
					</li>
				</ul>
			</view>
		</view>
		<view class="scroll-Y">
			<view class="first" v-if="departmentList.length">
				<!-- <view class="bar" v-if="footState===2 && departmentList.length">
					<view v-for="(item,index) in barList" @click="throttle_btns(index,item.number)" class="barList" :key="index">
						<view class="bar-name" :class="{ barColor:item.number==1 }">
							<view>
								<text :class="{ barBackground: item.state==item.name }">{{ item.name }}</text>
							</view>
						</view>
					</view>
				</view> -->
				<view class="center" v-if="firstContent.queueName">
					<view class="content">
						<view class="icon" v-if="firstContent.queueName">
							<text>已预约</text>
							<image src="@/static/image/Union2.png" mode="widthFix"></image>
						</view>
						<ul>
							<li v-if="firstContent.deptName">
								<view class="attribute">挂号科室:</view>
								<view class="name">{{firstContent.deptName}}</view>
							</li>
							<li v-if="firstContent.doctName">
								<view class="attribute">挂号医生:</view>
								<view class="name">{{firstContent.doctName}}</view>
							</li>
							<li v-if="firstContent.medDate">
								<view class="attribute">预约时间:</view>
								<view class="name">{{firstContent.medDate}} {{firstContent.medTime}}</view>
							</li>
							<li v-if="firstContent.address">
								<view class="attribute">科室位置:</view>
								<view class="name">{{firstContent.address}}</view>
							</li>
							<li v-if="firstContent.precautions">
								<view class="attribute">注意事项:</view>
								<view class="name">
									{{firstContent.precautions}}
								</view>
							</li>
						</ul>
						<view class="btn" v-if="firstContent.queueName">
							<view>
								<!-- <button class="cu-btn" @click="getQueueingMessage">刷新信息</button> -->
								<button class="cu-btn" @click="cancelRegistration(firstContent)">退号</button>
							</view>
						</view>
						<view class="inquiry" v-if="firstContent.queueName && subscribeObj.days >= 0">
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
				<view v-if="subscribeObj.deptName">
					<view class="center">
						<view class="head" v-if="subscribeObj.days != undefined" style="height: 90rpx;">
							<view>
								距离您的就诊日还有 {{subscribeObj.days}} 天
							</view>
						</view>
						<view class="head" v-if="subscribeObj.minutes != undefined">
							<view @click="showRecord">就诊已完成，请查看就诊报告</view>
						</view>
						<view class="wire-box wireState"></view>
						<view class="content">
							<view class="icon">
								<text>{{subscribeObj.days && subscribeObj.days!=='0' ? '预约中' : '完成'}}</text>
								<!-- <image src="@/static/image/Union.png" mode="widthFix"></image> -->
								<image  src="@/static/image/Union2.png" mode="widthFix"></image>
							</view>
							<ul>
								<li v-if="subscribeObj.deptName">
									<view class="attribute">挂号科室:</view>
									<view class="name">{{subscribeObj.deptName}}</view>
								</li>
								<li v-if="subscribeObj.doctName">
									<view class="attribute">挂号医生:</view>
									<view class="name">{{subscribeObj.doctName}}</view>
								</li>
								<li v-if="subscribeObj.medDate">
									<view class="attribute">预约时间:</view>
									<view class="name">{{subscribeObj.medDate}} {{subscribeObj.medTime}}</view>
								</li>
							</ul>
							<view class="btn">
								<view>
									<button  v-if="subscribeObj.days>='0'" class="cu-btn" @click="cancelRegistration(subscribeObj)">退号</button>
									<!-- <button v-if="subscribeObj.days==='0'" class="cu-btn" @click="takeANumberPrePay(subscribeObj)">预约取号</button> -->
								</view>
							</view>
							<view class="inquiry" v-if="subscribeObj.queueName && subscribeObj.days >= 0">
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
				</view>
			</view>
			<!-- 暂无信息 -->
			<view class="without" v-else>
				<image src="@/sub_packages/static/image/no-data.png" mode="widthFix" style="width: 300rpx;"></image>
				<text>未查询到您的挂号信息</text>
			</view>
		</view>
		<foot :footState="footState"/>
	</view>
</template>
<script>
	import {mapState,mapMutations} from 'vuex'
	import foot from '@/components/footer.vue'
	import zanwu from '@/sub_packages/components/zanwu.vue'
	import moment from 'moment'
	import guideApi from '@/api/guideApi.js'
	import registrationApi from '@/api/registrationApi.js'
	import mixin from '@/mixins/mixin'
	import bus from '@/utils/bus.js'
	export default {
		components:{
			foot,
		},
		data() {
			return {
				animationData: {},
				footState:2,
				message:'',
				moveState:true,
				timer:null,
				convenientState:true,
				signData: {},
				barList: [{
						name:'预约',
						number:'1',
						state:'预约'
					}
				],
				departmentList:[],
				headerEmit:{
					visitNumber:'',
					orderNo:'',
					userId:'',
					state:'初诊',
				},
				firstContent: {},
				subscribeObj: {},
				toastObj:{
					state:false,
					message: '',
				},
			}
		},
		computed: {
			...mapState({ 
				footData: state => state.footData,
				showState: state => state.showState,
				visitNumber: state => state.department.visitNumber,
			}),
		},
		mounted() {
			let data = uni.getStorageSync('loginData');
			this.signData = data.defaultArchives ? data.defaultArchives : {};
			this.getFirstVisit();
		},
		methods: {
			...mapMutations({
				setDepartment:'SET_DEPARTMENT',
			}),
			closeToast(state){
				this.toastObj = {
					state:state,
				}
			},
			showRecord() {
				uni.navigateTo({
					url: `/sub_packages/report/index`
				})
			},
			//获取挂号数据
			getFirstVisit() {
				let data = uni.getStorageSync('loginData');
				let siginData = data.defaultArchives;
				const time = {
					startDate: moment().format('YYYY-MM-DD'),
					endDate: moment().add(7, 'days').format('YYYY-MM-DD')
				};
				const msg = {
				  cardNo: siginData.patientCard,
					cardType: 1,
				  startDate: time.startDate,
				  endDate: time.endDate,
					version: 1,
					status: 1,
				};
				guideApi.registrationRecord(msg).then(res => {
					let result = JSON.parse(res.data.msg);
					if(result.success){
						let nowDate = moment().format('YYYY-MM-DD');
						let subscribeList = result.data.map(item => {
							let medDate = moment(item.medDate) 
							item.days = medDate.diff(nowDate, 'days');
							return {
								...item,
								queueName:item.deptName,
								doctorName:item.doctName,
							}
						}) || []
						this.departmentList =[...subscribeList]
						this.departmentList.sort((a, b) => {
							let timeA = new Date(`${a.medDate} ${a.medTime}`).getTime();
							let timeB = new Date(`${b.medDate} ${b.medTime}`).getTime();
							return timeB - timeA;
						})
						
						if(this.departmentList.length){
							let found = false
							// 判断存下的visitNumber和数组中有没有匹配的如果没有重新赋值
							this.departmentList.forEach(item=>{
								if (item.visitNumber === this.headerEmit.visitNumber || item.orderNo === this.headerEmit.visitNumber) {
									found = true;
								}
							})
							if(!found || !this.headerEmit.visitNumber || this.departmentList.length===1){
								if(this.departmentList[0].orderNo){
									this.headerEmit.orderNo = this.departmentList[0].orderNo
								} else {
									this.headerEmit.orderNo = ''
								}
								this.$set(this.headerEmit,'visitNumber',this.departmentList[0].visitNumber || this.departmentList[0].orderNo)
							}
							this.subscribeObj = this.departmentList.find(x => x.orderNo == this.headerEmit.orderNo);
						} else {
							this.barList = []
						}
					} else {
						this.subscribeObj = [];
						this.departmentList = [];
					}
				}).catch(err => {
					console.log('errrrrr：', err);
				})
			},
			//切换科室
			departmentBtn(item,index){
				this.subscribeObj = item;
				this.headerEmit.visitNumber = item.orderNo;
			},
			navigateToPage() {
				let data = JSON.stringify(this.subscribeObj)
				uni.navigateTo({
					url: '/sub_packages/convenientModule/inquiry?params='+data
				});
			},
			// 退号
			async cancelRegistration(item) {
				guideApi.getTradeNo({lockId: item.lockId}).then((res) => {
					let result = res.data;
					let payOrderNo = '';
					if (result.code == 200) {
						payOrderNo = result.data.tradeNo;
					}
					if (payOrderNo != '') {
						let select = {
							cardNo: this.signData.patientCard,
							cardType: 1,
							patientName: this.signData.patientName,
						}
						//查询患者，获取patientid
						guideApi.queryPatient(select).then((res) => {
							let result = res.data;
							if (result.code === 200) {
								let data = {
									patientId: result.data.Response.ResultData.RecordList[0].patientId,
									tradeCode: '1003',
									extUserID: 'mobile',
									orderNo: item.orderNo,
									operId: 'YPZ'
								}
								//退号
								guideApi.cancelAppointOrRegister(data).then((res) => {
									if (res.data.code === 200) {
										//退款
										registrationApi.refund({merOrderId: payOrderNo, refundAmount: item.regAmount, targerOrderId: ''}).then(r => {
											let refundRes = r.data
											if (refundRes.code === 200) {
												uni.showToast({
													title: '退号成功',
													icon: 'none',   
													duration: 2000 
												})
												this.getFirstVisit();
											} else {
												this.getFirstVisit();
												uni.showToast({
													title: '退号成功, 退款失败，请移步人工窗口处理',
													icon: 'none',   
													duration: 2000 
												})
											}
										})
									} else {
										uni.showToast({
											title: '退号失败，请移步人工窗口处理',
											icon: 'none',   
											duration: 2000 
										})
									}
								})
							} else {
								uni.showToast({
									title: '未查询到就诊人信息，请移步人工窗口处理',
									icon: 'none',   
									duration: 2000 
								})
							}
						})
					} else {
						uni.showToast({
							title: '未查询到挂号信息，请移步窗口处理',
							icon: 'none',   
							duration: 2000 
						})
					}
				})
			},
		},
	}
</script>

<style lang="less">
	// .convenient {
	// 		height: 350rpx !important;
	// 	}
	.head {
		position: relative;
		flex: 0 0 auto;
		width: 100%;
		height: 284rpx;
		.text {
			position: absolute;
			width: 480rpx;
			color: #ffffff;
			font-weight: 600;
			margin: 46rpx 0 0 32rpx;
			.title {
				font-size: 32rpx;
			}
	
			.news {
				margin-top: 10rpx;
				font-size: 37rpx;
			}
		}
	
		.background {
			display: block;
			position: absolute;
			// height: 325rpx;
			width: 100%;
		}
	
		.icon {
			position: absolute;
			top: 10rpx;
			left: 340rpx;
			width: 100rpx;
			height: 44rpx;
		}
		.dist {
			width: 100%;
			transform: translate(0,193rpx);
			display: flex;
			overflow: auto;
			white-space: nowrap;
			padding:0 30rpx 10rpx 30rpx;
			// background: linear-gradient(to right, #46DAFB, #55A0F9);
			>ul {
				display: flex;
				align-items: center;
				margin:0 6rpx;
				border-radius: 15rpx;
				
				li {
					background: #edfeff;
					border-top: 2rpx solid #499eff;
					border-bottom: 2rpx solid #499eff;
					// padding:0 6rpx;
					height: 78rpx;
					display: flex;
					align-items: center;
					&:first-child{
						padding-left:3rpx;
						border-radius: 32rpx 0 0 32rpx;
					}
					&:last-child{
						padding-right:3rpx;
						border-radius: 0 32rpx 32rpx 0;
					}
					&:only-child{
						padding: 0 3rpx;
						border-radius: 32rpx;
					}
					.test {
						min-width: 160rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						align-items: center;
						padding: 0 18rpx;
					    height: 71rpx;
					    margin:  0;
					    border-radius: 32rpx;
					    font-size: 28rpx;
						line-height: 28rpx;
					    font-weight: 400;
					  
				    }
					.wire {
						width: 2rpx;
						height: 56rpx;
						margin: 0 6rpx;
						background: #cacaca;
					}
					&:last-child{
						.wire {
							margin: 0;
							width: 0;
						}
						
					}
				}
			}
				
		}
		
		.barColor {
			color: #0f74c8 !important;
		}
		.barBackground {
			background: #1b98ff !important;
			color: #ffffff;
		}
	}
	
	.box{
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
	 
	  .without {
	  	font-size: 40rpx;
	  	width: 700rpx;
	  	padding-bottom: 35rpx;
	  	background: #ffffff;
	  	margin: 0 auto;
	  	border-radius: 15.27rpx;
	  	display: grid;
	  	justify-content: center;
	  	align-items: center;
			margin-top: 50rpx;
	  	text {
	  		color: #797979;
	  		font-size: 32rpx;
	  		text-align: center;
	  	}
	  }
	
		.scroll-Y {
			width: 750rpx;
			text-align: center;
			flex: auto;
			overflow: auto;
			.img {
				height: 100%;
				display: flex;
				align-items: center;
				image {
					width: 60%;
					margin: 0 auto;
				}
			}
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
				.first {
					width: 750rpx;
					text-align: center;
					flex: auto;
					overflow: auto;
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
								margin-left: 17rpx;
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
		}
	}
</style>