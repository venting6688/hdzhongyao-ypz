<template>
	<view class="doing">
		<view class="center">
			<view class="title">
				<view @click="matter(i.num)" :class="{b:number===i.num}" v-for="(i,x) in titleList" :key="x">{{i.name}}</view>
			</view>
			<ul class="today" v-if="number===1">
				<li>
					<view class="time">
						<view>治疗时间:</view>
						<view>
							<view>
								2023年11月21日 上午8:10
							</view>
						</view>
					</view>
					<view class="project">
						<view>治疗项目:</view>
						<view>
							<view>
								静脉采血
							</view>
						</view>
					</view>
				</li>
				<li>
					<view class="time">
						<view>治疗时间:</view>
						<view>
							<view>
								2023年11月21日 上午8:10
							</view>
						</view>
					</view>
					<view class="project">
						<view>治疗项目:</view>
						<view>
							<view>
								静脉输液
							</view>
							<view class="list">
								<text>阿莫西林钠克拉维酸钾</text>
								<text>0.3g*1支</text>
							</view>
							<view class="list">
								<text>9%氯化钠注射液</text>
								<text>250ML*1袋</text>
							</view>
						</view>
					</view>
				</li>
			</ul>
			<ul  class="subscribe" v-else>
				<li>
					<view class="attribute">
						预约时间:
					</view>
					<view class="name">
						2023年11月22日 上午9:25
					</view>
				</li>
				<li>
					<view class="attribute">
						预约项目:
					</view>
					<view class="name">
						胸部DR检查
					</view>
				</li>
				<li>
					<view class="attribute">
						检查科室:
					</view>
					<view class="name">
						放射科
					</view>
				</li>
				<li>
					<view class="attribute">
						检查地点:
					</view>
					<view class="name">
						医技楼负一楼东区
					</view>
				</li>
				
				<li>
					<view class="attribute">
						注意事项:
					</view>
					<view class="name">
						请提前半个小时到检查科室等候检查。
					</view>
				</li>
			</ul>
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
				callObj:{
					calling:'',
					departmentName:'',
					expectToWait:'',
					medicalTreatmentNumber:''
				},
				titleList:[
					{
						name:'今日事项(2项)',
						num:1,
					},
					{
						name:'预约事项(1项)',
						num:2,
					},
				],
				number:1,
			}
		},
		mounted() {
			this.registrationCardAPI()
		},
		
		methods: {
			matter(num){
				this.number = num
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
	   .b {
	   	background: #f0f7ff;
		color: #0B69B6;
	   }
	.doing{
		// background: fuchsia;
		.center {
			margin:28rpx 33rpx 28rpx 33rpx;
			width: 684rpx;
			background: #ffffff;
			border-radius: 12rpx;
			
			
			.title {
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				padding: 10rpx 0;
				margin: 0 20rpx;
				border-bottom: 2rpx solid #eeeeee;
				color: #7D7D7D;
				
				
				view {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 312rpx;
					height: 64rpx;
				}
			}
			.today {
				text-align: left;
				// display: flex;
				// flex-wrap: wrap;
				padding-bottom: 10rpx;
				> li {
					margin: 0 20rpx;
					padding: 20rpx 0;
					border-bottom: 2rpx solid #eeeeee;
					
					&:last-child{
						border: 0;
					}
					// width: 100%;
					.time {
						display: flex;
						padding: 10rpx 0;
						>view {
							&:first-child{
								margin-right: 10rpx;
							}
						}
					}
					.project {
						display: flex;
						padding: 10rpx 0;
						>view {
							&:first-child{
								width: 20%;
								color: #999999;
								margin-right: 10rpx;
							}
							&:last-child{
								margin-right: 10rpx;
								width: 80%;
								
								.list {
									margin-top: 20rpx;
									display: flex;
									justify-content: space-between;
								}
							}
						}
					}
				}
			}
			.subscribe {
				padding: 28rpx 0;
				> li {
					margin:0 4% 0 4%;
					width: 92%;
					display: flex;
					
					&:first-child{
						// margin:3% 6% 0 4%;
						.attribute{
							color: #000 !important;
						}
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
						width: 78%;
					}
				}
			}
		}
	}
</style>
