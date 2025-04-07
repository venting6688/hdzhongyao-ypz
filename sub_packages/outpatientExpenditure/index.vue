<template>
	<view class="box" v-if="showState">
		<bar />
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
							<view class="time">
								2023年12月20日
							</view>
							<view class="clinic">
								<text>就诊科室：{{item.admDept}}</text>
								<text>就诊医生：{{item.admDoctor}}</text>
							</view>
							
						</view>
						<view class="center"  v-for="(i,x) in item.itemList.item" :key="x">
							<view class="no">
								<view class="name">
									{{i.itemName}}
								</view>
								<view class="price">
									<text>单价：{{i.itemPrice}}</text>
									<text>￥{{i.itemSum}}</text>
								</view>
							</view>
							
						</view>
					</view>
					<view class="totalMoney">
						<view class="">
							<text>待缴费金额：</text>
							<text>{{item.orderSum}}元</text>
						</view>
					</view>
					<view class="btn">
						<view class="medical">
							医保支付
						</view>
						<view class="self-paying" @click="pay(item)">
							立即缴费
						</view>
					</view>
				</li>
			</ul>
			<view class="loading" v-if="loading.loadingState">
				<van-loading size="24px" vertical>{{loading.loadingName}}</van-loading>
			</view>
			<view class="without"  v-if="headIndex===1 &&!billList.length && !loading.loadingState">
				<image src="https://aiwz.sdtyfy.com:8099/img/wu.png" mode="widthFix"></image>
			</view>
			<ul v-if="headIndex===2">
				<template v-if="alreadyList.length==3">
					<li @click="particulars(item)" v-for="(item,index) in alreadyList" :key="index">
						<view class="middle">
							<view class="title">
								<view class="header">
									<view class="time">
									    {{item.admDate}}
								    </view>
									<view class="delete">
										<text>费用明细</text>
										<image src="../static/image/Vector@2x.png" mode=""></image>
									</view>
								</view>
							</view>
							<view class="list">
								<view>
									<text>就诊科室：</text>
									<text>{{item.admDept}}</text>
								</view>
								<view>
									<text>就诊医生：</text>
									<text>{{item.admDoctor}}</text>
								</view>
							</view>
						</view>
						<view class="totalMoney">
							<view>
								<text>费用合计：</text>
								<text class="black">{{item.totalAmt}}元</text>
							</view>
						</view>
						
					</li>
				</template>
				<view class="without"  v-else>
					<image src="https://aiwz.sdtyfy.com:8099/img/wu.png" mode="widthFix"></image>
				</view>
			</ul>
			
		</view>
		<Toast v-if="toastObj.state" @back="closeToast" :type="toastObj.type" :message="toastObj.message"/>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin'
	import bar from '../components/bar.vue'
	import Toast from '../components/toast.vue'
	import { mapState } from 'vuex'
	import bus from '@/utils/bus.js'
	import outpatientExpenditureApi from '@/api/outpatientExpenditureApi.js'
	export default {
		mixins: [mixin],
		components:{
			bar,
			Toast,
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
			}
		},
		computed: {
			...mapState(['footData','showState']),
		},
		mounted(){
			this.queryMedicalRecords()
		},
		onLoad(option) {
			if(option.checkState){
				this.checkState = option.checkState
			}
		},
		methods: {
			closeToast(state){
				this.toastObj.state = state
			},
			particulars(detail){
				uni.navigateTo({
					url: `/sub_packages/outpatientExpenditure/particulars?detail=${encodeURIComponent(JSON.stringify(detail))}`
				})
			},
			async queryMedicalRecords() {
			    if (this.footData.patientUniquelyIdentifies) {
			          this.loading = {
			            loadingState: true,
			            loadingName: '加载中'
			          };
					  this.billList = []
			          const time = await this.getWeek('上一周');
			          const msg = {
			            patientID: this.footData.patientUniquelyIdentifies,
			            startDate: time.startDate,
			            endDate: time.endDate
			          };
			          const res = await outpatientExpenditureApi.queryMedicalRecords(msg);
			          if (res.data.code === 200 && res.data.data.resultCode!== '-1') {
			            this.list1 = res.data.data.admList.admItem;
			            for (const [i, item] of this.list1.entries()) {
			              try {
			                const result = await this.fetchToBePaid(this.footData.patientUniquelyIdentifies, item.adm, time.startDate, time.endDate);
			                await this.processResult(result, i);
			              } catch (error) {
			                console.error('Error', error);
			                this.toastObj = {
			                  state: true,
							  type:'fail',
			                  message: '获取待支付信息时出错，请稍后重试'
			                };
			              }
			            }
			        }else {
						this.billList = []
						this.loading = {
						  loadingState: false,
						};
					}
			    }
			},
			async fetchToBePaid(patientID, visitNumber, startDate, endDate) {
			    const data = {
			        patientID,
			        visitNumber,
			        startDate,
			        endDate
			    };
			    const result = await outpatientExpenditureApi.getToBePaid(data);
			    return result;
			},
			async processResult(result, i) {
			  if (result.data.code === 200 && result.data.data.resultCode!== -1) {
			    this.list2 = result.data.data.payOrdList.payOrder;
			    if (this.list2.length) {
			      this.loading.loadingState = false;
			      for (const item of this.list2) {
			        item.admDept = this.list1[i].admDept;
			        item.admDoctor = this.list1[i].admDoctor;
			        item.adm = this.list1[i].adm;
			        this.billList.push(item);
			      }
			    } else {
			      this.toastObj = {
			        state: true,
					type:'fail',
			        message: result.data.data.resultMsg
			      };
			    }
			  }
			},
			pay(item){
				let loginValue = uni.getStorageSync("loginData");
				let data = JSON.parse(loginValue)
				let msg = {
					patientID:this.footData.patientUniquelyIdentifies,
					patientName:this.footData.patientName,
					patientOpenid:data.xcxOpenId,
					visitNumber:item.adm,
					orderNo:item.orderNo,
					orderSum:item.orderSum,
				}
				try {
					outpatientExpenditureApi.toBePaidPreOrder(msg).then(result => {
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
									this.loading = {
										loadingState:true,
										loadingName:'正在查询支付结果',
									}
									this.queryPayResultForToBePaid(result.data.data)
								},
								fail:(err)=> {
									let cancelPreSettlementData = {
										patientID:result.data.data.patientID,
										visitNumber:item.adm,
										orderNo:result.data.data.orderNo,
									}
									outpatientExpenditureApi.cancelPreSettlement(cancelPreSettlementData).then(r => {
										if(r.data.code===200){
											this.loading = {
												loadingState:false,
											}
											this.toastObj = {
												state:true,
												type:'fail',
												message:r.data.data.resultMsg,
											}
										}
									})
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
					this.toastObj = {
					  state: true,
					  type:'fail',
					  message: error.toString(),
					};
					//TODO handle the exception
				}
			},
			queryPayResultForToBePaid(data){
				outpatientExpenditureApi.queryPayResultForToBePaid(data).then(res => {
					try {
						if(res.data.code===999){
							this.queryPayResultForToBePaid(data)
						}else if(res.data.code===200){
							this.loading = {
								loadingState:false,
							}
							this.toastObj = {
								state:true,
								message:res.data.msg,
							}
							if(this.checkState){
								this.timer = setTimeout(()=>{
								bus.$emit('refreshGetcheckVisit')
								clearTimeout(this.timer)
								uni.navigateBack()
							},4000)
							}
							
							this.queryMedicalRecords()
							console.log('结果',res)
						}else {
							this.toastObj = {
							  state: true,
							  type:'fail',
							  message: '缴费失败，已退款',
							};
						}
					} catch (error) {
						this.toastObj = {
						  state: true,
						  type:'fail',
						  message: error.toString(),
						};
					}
					
				})
				.catch(err => {
					console.log('errrrrr：', err);
				})
			},
			async getPaymentRecord(){
				try {
					let time = await this.getWeek('上一周')
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						// startDate:time.startDate,
						startDate:'2024-11-22',
						endDate:time.endDate,
					}
					outpatientExpenditureApi.getPaymentRecord(data).then(res => {
						if(res.data.code===200){
							this.alreadyList = res.data.data||[]
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			
			headBtn(num){
				this.loading.loadingState = false
				this.headIndex = num
				if(num===1){
				    this.queryMedicalRecords()
				}else {
					this.getPaymentRecord()
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
							.time {
							    padding: 15rpx 0;
							}
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
		}
	}
</style>