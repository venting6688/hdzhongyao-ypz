<template>
	<view class="box">
		<bar />
		<date @handle="show" />
		<view class="head">
			<view>
				<view class="name" @click="headBtn(1)">
					<view :class="{black:headIndex===1}">
						检查报告
						<view class="wire" :class="{blue:headIndex===1}"></view>
					</view>
				</view>
				<view class="name" @click="headBtn(2)">
					<view :class="{black:headIndex===2}">
						检验报告
					<view class="wire" :class="{blue:headIndex===2}"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="information">
			<ul v-if="List.length">
				<li @click="information(item)" v-for="(item,index) in List" :key="index">
					<view class="content">
						<view class="title">
							<view class="name">
								<text>{{item.auditDoctName}}</text>
							</view>
							<view class="delete">
								<text>查看报告</text>
								<image src="../static/image/Vector@2x.png" mode=""></image>
							</view>
						</view>
						<view class="center" v-if="headIndex === 1">
							<view class="no">
								<text>医生：</text>
								<text>{{item.inspecDoctName}}</text>
							</view>
							<view class="no">
								<text>检查科室：</text>
								<text>{{item.inspecDeptName}}</text>
							</view>
							<view class="no">
								<text>检查项目：</text>
								<text>{{item.checkItem}}</text>
							</view>
							<view class="no">
								<text>检查时间：</text>
								<text>{{item.inspecTime}}</text>
							</view>
							<view class="no">
								<text>诊断：</text>
								<text>{{item.diagnosis}}</text>
							</view>
						</view>
						<view class="center" v-else>
							<view class="no">
								<text>检查项目：</text>
								<text>{{item.examType}}</text>
							</view>
							<view class="no">
								<text>检查时间：</text>
								<text>{{item.sendTime}}</text>
							</view>
						</view>
					</view>
				</li>
			</ul>
			<zanwu v-else />
		</view>
		<auth-popup
			ref="authPopup"
			@success="authSuccess"
			@fail="authFail"
			@cancel="authCancel"
		/>
	</view>
</template>

