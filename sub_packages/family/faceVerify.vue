<template>
</template>

<script>
	import healthCardApi from '@/api/healthCard.js'
	
	export default {
		onLoad(e) {
			this.orderId = e.orderId;
			this.redirectUrl = e.redirectUrl;
			this.verifyType = e.verifyType;
			this.loginValue = uni.getStorageSync("loginData");
			this.getOrderInfoByOrderId();
		},
		data() {
			return {
				orderId: '',
				redirectUrl: '',
				verifyType: '',
				loginValue: {},
			}
		},
		methods: {
			getOrderInfoByOrderId() {
				let data = {
					orderId: this.orderId,
					verifyType: this.verifyType,
					openId: this.loginValue.xcxOpenId,
				}
				
				healthCardApi.getOrderInfoByOrderId(data).then(res => {
					if (res.data.code == 200 && res.data.data.commonOut.errMsg == '成功') {
					  let data = res.data.data.rsp;
						wx.startFacialRecognitionVerify({
							name: data.name,
							idCardNumber: data.idCard,
							success: (res => {
								var plugin = requirePlugin("healthCardPlugins");
								plugin.login((isok, res) => {
									this.faceVerificationRes(res, data);
								}, {
									wechatCode: true,
								});
							}),
							fail: (err => {
								uni.showToast({ title: '验证失败，请重试', icon: 'none' });
							})
						});
					}
				})
				
			},
			
			faceVerificationRes(val, data) {
				const { wechatCode } = val.result;
				let faceData = {
					orderId: this.orderId,
					wechatCode,
					idCard: data.idCard,
					cardType: data.cardType,
					name: data.name,
					result: '01',
					verifyType: this.verifyType,
					openId: this.loginValue.xcxOpenId,
				}
				
				healthCardApi.registerRealPersonAuthOrder(faceData).then(res => {
					console.log(JSON.stringify(res.data),'====人脸识别验证结果------');
					let redirectUrl = decodeURIComponent(this.redirectUrl);
					let url = '';
					if (res.data.code == 200 && res.data.data.rsp.verifyOrderId != '') {
						let verifyOrderId = res.data.data.rsp.verifyOrderId;
						url = redirectUrl+`&verify_order_id=${verifyOrderId}`;
					} else {
						url = redirectUrl+"&verify_order_id=-1";
					}
					
					uni.navigateTo({
						url: '/pages/webview/webview?url=' + encodeURIComponent(url)
					});
					
				});
			}
			
		},
	}
</script>

<style lang="less" scoped>
	.box {
		width: 100vw;
		height: 100%; 
		background-color: #fff;
		display: flex;
		flex-direction: column;
		.center {
			width: 750rpx;
			margin: 20rpx auto;
			word-wrap: break-word;
			overflow-wrap: break-word;
		}
	}
	
</style>