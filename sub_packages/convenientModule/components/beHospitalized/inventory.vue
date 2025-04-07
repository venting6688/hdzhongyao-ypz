<template>
	<view class="inventory">
		<view class="center">
			<view class="top">
				<view class="title">
					<view class="left">
						2023年11月22日
					</view>
					<view class="right">
						<text>查看详情</text>
						<image src="../../../static/image/Vector@2x.png" mode=""></image>
					</view>
				</view>
				<view class="content">
					本日消费金额：230元
				</view>
			</view>
			<view class="bottom">
				<view class="title">
					<view class="left">
						2023年11月22日
					</view>
					<view class="right">
						<text>查看详情</text>
						<image src="../../../static/image/Vector@2x.png" mode=""></image>
					</view>
				</view>
				<view class="content">
					<view>您(2023-11-21)的住院清单已生成，消费总金额:¥3520.23元</view>
					<view class="btn">
						<button class="cu-btn" >查看发票</button>
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
	.inventory{
		// background: fuchsia;
		
		.center {
			margin:28rpx 33rpx 0 33rpx;
			width: 684rpx;
			background: #ffffff;
			border-radius: 12rpx;
			padding: 20rpx 0;
			
			&:last-of-type{
				margin:28rpx 33rpx 28rpx 33rpx;
			}
			
			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10rpx 0;
				margin:0 20rpx;
				.left {
					
				}
				.right {
					image {
						width: 12rpx;
						height: 16rpx;
					}
					text {
						color: #4286FF;
					}
				}
			}
			.top {
				background: #f8f8f8;
				margin:0 10rpx;
				.content {
					margin:0 20rpx;
					text-align: left;
				}
			}
			.bottom {
				background: #f8f8f8;
				margin:20rpx 10rpx 0 10rpx;
				.content {
					margin:0 20rpx;
					// display: flex;
					text-align: left;
					.btn {
						width: 100%;
						text-align: right;
						padding-bottom: 20rpx;
						button {
							width: 180rpx;
							height: 48rpx;
							background: linear-gradient(353deg,#479cff 0%, rgba(71,188,253,0.89) 54%, rgba(71,216,251,0.80) 100%);
							border-radius: 70rpx;
							color: #ffffff;
							white-space: nowrap;
						}
					}
				}
				
			}
		}
	}
</style>
