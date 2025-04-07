<template>
	<view class="prescription">
		<view class="center" v-for="(item,index) in prescriptionContentList" :key="item">
			<view class="title" v-if="item.signInStatus==='已签到'">
				<view class="clinic">
					{{item.callObj.departmentName ?item.callObj.departmentName :''}}
				</view>
				
				<view class=" title-calling">
					<view class="left">
					    <view class="no">
						    {{item.callObj.medicalTreatmentNumber?item.callObj.medicalTreatmentNumber+'号':''}}
					    </view>
					    <view class="text">
						    就诊序号
					    </view>
				    </view>
					<view class="middle">
					    <view class="call">
							{{item.callObj.calling?item.callObj.calling+'号':''}}
					    </view>
					    <view class="text">
						    正在呼叫
					    </view>
					</view>
				    <view class="right">
					    <view class="time">
				    		{{item.callObj.expectToWait?item.callObj.expectToWait:''}}
					    </view>
					    <view class="text">
						    预计等候
					    </view>
				    </view>
				</view>
			</view>
			<view class="wire-box" :class="{wireState:item.signInStatus!=='已签到'}">
				<view class="wire" v-if="item.signInStatus=='已签到'">
					<image src="@/static/image/Group 679.png" mode=""></image>
				    <image src="@/static/image/Group 679.png" mode=""></image>
				</view>
			</view>
			<!-- <view class="head">
				<view class="left">
				</view>
				<view class="right">
					{{item.type?item.type:''}}
				</view>
			</view> -->
			<view class="content">
				<view class="icon">
					<text>{{item.payStatus=='未收费'?item.payStatus:item.signInStatus}}</text>
					<image  v-if="item.signInStatus=='已签到'" src="@/static/image/Union.png" mode="widthFix"></image>
					<image  v-if="item.signInStatus=='未签到'" src="@/static/image/Union2.png" mode="widthFix"></image>
				</view>
				<ul>
					<li v-if="item.OEORIExecDeptDesc">
						<view class="attribute">
							执行科室:
						</view>
						<view class="name">
							{{item.OEORIExecDeptDesc}}
						</view>
					</li>
					<!-- <li v-if="item.callObj.medicalTreatmentNumber">
						<view class="attribute">
							排队序号:
						</view>
						<view class="name">
							{{item.callObj.medicalTreatmentNumber}}号
						</view>
					</li> -->
					<li  v-if="item.OEORIOrderQty">
						<view class="attribute">
							药品数量:
						</view>
						<view class="name">
							{{item.OEORIOrderQty}}
						</view>
					</li>
					<li v-if="item.OEORIPrice">
						<view class="attribute">
							药品费用:
						</view>
						<view class="name">
							{{item.OEORIPrice}}元
						</view>
					</li>
					<li  v-if="item.queueLocation">
						<view class="attribute">
							科室位置:
						</view>
						<view class="name">
							{{item.queueLocation}}
						</view>
					</li>
					<li v-if="item.queueNotice">
						<view class="attribute">
							注意事项:
						</view>
						<view class="name">
							{{item.queueNotice}}
						</view>
					</li>
					
				</ul>
				<view class="btn" v-if="item.queueName ||item.doctorName">
					<!-- <navigator class="navigator"  url="../../pages/payAFee" hover-class="navigator-hover">
					{{btn(item.payStatus)}}
					</navigator> -->
					<view v-if="item.payStatus!=='已收费'">
						<button class="cu-btn" @click="leftBtn(index)">{{btn(item.payStatus)}}</button>
					    <!-- <button class="cu-btn">暂未开放</button> -->
					</view>
					<view v-else>
						<button class="cu-btn" @click="leftBtn(index)">{{btn(item.signInStatus)}}</button>
						<!-- <button class="cu-btn">暂未开放</button> -->
					</view>
					
				</view>
				
						
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	import guideApi from '@/api/guideApi.js'
	export default {
		props: {
		           headerEmit: Object,
		        },
		data() {
			return {
				prescriptionContentList:[],
				callObj:{
					calling:'55',
					departmentName:'西药房4窗口',
					expectToWait:'12分钟',
					medicalTreatmentNumber:'67'
				},
				timer:null,
				
			}
		},
		async mounted() {
			await this.getMedication(true)
			this.timer = setInterval(()=>{
				this.getMedication()
			},20000)
		},
		destroyed() {
			clearInterval(this.timer)
			this.timer = null
		},
		methods: {
			btn(value) {
			            switch (value) {
			                case '未签到':
			                    return '立即签到'
			                case '已签到':
			                    return '刷新信息'
							default: 
								return '立即缴费'; 
			            }
			},
			leftBtn(index){
				if(this.prescriptionContentList[index].payStatus!=='已收费'){
					this.examineOrInspectPayment(index)
				}else if(this.prescriptionContentList[index].signInStatus=='未签到'){
					this.signIn(index)
				}else{
					this.getQueueingDTO(index)
				}
			},
			//签到
			async signIn(index){
				try{
					const res = await guideApi.signIn({
						visitNumber:this.headerEmit.visitNumber,
						signInType:'处方',
						queueId:this.prescriptionContentList[index].acceptDeptCode
				   }).then((res) => {
				  this.getMedication()
				           }) 
				}catch(e){
					console.log(e)
				}
				// this.prescriptionContentList[index].signInStatus = '已签到'
				// for (let i = 0; i < this.prescriptionContentList.length; i++) {
				// 	if(this.prescriptionContentList[i].signInStatus=='已签到'){
				// 		this.getQueueingDTO(i)
				// 	}
					
				// }
			},
			//缴费
			async examineOrInspectPayment(i){
				console.log(34,this.prescriptionContentList[i],this.prescriptionContentList[i].doctorOrderId)
				try{
					const res = await guideApi.examineOrInspectPayment({
						doctorOrderId:this.prescriptionContentList[i].doctorOrderId,
				   }).then((res) => {
				   this.getMedication()
				           }) 
				}catch(e){
					console.log(e)
				}
				
				// this.prescriptionContentList[i].payStatus = '已收费'
			},
			// 刷新信息
			async getQueueingDTO(i) {
				try{
					 const res= await guideApi.getQueueingDTO({
						visitNumber:this.headerEmit.visitNumber,
						queueCode:this.prescriptionContentList[i].acceptDeptCode,
			        }).then((res) => {
					this.$set(this.prescriptionContentList[i], 'callObj', this.callObj)//res.data
			        })
				}catch(e){
					console.log(e)
				}
				// this.callObj = {
				// 	calling:'8',
				// 	expectToWait:'10分钟',
				// 	medicalTreatmentNumber:'16',
				// }
				// this.prescriptionContentList[i].callObj = this.callObj
			    
			},
			//获取处方数据
			async getMedication(state) {
				try{
					const res= await guideApi.getMedication(this.headerEmit.visitNumber).then((res) => {
						console.log('res',res)
						if(res.data.code===200){
							if(state){
								// 创建组件时加渐入组件效果
								this.$emit('handle')
							}
							this.prescriptionContentList = res.data.data?res.data.data:[]
						    for (let i = 0; i < this.prescriptionContentList.length; i++) {
							    if(this.prescriptionContentList[i].signInStatus=='已签到'){
								    this.getQueueingDTO(i)
							    }
						    }
						}
						
					})
				}catch(e){
					console.log(e)
				}
					
					
					// this.prescriptionContentList = [{
					// 	queueName:'西药房',
					// 	totalNum:'6盒',
					// 	totalPrice:'120元',
					// 	queueLocation:'门诊楼一楼东侧西药房',
					// 	queueNotice:'药品服用方式请遵循医嘱',
					// 	signInStatus:'未签到',
					// 	payStatus:'未收费'
						
					// },{
					// 	queueName:'西药房',
					// 	totalNum:'6盒',
					// 	totalPrice:'120元',
					// 	queueLocation:'门诊楼一楼东侧西药房',
					// 	queueNotice:'药品服用方式请遵循医嘱',
					// 	signInStatus:'未签到',
					// 	payStatus:'未收费'
					// }]
			},
			
		}
	}