<script>
	import bar from '../components/bar.vue'
	import date from '../components/date.vue'
	import elseApi from '@/api/elseApi.js'
	import healthCard from '@/api/healthCard.js'
	import zanwu from '../components/zanwu.vue'
  import AuthPopup from '../components/auth-popup.vue'
	import { mapState } from 'vuex'
	export default {
		components:{
			bar,
			date,
			zanwu,
			AuthPopup,
		},
		data(){
			return {
				headIndex:1,
				date:{},
				List:[],
				siginData: {},
				loginData: {},
				registerOrderId: '',
				verifyOrderId: '',
			}
		},
		computed: {
			...mapState(['footData']),
		},
		onLoad(e) {
			this.loginData = uni.getStorageSync('loginData');
			this.siginData = this.loginData.defaultArchives ? this.loginData.defaultArchives : {};

			this.registerOrderId = e.registerOrderId ? e.registerOrderId : '';
			if (this.registerOrderId == '' && this.siginData.linkHealthCard) {
				this.healthcardVerify();
			}
			if (this.registerOrderId != '') {
				this.checkUniformVerifyResult();
			}
		},
		methods: {
			show(time){
				const datePattern = /^\d{4}-\d{2}-\d{2}$/.test(time.startTime);
				if(datePattern){
					this.date = time
					let type = this.headIndex === 1 ? 'jiancha' : 'jianyan';
					this.getVisitRecord(type)
				}
			},
			headBtn(num){
				this.headIndex = num
				let type = num === 1 ? 'jiancha' : 'jianyan';
				this.getVisitRecord(type)
			},
			
			//实人验证
			healthcardVerify() {
				var plugin = requirePlugin("healthCardPlugins");
				plugin.login((isok, res) => {
					if (!isok && res.result.toLogin) {
						this.$refs.authPopup.open();
					} else {
						this.verifyOrder(res);
					}
				}, {
					wechatCode: true,
				});
			},
			
			//实人验证生成orderid
			verifyOrder(val) {
				const { wechatCode } = val.result;
				
				let data = {
					cardType: '01',
					idCard: this.siginData.patientCard,
					name: this.siginData.patientName,
					wechatCode,
					ecardNo: '',
					scene: '0101081',
					department: '',
					useCardType: '01',
					cardCostTypes: '',
					verifySuccessRedirectUrl: 'mini:/sub_packages/report/index?registerOrderId=${registerOrderId}',
					verifyFailRedirectUrl: 'mini:/sub_packages/report/index?registerOrderId=${registerOrderId}',
					faceUrl:`/sub_packages/family/faceVerify`,
					domainChannel: 3,
					openId: this.loginData.xcxOpenId,
				}
				
				healthCard.registerUniformVerifyOrder(data).then((res) => {
					if (res.data.code == 200) {
						let url = res.data.data.rsp.verifyUrl;
						uni.setStorageSync('verifyOrderId', res.data.data.rsp.verifyOrderId)
						uni.redirectTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(url) });
					}
				});
			},
			
			//实人验证结果查询
			checkUniformVerifyResult() {
				let verifyOrderId = uni.getStorageSync('verifyOrderId');
				let data = {
					verifyOrderId,
					verifyResult: this.registerOrderId,
					openId: this.loginData.xcxOpenId,
				}
				
				healthCard.checkUniformVerifyResult(data).then((res) => {
					if (res.data.code != 200) {
						
					}
				});
			},
			
			authSuccess(e) {
				const res = e.detail; 
				this.verifyOrder(res);
			},
			authFail(e) {
				console.log('授权失败：', e)
			},
			authCancel(e) {
				console.log('用户取消授权：', e)
			},
			//检查报告
			getVisitRecord(type) {
				try {
					let data = {
						cardNo: this.siginData.patientCard, 
						patientId: this.footData.hisPatientId,
						startDate: this.date.startTime,
						endDate: this.date.endTime,
						patientName: this.siginData.patientName,
						verslon: 1,
					}
					if (type == 'jiancha') {
						elseApi.queryPacsInfo(data).then(res => {
							let result = res.data;
							if(result.code===200){
								this.List = result.data.Response.ResultData.RecordList;
							}else {
								this.List = []
							}
						})
					} else {
						elseApi.queryLisBaseInfo(data).then(res => {
							let result = res.data;
							if(result.code === 200){
								this.List = result.data.Response.ResultData.RecordList;
							}else {
								this.List = []
							}
						})
					}
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			
			information(item){
				if(this.headIndex===1){
					//检查
					uni.navigateTo({
						url: `/sub_packages/report/examine?report=${encodeURIComponent(JSON.stringify(item))}`
					})
				}else {
					//检验
					uni.navigateTo({
						url: `/sub_packages/report/checkout?report=${encodeURIComponent(JSON.stringify(item))}`
					})
				}
			}
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
			width: 700rpx;
			margin: 0 auto;
			background: #ffffff;
			// height: 120rpx;
			
			border-radius: 12rpx 12rpx 0 0;
			>view{
				// padding-top: 20rpx;
				padding: 20rpx 10rpx 0;
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
			margin-bottom: 50rpx;
			ul {
				width: 700rpx;
				margin: 0 auto;
				> li {
					background: #ffffff;
					&:last-child{
						.content{
							border: 0 !important;
						}
					}
					>.content{
						padding-bottom: 20rpx;
						margin: 0 20rpx;
						border-bottom: 2rpx solid #eeeeee;
						.title {
							height: 70rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							image {
								width: 12rpx;
								height: 18rpx;
								margin-left:20rpx;
							}
							.name {
								display: flex;
								align-items: center;
								font-size: 28rpx;
								line-height: 34.35rpx;
								font-family: PingFang SC, PingFang SC-600;
								font-weight: 600;
								color: #000000;
								padding: 10rpx 0;
							}
							.delete {
								display: flex;
								align-items: center;
								font-size: 26.72rpx;
								line-height: 26.72rpx;
								font-family: PingFang SC, PingFang SC-400;
								font-weight: 400;
								color: #4286ff;
								padding: 10rpx 0;
							}
						}
						.center {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							.no {
								font-size: 24rpx;
								padding: 8rpx 0;
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
				}
			}
		}
		.without {
			font-size: 40rpx;
			width: 700rpx;
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