<template>
	<view class="prepare">
		<view class="center">
			<view class="content" v-if="!register && preHospitalization.admInfo != undefined">
				<view class="title"><view class="left">住院申请单</view></view>
				<ul>
					<li>
						<view class="attribute">登记号:</view>
						<view class="name">{{preHospitalization.patInfo.patientID}}</view>
					</li>
					<li>
						<view class="attribute">开单医生:</view>
						<view class="name">{{preHospitalization.admInfo.admDoc}}</view>
					</li>
					<li>
						<view class="attribute">开单时间:</view>
						<view class="name">{{preHospitalization.admInfo.admDate}}</view>
					</li>
					<li>
						<view class="attribute">临床诊断:</view>
						<view class="name">{{preHospitalization.admInfo.diagnosDesc}}</view>
					</li>
					<li>
						<view class="attribute">住院病区:</view>
						<view class="name">{{preHospitalization.admInfo.admWardDesc}}</view>
					</li>
					<li>
						<view class="attribute">住院地点:</view>
						<view class="name">{{preHospitalization.admInfo.RoomDesc}}</view>
					</li>
				</ul>
				<form>
					<view class="cu-form-group">
						<view class="title">联系人：</view>
						<input placeholder="请输入姓名" v-model="registion.foreignID" name="input" />
					</view>
					<view class="cu-form-group">
						<view class="title">手机号：</view>
						<input placeholder="请输入手机号" v-model="registion.fPhon" maxlength="11" type="number" name="input" />
					</view>
				</form>
				<view class="message">
					<view class="attribute">注意事项:</view>
					<view class="name">请遵守病房作息时间,保持病室内外环境整洁与安静,不随地吐痰,不在室内吸烟和喧哗,不使用大功率电器。</view>
				</view>
				<view class="btn">
					<view>
						<!-- <button class="cu-btn" @click="leftBtn(firstContent.callState)">{{btn(firstContent.callState)}}</button> -->
					    <button class="cu-btn" @click="registerBtn">入院登记</button>
					</view>
				</view>
			</view>
			
			<view class="container" v-else>
			  <view class="info-card">
			    <view class="info-row">
			      <view class="info-item">
			        <text class="label">住院号：</text>
			        <text class="value">{{hospitalRecord.admID}}</text>
			      </view>
						<view class="info-item">
						  <text class="label">住院时间：</text>
						  <text class="value">{{hospitalRecord.inDays ? hospitalRecord.inDays : 0}}天</text>
						</view>
			    </view>
					<view class="info-row">
					  <view class="info-item">
					    <text class="label">预交金额：</text>
					    <text class="value">￥{{hospitalRecord.depositAmount ? hospitalRecord.depositAmount : 0}}元</text>
					  </view>
					  <view class="info-item">
					    <text class="label">余额：</text>
					    <text class="value balance">￥{{hospitalRecord.depositBalance ? hospitalRecord.depositBalance : 0}}元</text>
					  </view>
					</view>
			    <view class="info-row">
			      <view class="info-item">
			        <text class="label">住院病区：</text>
			        <text class="value">{{hospitalRecord.currWard}}</text>
			      </view>
						<view class="info-item">
						   <text class="label">费别：</text>
						   <text class="value">{{hospitalRecord.admReason}}</text>
						 </view> 
			    </view>
			    <!-- <view class="info-row">
			      <view class="info-item">
			        <text class="label">床号：</text>
			        <text class="value">24床</text>
			      </view> 
			      <view class="info-item">
			        <text class="label">饮食方式：</text>
			        <text class="value">全流饮食</text>
			      </view>
			    </view> -->
				</view>
				<view class="info">
			    <!-- <view class="full-row">
			      <text class="label">陪护人员：</text>
			      <text class="value">{{hospitalRecord.userName ? hospitalRecord.userName}}</text>
			    </view> -->
			    <view class="full-row">
			      <text class="label">入院原因：</text>
			      <text class="value">{{hospitalRecord.inReason}}</text>
			    </view>
			    <!-- <view class="full-row">
			      <text class="label">责任医生：</text>
			      <text class="value">{{hospitalRecord.doctorName ? hospitalRecord.doctorName}}</text>
			    </view>
			    <view class="full-row">
			      <text class="label">责任护士：</text>
			      <text class="value">{{hospitalRecord.nurseName ? hospitalRecord.nurseName}}</text>
			    </view> -->
					<view class="full-row">
					  <text class="label">住院须知：</text>
					  <text class="value">请遵守病房作息时间，保持病房内外环境整洁与安静，不随地吐痰，不在病房内吸烟和喧哗，不使用大功率电器。</text>
					</view>
			    <view class="button-row">
			      <button class="cu-btn" @click="deposit">住院充值</button>
			      <button class="cu-btn" @click="clickFoot">营养点餐</button>
			    </view>
			  </view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import guideApi from '@/api/guideApi.js'
	import bus from "@/utils/bus.js";
	import { mapState } from 'vuex';
	import hospitalizationApi from '@/api/hospitalizationApi.js';
	
	export default {
		data() {
			return {
				register:false,
				hospitalRecord: null,
				preHospitalization: {},
				iPBook: '',
				registion: {
					foreignID: '',
					fPhon: '',
				}
			}
		},
		computed: {
			...mapState(['footData','department']),
		},
		mounted() {
			this.getHospitalRecord()
			this.getHospitalization()
		},
		methods: {
			async registerBtn(){
				if (this.registion.foreignID == '' && this.registion.fPhon == '') {
					uni.showToast({
						title: '请先填写联系人信息',
						icon: 'none',   
						duration: 2000
					}) 
				} else {
					let str = {
						patientID: this.footData.patientUniquelyIdentifies,
						cardType: this.footData.cardTypeCode,
						iPBook: this.iPBook,
						foreignID: this.registion.foreignID,
						fPhon: this.registion.fPhon,
					}
					let res = await hospitalizationApi.registration(str);
					if (res.data.code === 200) {
						this.getHospitalRecord()
					}
				}
			},
			//获取住院记录
			async getHospitalRecord () {
				let data = {
					patientID: this.footData.patientUniquelyIdentifies,
					AimFlag: 'Dep'
				}
				let res = await hospitalizationApi.getHospitalRecord(data);
				if (res.data.code === 200 && res.data.data.admInfoList != null) {
					this.hospitalRecord = res.data.data.admInfoList.admInfo[0];
					this.register = true;
				}
			},
			
			//获取预住院记录
			async getHospitalization () {
				let res = await hospitalizationApi.getHospitalization(this.footData.patientUniquelyIdentifies);
				if (res.data.code === 200) {
					this.preHospitalization = res.data.data;
					this.iPBook = res.data.data.ipBook;
					this.register = false;
				}
			},
			deposit() {
				uni.navigateTo({
					url: "/sub_packages/deposit/index"
				})
			},
			clickFoot() {
				let appId = 'wx63c30833d698895a';
				let targetUrl = `pages/hospital/hospital?hoSpitAl_id=dffc9e5a317c&webtype=2`;
				wx.navigateToMiniProgram({
				  appId: appId,
				  path: targetUrl,
				  envVersion: 'release',
				  success: function(res) {
				  },
				  fail: function(err) {
				    console.log('跳转失败', err);
				  }
				});
			}
			
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
				.cu-form-group {
					padding-top: 0;
					min-height: 0;
					border-bottom: 0;
					.title {
						margin: 0;
						color: #888;
					}
					input {
						text-align: left;
					}
				}
				.message {
					padding: 15rpx 30rpx;
					text-align: left;
					line-height: 45rpx;
					border-top: 1px solid #eee;
				}
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
			
			.info-card {
			  background: #fff;
			  border-radius: 16rpx;
			  padding: 20rpx;
			}
			
			.info {
				border-top: 1rpx solid #eee;
				padding: 20rpx;
			}
			
			.info-row {
			  display: flex;
			  justify-content: space-between;
			  margin-bottom: 28rpx;
			}
			
			.info-item {
			  // flex: 1;
				text-align: left;
			  min-width: 45%;
			}
			
			.full-row {
				text-align: left;
			  margin-bottom: 28rpx;
			}
			
			.label {
			  color: #666;
			  font-size: 28rpx;
			  margin-right: 12rpx;
			}
			
			.value {
			  color: #333;
			  font-size: 28rpx;
			  font-weight: 500;
			}
			
			.balance {
			  color: #e4393c;
			}
			
			.notice-section {
			  margin-top: 40rpx;
			  padding-top: 28rpx;
			  // border-top: 1rpx solid #eee;
			}
			
			.notice-text {
			  display: block;
			  color: #666;
			  font-size: 26rpx;
			  line-height: 1.6;
			  margin-top: 16rpx;
			}
			
			.button-row {
			  display: flex;
			  justify-content: center;
			  margin-top: 40rpx;
			  gap: 30rpx;
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
			
			.action-btn {
			  flex: 1;
			  height: 80rpx;
			  border-radius: 12rpx;
			  display: flex;
			  align-items: center;
			  justify-content: center;
			  font-size: 30rpx;
			  font-weight: 500;
			}
			
			.primary {
			  background: #007aff;
			  color: #fff;
			}
			
			.secondary {
			  background: #f0f2f5;
			  color: #333;
			  border: 1rpx solid #ddd;
			}
			
			// .content2 {
			// 	margin-top: 3%;
			// 	position: relative;
				
				
			// 	.top {
			// 		padding: 28rpx 0 20rpx 0;
			// 		margin:0 4% 0 4%;
			// 		border-bottom: 2rpx solid #eeeeee;
			// 		display: flex;
			// 		flex-wrap: wrap;
			// 		>li {
			// 			min-width: 60%;
			// 			display: flex;
						
			// 			&:nth-child(even){
			// 				min-width: 40%;
			// 			}
						
						
			// 			.attribute{
			// 				color: #888888;
			// 				// width: 22%;
			// 				display: flex;
			// 				margin-bottom:2%;
			// 				justify-content: left;
			// 			}
						
			// 			.name {
			// 				min-height: 36rpx;
			// 				display: flex;
			// 				text-align: left;
			// 				margin-bottom:2%;
			// 				// width: 70%;
			// 				margin-left: 10rpx;
			// 			}
			// 			&:last-child{
			// 				// margin:3% 6% 0 4%;
			// 				.attribute{
			// 					margin-bottom: 0;
			// 				}
			// 				.name{
			// 					margin-bottom: 0;
			// 				}
			// 			}
			// 		}
			// 	}
			// 	.bottom {
			// 		padding-top: 28rpx;
			// 		> li {
			// 			margin:0 4% 0 4%;
			// 			width: 92%;
			// 			display: flex;
						
			// 			&:first-of-type{
			// 				// margin:3% 6% 0 4%;
			// 			}
						
			// 			.attribute{
			// 				color: #888888;
			// 				width: 22%;
			// 				display: flex;
			// 				margin-bottom:2%;
			// 				justify-content: left;
			// 			}
						
			// 			.name {
			// 				min-height: 36rpx;
			// 				display: flex;
			// 				text-align: left;
			// 				margin-bottom:2%;
			// 				width: 70%;
			// 			}
			// 		}
			// 	}
			// 	.btn {
			// 		view {
			// 			display: flex;
			// 			justify-content: center;
			// 			button {
			// 				width: 270rpx;
			// 				margin: 30rpx 20rpx 24rpx 20rpx;
			// 				height: 56rpx;
			// 				line-height: 56rpx;
			// 				background: linear-gradient(350deg,#479cff 0%, rgba(71,216,251,0.80) 100%);
			// 				border-radius: 70rpx;
			// 				font-size: 32rpx;
			// 				color: #ffffff;
			// 				font-family: Source Han Sans CN, Source Han Sans CN-500;
			// 				font-weight: 500;
			// 			}
			// 		}
			// 	}
			// }
		}
	}
</style>
