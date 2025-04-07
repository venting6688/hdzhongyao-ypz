<template>
	<view class="answer" v-if="answerContent.department">
		<view class="center">
			<view class="title" v-if="callObj.deptName">
				<view class="clinic">
					{{callObj.deptName?callObj.deptName:''}}
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
			<view class="wire-box" :class="{wireState:!callObj.deptName}">
				<view class="wire" v-if="callObj.deptName">
					<image src="@/static/image/Group 679.png" mode=""></image>
				    <image src="@/static/image/Group 679.png" mode=""></image>
				</view>
			</view>
			<view class="content">
				<view class="icon">
					<text>{{answerContent.queStatus==='回诊'?'已签到':'未签到'}}</text>
					<image  v-if="answerContent.queStatus=='回诊'" src="@/static/image/Union.png" mode="widthFix"></image>
					<image  v-if="answerContent.queStatus=='到达'" src="@/static/image/Union2.png" mode="widthFix"></image>
				</view>
				<ul>
					<li v-if="answerContent.department">
						<view class="attribute">
							回诊科室:
						</view>
						<view class="name">
							{{answerContent.department}}
						</view>
					</li>
					<li v-if="answerContent.doctor">
						<view class="attribute">
							回诊医生:
						</view>
						<view class="name">
							{{answerContent.doctor}}
						</view>
					</li>
					<!-- <li v-if="callObj.medicalTreatmentNumber">
						<view class="attribute">
							就诊序号:
						</view>
						<view class="name">
							{{callObj.medicalTreatmentNumber}}号
						</view>
					</li> -->
					<li v-if="answerContent.admitAddress">
						<view class="attribute">
							科室位置:
						</view>
						<view class="name">
							{{answerContent.admitAddress}}
						</view>
					</li>
					<li v-if="answerContent.precautions">
						<view class="attribute">
							注意事项:
						</view>
						<view class="name">
							{{answerContent.precautions}}
						</view>
					</li>
					
				</ul>
				<view class="btn" v-if="answerContent.department || answerContent.doctor">
					<view >
						<button class="cu-btn" @click="leftBtn(answerContent)">{{btn(answerContent.queStatus)}}</button>
					    <!-- <button class="cu-btn">暂未开放</button> -->
					</view>
				</view>
				<!-- <view class="footer" v-else>
					<view>
						<text>回诊已经结束，请您移步至门诊一楼输液或拿药</text>
					</view>
				</view> -->
			</view>
			
		</view>

		</view>
		
	</view>
</template>

<script>
	import guideApi from '@/api/guideApi.js'
	import { mapState } from 'vuex'
	export default {
		props: {
		           headerEmit: Object,
		        },
		data() {
			return {
				answerContent:{},
				callObj:{
					calling:'',
					departmentName:'',
					expectToWait:'',
					medicalTreatmentNumber:'',
				},
				timer:null,
			}
		},
		mounted() {
			if(this.department.data){
				this.getReportQueue(true)
				this.timer = setInterval(()=>{
					this.getReportQueue()
				},20000)
			}
		},
		computed: {
			...mapState(['footData','department']),
		},
		destroyed() {
			clearInterval(this.timer)
			this.timer = null
		},
		methods: {
			btn(value) {
			    switch (value) {
			        case '到达':
			            return '立即签到'
			        case '回诊':
			            return '刷新信息'
			    }
			},
			// 签到按钮
			leftBtn(item){
				if(item.queStatus==='到达'){
					try{
						let data = {
							patientID:item.patientID,
							admQueID:item.admQueID
						}
						// 回诊签到
						const res =  guideApi.checkInForReturnVisit(data).then((res) => {
							if(res.data.code===200){
								this.getReportQueue()
							}
					    }) 
					}catch(e){
						console.log(e)
					}
					
				}else{
					this.getQueueingMessage()
				}
			},
			// 获取回诊数据
			async getReportQueue(state) {
				try{
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						departmentCode:this.department.data.queueId,
					}
					const res= await guideApi.getReportQueue(data).then((res) => {
						if(res.data.code===200){
							if(state){
								// 创建组件时加渐入组件效果
								this.$emit('handle')
							}
							this.answerContent = res.data.data.reportInfo.opallocReport[0]?res.data.data.reportInfo.opallocReport[0]:{}
							if(this.answerContent.queStatus==='回诊'){
								this.getQueueingMessage()
							}
						}
					
			       })
				}catch(e){
					console.log(e);
				}
			},
			// 刷新信息
			async getQueueingMessage() {
				try{
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						DepartmentCode:this.answerContent.queueId,
			        }
					const res= await guideApi.getQueueingMessage(data).then((res) => {
						if(res.data.code===200){
							this.callObj = res.data.data.queLists.queList[0] || {}
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
			
		}
	}
</script>

<style lang="less">
	.answer{
		
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
						
						button {
							
							width: 270rpx;
							margin: 0 30rpx 24rpx 30rpx;
							height: 72rpx;
							line-height: 72rpx;
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
			}
		}
	}
</style>