</script>

<style lang="less">
	.prescription{
		// background: fuchsia;
		
		.center {
			margin:28rpx 33rpx 0 33rpx;
			width: 684rpx;
			background: #ffffff;
			border-radius: 12rpx;
			
			&:last-of-type{
				margin:28rpx 33rpx 28rpx 33rpx;
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
			.head {
				height: 90rpx;
				display: flex;
				align-items: center;
				
				
				.left {
					margin: 0 15rpx 0 30rpx;
					width: 0;
					height: 32rpx;
					border:6rpx solid #479cff;
					border-radius: 10rpx;
					
					
				}
				.right {
					font-size: 40rpx;
					font-weight: 600;
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
					
						display: flex;
						justify-content: center;
						.navigator-hover{
							// background-color: transparent;
						}
						.navigator,
						button {
							line-height:72rpx;
							width: 270rpx;
							margin: 0 30rpx 24rpx 30rpx;
							height: 72rpx;
							background: linear-gradient(350deg,#479cff 0%, rgba(71,216,251,0.80) 100%);
							border-radius: 70rpx;
							font-size: 35rpx;
							color: #ffffff;
							// font-family: Source Han Sans CN, Source Han Sans CN-500;
							font-weight: 500;
						}
						
					}
			}
		}
	}
</style>
