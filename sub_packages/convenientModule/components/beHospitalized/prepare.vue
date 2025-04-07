<template>
	<view class="prepare">
		<view class="center">
			<view class="content" v-if="!register">
				<view class="title">
					<view class="left">
						住院申请单
					</view>
					<view class="right">
						<image src="../../../static/image/add.png" mode=""></image>
						<text>添加陪护人员</text>
					</view>
				</view>
				<ul>
					<li>
						<view class="attribute">
							登记号:
						</view>
						<view class="name">
							0102342345345
						</view>
					</li>
					<li v-if="firstContent.doctorName">
						<view class="attribute">
							开单医生:
						</view>
						<view class="name">
							{{firstContent.doctorName}}
						</view>
					</li>
					<li v-if="firstContent.appointmentTime">
						<view class="attribute">
							开单时间:
						</view>
						<view class="name">
							{{firstContent.appointmentTime}}
						</view>
					</li>
					<li>
						<view class="attribute">
							临床诊断:
						</view>
						<view class="name">
							肠胃炎
						</view>
					</li>
					<li v-if="firstContent.queueName">
						<view class="attribute">
							住院病区:
						</view>
						<view class="name">
							{{firstContent.queueName}}
						</view>
					</li>
					<li>
						<view class="attribute">
							住院地点:
						</view>
						<view class="name">
							内科住院楼11层西病区
						</view>
					</li>
					<li>
						<view class="attribute">
							住院充值:
						</view>
						<view class="name">
							无
						</view>
					</li>
					<li>
						<view class="attribute">
							陪护人员:
						</view>
						<view class="name">
							无
						</view>
					</li>
					<li>
						<view class="attribute">
							注意事项:
						</view>
						<view class="name">
							请遵守病房作息时间,保持病室内外环境整洁与安静,不随地吐痰,不在室内吸烟和喧哗,不使用大功率电器。
						</view>
					</li>
				</ul>
				<view class="btn" v-if="firstContent.queueName || firstContent.doctorName">
					<view>
						<!-- <button class="cu-btn" @click="leftBtn(firstContent.callState)">{{btn(firstContent.callState)}}</button> -->
					    <button class="cu-btn" >住院充值</button>
					    <button class="cu-btn"  @click="registerBtn">入院登记</button>
					</view>
				</view>
			</view>
			<view class="content2" v-else>
				<ul class="top">
					<li>
						<view class="attribute">
							住院号:
						</view>
						<view class="name">
							0102342345345
						</view>
					</li>
					<li>
						<view class="attribute">
							费别:
						</view>
						<view class="name">
							医保
						</view>
					</li>
					<li>
						<view class="attribute">
							住院病区:
						</view>
						<view class="name">
							呼吸内科二病区
						</view>
					</li>
					<li>
						<view class="attribute">
							床号:
						</view>
						<view class="name">
							24床
						</view>
					</li>
					<li>
						<view class="attribute">
							预交金额:
						</view>
						<view class="name">
							5000元
						</view>
					</li>
					<li>
						<view class="attribute">
							余额:
						</view>
						<view class="name">
							1249.77元
						</view>
					</li>
					<li>
						<view class="attribute">
							住院时间:
						</view>
						<view class="name">
							1天
						</view>
					</li>
					<li>
						<view class="attribute">
							饮食方式:
						</view>
						<view class="name">
							全流饮食
						</view>
					</li>
				</ul>
				<ul class="bottom">
					<li>
						<view class="attribute">
							陪护人员:
						</view>
						<view class="name">
							赵诗诗
						</view>
					</li>
					<li>
						<view class="attribute">
							入院原因:
						</view>
						<view class="name">
							支气管炎
						</view>
					</li>
					<li>
						<view class="attribute">
							责任医生:
						</view>
						<view class="name">
							李啸章
						</view>
					</li>
					<li>
						<view class="attribute">
							责任护士:
						</view>
						<view class="name">
							王丽丽、张晓月、董思思
						</view>
					</li>
					
					<li>
						<view class="attribute">
							住院须知:
						</view>
						<view class="name">
							请遵守病房作息时间,保持病室内外环境整洁与安静,不随地吐痰,不在室内吸烟和喧哗,不使用大功率电器。
						</view>
					</li>
				</ul>
				<view class="btn" v-if="firstContent.queueName || firstContent.doctorName">
					<view>
						<!-- <button class="cu-btn" @click="leftBtn(firstContent.callState)">{{btn(firstContent.callState)}}</button> -->
					    <button class="cu-btn" >住院充值</button>
					    <button class="cu-btn" @click="registerBtn">营养点餐</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import guideApi from '@/api/guideApi.js'
	import bus from "@/utils/bus.js";
	export default {
		props: {
		           headerEmit: Object,
		        },
		data() {
			return {
				firstContent:{},
				register:false,
				callObj:{
					calling:'',
					departmentName:'',
					expectToWait:'',
					medicalTreatmentNumber:''
				},
			}
		},
		mounted() {
			this.registrationCardAPI()
		},
		
		methods: {
			
			registerBtn(){
				this.register = !this.register
			},
			navigation(){
				let latitude = 36.183242794928994
				let longitude = 117.07709640617486
				wx.openLocation({
				          latitude: latitude,//目的地的纬度
				          longitude: longitude,//目的地的经度
				          name: '青岛西海岸新区第二中医医院', 
				        })
			},
			navigateToPage() {
			      uni.navigateTo({
			        url: '/sub_packages/convenientModule/inquiry?params='+this.headerEmit.userId
			      });
			    },
			btn(value) {
			            switch (value) {
			                case '未签到':
			                    return '立即签到'
			                case '已签到':
			                    return '刷新信息'
			                
			                
			            }
			},
			// 签到按钮
			leftBtn(item){
				if(item=='未签到'){
					try{
						// 签到
						const res =  guideApi.signIn({
							visitNumber:this.headerEmit.visitNumber,
							signInType:'初诊',
							queueId:this.firstContent.queueId
					   }).then((res) => {
					   this.registrationCardAPI()
					           }) 
					}catch(e){
						console.log(e)
					}
					// this.firstContent.callState='已签到'
					// console.log(this.firstContent)
					// this.registrationCardAPI()
					         
					
				}else{
					this.getQueueingDTO()
				}
			},
			
			// 获取初诊数据
			async registrationCardAPI() {
				try{
					const res= await guideApi.registrationCardAPI({
						visitNumber:this.headerEmit.visitNumber,
						tag:'1',
			        }).then((res) => {
					this.firstContent = res.data?res.data:{}
					if(this.firstContent.callState=='已签到'){
						this.getQueueingDTO()
					}
			                })
				}catch(e){
					console.log(e);
				}
				
					// this.firstContent = {
					// 	queuename:'呼吸内科',
					// 	doctorName:'张海松',
					// 	queueLocation:'门诊楼三楼西侧内科门诊',
					// 	precautions:'就诊前请到分诊台检查血压',
					// 	appointmentTime:'2024/8/8 09:35',
					// 	callState:this.firstContent.callState=='已签到'?'已签到':'未签到',
						
					// }
					// if(this.firstContent.callState=='已签到'){
					// 	this.getQueueingDTO()
					// }
				
			     
			},
			// 刷新信息
			async getQueueingDTO() {
				try{
					 const res= await guideApi.getQueueingDTO({
						visitNumber:this.headerEmit.visitNumber,
						queueCode:this.firstContent.queueId,
			        }).then((res) => {
					this.callObj = res.data
						
			                })
				}catch(e){
					console.log(e);
				}
					// this.callObj = {
					// 	calling:'8',
					// 	expectToWait:'10分钟',
					// 	medicalTreatmentNumber:'16',
					// }
				
			    
			},
			
		},
		
		
	}
