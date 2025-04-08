<template>
	<view class="information">
		<form>
			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input v-model="informationObj.name" placeholder="请输入" name="input" />
			</view>
			<view class="cu-form-group">
				<view class="title">身份证号</view>
				<input v-model="informationObj.num" placeholder="请输入" type="idcard" name="input" />
			</view>
		</form>
		<view class="confirm">
			<view  @click="queueFilingInfo()" >下一步</view>
		</view>
	</view>
</template>
<script>
	import filingApi from '@/api/filingApi.js'
	export default {
		data(){
			return {
				informationObj:{
					name:'',
					num:'',
				},
				occupationPickerIndex: -1,
				patientTypePickerIndex:-1,
				countTimer:null,
				time:60,
				verificationCodeState:false,
				phoneNum: '',
			}
		},
		methods: {
			relationBtn(i){
				this.informationObj.relation = i
			},
			queueFilingInfo(){
				if (!this.informationObj.name ||!this.informationObj.num) {
				    uni.showToast({
				        title: '请完善您的信息',
				        icon: 'none',   
				        duration: 3000 
				    })
				} else {
					let data = {
						patientName: this.informationObj.name,
						cardType: 1, 
						cardNo: this.informationObj.num,
						phone: this.phoneNum,
					}
					filingApi.archiveQuery(data).then(res => {
						let result = res.data.data;
						if (res.data.code === 500 && res.data.msg == -1) {
							uni.showModal({
								title: res.data.data,
								success: res => {
									if (res.confirm) {
										uni.navigateTo({
											url:"/sub_packages/filing/information"
										})
									} 
								}
							});
						} else if (!result.defaultArchives) {
							uni.showModal({
								title: "未查询当建档信息，请先建档。",
								success: res => {
									if (res.confirm) {
										uni.navigateTo({
											url:"/sub_packages/filing/information"
										})
									} 
								}
							});
						} else{
							uni.setStorageSync('loginData', result);
							uni.switchTab({ url:"/pages/virtualNurse/index" })
						}
					})
					.catch(err => {
						console.log('2：', err);
					})
				}
			},
			count(time) {
			    if (time) {
			        this.time = time
			    }
			    if (this.time < 2) {
			        this.verificationCodeState = false
			        this.time = 60 
			        
			    } else {
			        this.time--
			        if (this.countTimer) clearTimeout(this.countTimer)
			        this.countTimer = setTimeout(() => {
			            this.count()
			        }, 1000)
			    }
			},
		},
		onLoad(e) {
			this.phoneNum = e.phone;
		}
	}
</script>

<style lang="less" scoped>
	.unclickable{
		background: #beccff !important;
	}
	.gray{
		color: #999999  !important;
		border: 1.91rpx solid #999999 !important;
	}
	.information {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		
		.bar {
			margin: 30rpx 30rpx 0 30rpx;
			display: flex;
			justify-content: space-between;
			
			view {
				width: 118.32rpx;
				height: 72.52rpx;
				background: #ffffff;
				border-radius: 11.45rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26.72rpx;
				font-weight: 500;
				color: #000000;
				line-height: 26.72rpx;
			}
			.blue {
				background: #4286ff !important;
				color: #ffffff !important;
			}
			
		}
		form {
			margin:30rpx;
			overflow: auto;
			
			.cu-form-group {
				
				min-height: 86rpx;
				.title {
					width: 160rpx;
				}
				.answer {
					color: #999999;
				}
				.verificationCode {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 148.85rpx;
					height: 49.62rpx;
					border: 1.91rpx solid #4286ff;
					border-radius: 30.53rpx;
					font-size: 22.9rpx;
					color: #4286ff;
					line-height: 22.9rpx;
				}
			}
		}
		.healthCard {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 221.37rpx;
			margin:10rpx auto 60rpx auto;
			height: 57.25rpx;
			background: #4286ff;
			border-radius: 7.63rpx;
			color: #ffffff;
			font-size: 22.9rpx;
			line-height: 22.9rpx;
		}
		.tips {
			font-size: 26.72rpx;
			color: #333333;
			margin: 0 30rpx;
			
			.tips-title {
				margin-bottom: 20rpx;
			}
			.tips-center {
				view {
					display: flex;
					
					text{
						font-size: 22.9rpx;
						line-height: 40rpx;
						color: #333333;
						margin: 10rpx 10rpx 10rpx 0;
					}
				}
			}
		}
		.confirm {
			margin-top: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			view{
				width: 311.07rpx;
				height: 87.79rpx;
				border-radius: 43.89rpx;
				margin:0 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30.53rpx;
				font-family: PingFang SC, PingFang SC-600;
				font-weight: 600;
				color: #ffffff;
				line-height: 30.53rpx;
				&:first-child{
					background: #3cd0aa;
				}
				&:last-child{
					background: #4286ff;
				}
			}
			
			
		}
	}
</style>