</script>

<style lang="less" scoped>
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
	.prepare{
		// background: fuchsia;
		
		.center {
			margin:28rpx 33rpx 0 33rpx;
			width: 684rpx;
			background: #ffffff;
			border-radius: 12rpx;
			
			&:last-of-type{
				margin:28rpx 33rpx 28rpx 33rpx;
			}
			.content {
				margin-top: 3%;
				position: relative;
				
				.title {
					padding: 24rpx 0;
					margin:0 28rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.left {
						font-size: 32rpx;
						line-height: 32rpx;
						font-weight: 600;
					}
					.right {
						height: 52rpx;
						background: #f0f7ff;
						border: 2rpx solid #4286ff;
						border-radius: 38rpx;
						display: flex;
						color: #1091f1;
						justify-content: center;
						align-items: center;
						padding:0 20rpx;
						
						image {
							width: 32rpx;
							height: 32rpx;
							margin-right: 10rpx;
						}
						text {
							line-height: 28rpx;
						}
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
							color: #888888;
							width: 22%;
							display: flex;
							margin-bottom:2%;
							justify-content: left;
						}
						
						.name {
							min-height: 36rpx;
							display: flex;
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
							height: 56rpx;
							line-height: 56rpx;
							background: linear-gradient(350deg,#479cff 0%, rgba(71,216,251,0.80) 100%);
							border-radius: 70rpx;
							font-size: 32rpx;
							color: #ffffff;
							font-family: Source Han Sans CN, Source Han Sans CN-500;
							font-weight: 500;
						}
					}
				}
			}
			.content2 {
				margin-top: 3%;
				position: relative;
				
				
				.top {
					padding: 28rpx 0 20rpx 0;
					margin:0 4% 0 4%;
					border-bottom: 2rpx solid #eeeeee;
					display: flex;
					flex-wrap: wrap;
					>li {
						min-width: 60%;
						display: flex;
						
						&:nth-child(even){
							min-width: 40%;
						}
						
						
						.attribute{
							color: #888888;
							// width: 22%;
							display: flex;
							margin-bottom:2%;
							justify-content: left;
						}
						
						.name {
							min-height: 36rpx;
							display: flex;
							text-align: left;
							margin-bottom:2%;
							// width: 70%;
							margin-left: 10rpx;
						}
						&:last-child{
							// margin:3% 6% 0 4%;
							.attribute{
								margin-bottom: 0;
							}
							.name{
								margin-bottom: 0;
							}
						}
					}
				}
				.bottom {
					padding-top: 28rpx;
					> li {
						margin:0 4% 0 4%;
						width: 92%;
						display: flex;
						
						&:first-of-type{
							// margin:3% 6% 0 4%;
						}
						
						.attribute{
							color: #888888;
							width: 22%;
							display: flex;
							margin-bottom:2%;
							justify-content: left;
						}
						
						.name {
							min-height: 36rpx;
							display: flex;
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
							height: 56rpx;
							line-height: 56rpx;
							background: linear-gradient(350deg,#479cff 0%, rgba(71,216,251,0.80) 100%);
							border-radius: 70rpx;
							font-size: 32rpx;
							color: #ffffff;
							font-family: Source Han Sans CN, Source Han Sans CN-500;
							font-weight: 500;
						}
					}
				}
			}
		}
	}
</style>
