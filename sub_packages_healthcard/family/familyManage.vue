<template>
	<view class="manage">
		<view class="information">
			<ul v-if="healthCardList.length">
				<li v-for="(item, index) in healthCardList" :key="item.archives.archiveId">
					<view class="title">
						<view class="name">
							<text class="big">{{ item.archives.patientName ? pixelate(item.archives.patientName) :
								'' }}</text>
							<text class="small">{{ item.archives.sex != null ? item.archives.sex : '' }}</text>
							<text class="relation">{{ item.archives.relation != null ? item.archives.relation : '其他'
							}}</text>
						</view>
						<view class="ok" @click="defaultPatients(item)">
							<image v-if="item.archives.defaultType" src="../static/image/icon-ok.png" mode=""></image>
							<image v-else src="../static/image/grayOk.png" mode=""></image>
							<text>默认就诊人</text>
						</view>
						<view class="dele" @click="deletePatients(item.archiveId, item.archives.defaultType)">
							<uni-icons type="trash" color="red"></uni-icons>
							删除
						</view>
					</view>
					<view class="center">
						<view class="content">
							<text>证件号：</text>
							<text>{{ item.archives.patientCard ? pixelateNumber(item.archives.patientCard.toString()) :
								'' }}</text>
						</view>
						<view class="bottomBtn" @click="showHealthCard(item.healthCard.idCard)"
							v-if="item.healthCard != null">
							<view>
								<text>{{ !item.healthCard != null && item.healthCard.idCard == cardNum &&
									isShowHealthCard ? '收起详情' : '展开详情' }}</text>
								<image
									v-if="!item.healthCard != null && item.healthCard.idCard == cardNum && isShowHealthCard"
									src="../static/image/top.png" mode=""></image>
								<image v-else src="../static/image/bottom.png" mode=""></image>
							</view>
						</view>
						<view class="upHealthCard" @click="linkHealthCard" v-else>
							<uni-icons type="upload" color="#1B98FF" size="22" style="margin-right: 10rpx;"></uni-icons>
							升级电子健康卡
						</view>
					</view>
					<!-- 健康卡 -->
					<view class="wrap"
						v-if='item.healthCard != null && item.healthCard.idCard == cardNum && isShowHealthCard'>
						<view class="cardNum">就诊卡：{{ item.archives.patientCard }}</view>
						<view>
							<view class="card-face-container" @click="showQRCode(item.healthCard.healthCardId)">
								<img class="card-bg" src="../static/image/cardnewbg.png" alt="" />
								<view class="card-top-info">
									<view class="card-top-org">山东省卫生健康委员会</view>
									<view class="card-top-title">
										<img src="../static/image/icon2.png" alt="" />
										<span>电子健康卡</span>
									</view>
								</view>
								<view class="card-detail-info">
									<view class="card-user-info">
										<span class="card-user-name">{{ item.healthCard.name }}</span>
										<span class="card-user-id">{{ item.healthCard.idCard }}</span>
									</view>
									<view class="card-qrcode">
										<img class="card-qrcode-logo" src="../static/image/logo_.png" alt="" />
										<img src="../static/image/qrcode.png" alt="" />
									</view>
								</view>
								<view class="card-footer">中华人民共和国国家卫生健康委员会监制</view>
							</view>
						</view>
					</view>
				</li>
			</ul>
		</view>

		<view class="btn" @click="linkHealthCard" v-if="5 - healthCardList.length > 0">
			<image src="../static/image/icon-add.png" mode="" />
			<text>添加就诊人（剩{{ 5 - healthCardList.length }}人）</text>
		</view>
		<view class="btn" @click="returnIndex" style="background-color: #EAAA52;">
			<text>返回</text>
		</view>
		<!-- 插件授权 -->
		<uni-popup ref="popup" type="center">
			<view class="auth-popup" v-if="showAuth">
				<view class="auth-header">电子健康卡</view>
				<view class="auth-content">
					<view>即将使用电子健康卡服务，<span style="color: #1B98FF;">开启授权，就医一卡通行</span></view>
				</view>
				<health-card-login :wechatcode="true" @authFail="authFail" @authSuccess="authSuccess"
					@authCancel="authCancel">
					<view class="auth-button">前往授权</view>
				</health-card-login>
				<button type="default" class="cancel-button" @click="returnHome">取消授权</button>
			</view>
		</uni-popup>
		<Toast v-if="toastObj.state" @back="closeToast" :type="toastObj.type" :url="toastObj.url" :tips="toastObj.tips"
			:message="toastObj.message" />
	</view>

</template>

<script>
import mixin from '@/mixins/mixin.js'
import { mapMutations, mapState } from 'vuex'
import Toast from '../components/toast.vue'
import filingApi from '@/api/filingApi.js'
import healthCard from '@/api/healthCard.js'
import { addMemberApi, getMemberListApi, setDefaultMemberApi } from "@/api/familyApi.js";
import patient from '../../api/loginApi'
// import AuthPopup from '../components/auth-popup.vue'

export default {
	mixins: [mixin],
	components: {
		// AuthPopup,
		Toast
	},
	data() {
		return {
			showAuth: false,
			patientList: [],
			showBtn: false,
			healthCode: '',
			regInfoCode: '',
			authCode: '',
			loginValue: {},
			healthCardList: [],
			healthCardType: [
				{ index: '01', value: '身份证' },
				{ index: '02', value: '居民户口簿' },
				{ index: '03', value: '护照' },
				{ index: '04', value: '军人证' },
				{ index: '05', value: '驾驶证' },
				{ index: '06', value: '港澳通行证	' },
				{ index: '07', value: '台湾居住证' },
				{ index: '08', value: '出生医学证明' },
				{ index: '15', value: '外国人永久居留身份证' },
				{ index: '17', value: '港澳居住证' },
				{ index: '16', value: '新生儿证件（3个月无证件儿童）' },
				{ index: '99', value: '其他法定有效证件	' },
			],
			hisCardType: [
				{ index: '1', value: '身份证' },
				{ index: '4', value: '护照' },
				{ index: '3', value: '军人证' },
				{ index: '7', value: '驾驶证' },
				{ index: '11', value: '港澳通行证	' },
				{ index: '26', value: '台湾居住证' },
				{ index: '27', value: '出生医学证明' },
				{ index: '28', value: '外国人永久居留身份证' },
				{ index: '25', value: '港澳居住证' },
			],
			relation: ['本人', '父母', '子女', '夫妻', '亲属', '朋友', '其他'],
			isSave: false,
			toastObj: {
				state: false,
			},
			cardNum: '',
			isShowHealthCard: false,
		}
	},
	onLoad(e) {
		// 从健康卡插件返回时，e.healthCode不为空
		this.loginValue = uni.getStorageSync("loginData");
		this.healthCode = e.healthCode ? e.healthCode : '';
		this.regInfoCode = e.regInfoCode ? e.regInfoCode : '';
		this.authCode = e.authCode ? e.authCode : '';
		this.getHealthCardList();
		if (this.healthCode != '') {
			this.getHealthCard();
		}
	},

	methods: {
		...mapMutations({
			setFootData: 'SET_FOOT_DATA',
		}),
		closeToast(state) {
			this.toastObj = {
				state: state,
			}
		},
		returnIndex() {
			uni.switchTab({ url: "/pages/virtualNurse/index" })
		},
		//院内就诊卡
		increase() {
			uni.navigateTo({ url: '/sub_packages/filing/information' });
		},
		showHealthCard(num) {
			this.cardNum = num;
			this.isShowHealthCard = !this.isShowHealthCard;
		},
		//电子健康卡
		linkHealthCard() {
			if (!this.loginValue) {
				uni.navigateTo({ url: "/sub_packages/login/index?title=青岛西海岸新区第二中医医院" })
			} else {
				var plugin = requirePlugin("healthCardPlugins");
				plugin.login((isok, res) => {
					if (!isok && res.result.toLogin) {
						this.showAuth = true;
						this.$refs.popup.open();
					} else {
						// 用户在微信授权过，可直接获取登录信息，处理后续业务
						this.todo(res);
					}
				}, {
					wechatCode: true,
				});
			}
		},

		async todo(val) {
			const { wechatCode } = val.result;
			let data = {
				weChatCode: wechatCode,
				patientType: 0,
				successRedirectUrl: 'mini:/sub_packages_healthcard/family/familyManage?healthCode=${healthCode}', //授权成功获取就诊人列表
				failRedirectUrl: 'mini:/sub_packages_healthcard/family/familyManage?regInfoCode=${regInfoCode}',
				userFormPageUrl: 'mini:/sub_packages_healthcard/family/registerHealth?authCode=${authCode}', //添加就诊人
				faceUrl: `/sub_packages_healthcard/family/faceVerify`,
				verifyFailRedirectUrl: `mini:/sub_packages_healthcard/family/familyManage`,
				domainChannel: 3,
				openId: this.loginValue.openid,
			}
			await healthCard.cardVerification(data).then((res) => {
				if (res.data.code == 200) {
					let url = res.data.data.rsp.bindCardUrl;
					uni.redirectTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(url) });
				}
			});
		},

		//获取健康卡信息
		async getHealthCard() {
			let str = {
				healthCode: this.healthCode,
				openId: this.loginValue.openid,
			}
			let res = await healthCard.getHealthCardByHealthCode(str);
			if (res.data.code == 200) {
				let data = res.data.data.rsp.card;
				//展示数据
				let idCard = data.idCard;
				let firstFour = idCard.slice(0, 4);
				let lastFour = idCard.slice(-4);
				let cardNum = `${idCard.slice(0, 4)}${'*'.repeat(idCard.length - 10)}${idCard.slice(-2)}`;
				let name = data.name;
				let formatName = '';
				if (name.length == 1) {
					formatName = `${name}*`;
				} else {
					formatName = `${name[0]}${'*'.repeat(name.length - 2)}${name.slice(-1)}`;
				}

				//健康卡建档
				let idType = data.idType;
				let filterHealthCard = this.healthCardType.filter(x => x.index == idType);
				let healthVal = filterHealthCard.length ? filterHealthCard[0].value : '';
				let filterHisCard = this.hisCardType.filter(x => x.value == healthVal);
				let hisCardType = healthVal == '居民户口簿' ? 1 : (filterHisCard.length > 0 ? filterHisCard[0].index : 98);
				let ext = JSON.parse(data.ext);
				let relation = this.relation[ext.relationship];

				let archiveStr = {
					ownerUserId: uni.getStorageSync("loginData")?.userId,
					nickname: "昵称",
					realName: data.name,
					gender: data.gender == "男" ? 1 : 2,
					birthday: data.birthday,
					phoneNumber: data.phone1,
					relationship: relation,
					defaultPatient: false,
					healthCardNo: data.healthCardId,
					idCard: idCard,

					// idNo: data.idNumber,
					// idType: hisCardType,
					// patientName: data.name,
					// patientType: '自费',
					// guarderId: '',
					// sex: data.gender,
					// birthday: data.birthday,
					// phone: data.phone1,
					// address: data.address,
					// nation: data.nation,
					// cardType: '1',
					// isDefault: false,
					// cardNo: idCard,
					// loginPhoneNum: '13964017682',//this.loginValue.phoneNum,
					// healthCardId: data.healthCardId,
					// qrCodeText: data.qrCodeText,
					// relation, 
				}

				const result = await addMemberApi(archiveStr);
				if (result.code === 200) {
					uni.showToast({
						title: "添加成功",
						icon: "success",
						duration: 2000,
					});
					this.getHealthCardList();
					// this.refreshUserInfo({phone: this.loginValue.phoneNum});
				}

				// addMemberApi(archiveStr).then(result => {
				// 	if (result.data.code === 200) {
				// 		uni.showToast({
				// 			title: "添加成功",
				// 			icon: "success",
				// 			duration: 2000,
				// 		});
				// 		this.refreshUserInfo({ phone: this.loginValue.phoneNum });
				// 	}
				// })



				// filingApi.archive(archiveStr).then(result => {
				// 	if(result.data.code === 200){
				// 		this.getHealthCardList();
				// 		this.refreshUserInfo({phone: this.loginValue.phoneNum});
				// 	}
				// })
			}
		},

		//获取健康卡列表
		async getHealthCardList() {
			if (!uni.getStorageSync("loginData")?.userId) {
				uni.showToast({
					title: "请先登录",
					icon: "none",
					duration: 2000,
				});
				return;
			}
			const { rows, code, msg } = await getMemberListApi({
				ownerUserId: uni.getStorageSync("loginData")?.userId,
			});
			if (code === 200) {
				if (rows.length > 0) {
					this.healthCardList = rows.map((item, index) => ({
						archives: {
							archiveId: item.family_id,
							patientName: item.real_name,
							sex: item.gender == 1 ? '男' : '女',
							relation: item.relationship,
							phoneNum: item.phonenumber,
							patientCard: item.id_card,
							familyId: item.family_id,
							defaultType: item.default_patient,
						},
						healthCard: {
							name: item.real_name,
							idCard: `${item.id_card.slice(0, 4)}${'*'.repeat(item.id_card.length - 10)}${item.id_card.slice(-2)}`,
							idNo: item.id_card,
							healthCardId: item.health_card_no,
							phone: item.phonenumber,
							relation: item.relationship,
						}
					}));
				}
				console.log("healthCardList", this.healthCardList);
			} else {
				uni.showToast({
					title: msg,
					icon: "none",
					duration: 2000,
				});
			}

			// let data = {phone: this.loginValue.phoneNum}
			// let res = await healthCard.queueFilingInfo(data);
			// console.log("queueFilingInfo res" , res);
			// if (res.data.code == 200) {
			// 	let datas = res.data.data;
			// 	this.healthCardList = [];
			// 	datas.map(item => {
			// 		let v = item.healthCard;
			// 		let archives = item.archives;

			// 		if (v != null) {
			// 			let idCard = v.idCard;
			// 			let firstFour = idCard.slice(0, 4);
			// 			let lastFour = idCard.slice(-4);
			// 			let cardNum = `${idCard.slice(0, 4)}${'*'.repeat(idCard.length - 10)}${idCard.slice(-2)}`;

			// 			// let healthCardData = JSON.parse(v.data);
			// 			item.healthCard = {
			// 				name: v.name,
			// 				idCard: cardNum,
			// 				idNo: idCard,
			// 				healthCardId: v.healthCardId,
			// 				phone: item.archives.phoneNum,
			// 				relation: item.archives.relation,
			// 			}
			// 		}
			// 		this.healthCardList.push(item);

			// 	})

			// }
		},

		//展码
		showQRCode(healthCardId) {
			let hospitalId = '40088';
			let webviewUrl = '/pages/webview/webview?url=$url';
			let redirectUrl = '';
			let fieldCode = '';

			wx.navigateTo({
				url: `plugin://healthCardPlugins/healthcode?hospitalId=${hospitalId}&healthCardId=${healthCardId}&webviewUrl=${encodeURIComponent(webviewUrl)}&redirectUrl=${encodeURIComponent(redirectUrl)}`,
			});
		},

		// 刷新用户信息
		async refreshUserInfo(data) {
			try {
				const res = await filingApi.archiveQuery(data).then(res => {
					let result = res.data.data;
					if (res.data.code === 200) {
						this.setFootData(result.defaultArchives);
						uni.setStorageSync('loginData', result);
					}
				})
			} catch (e) {
				console.log(e);
			}
		},

		//设置默认就诊人
		async defaultPatients(val) {
			const { code, msg } = await setDefaultMemberApi({
				familyId: val.archives?.familyId,
				ownerUserId: uni.getStorageSync("loginData")?.userId,
			});
			if (code === 200) {
				uni.showToast({
					title: "设置成功",
					icon: "none",
					duration: 2000,
				});
				this.getHealthCardList();
			} else {
				uni.showToast({
					title: msg,
					icon: "none",
					duration: 2000,
				});
			}

			// let data = {
			// 	phone: this.loginValue.phoneNum,
			// 	archiveId: val.archiveId,
			// 	relation: val.relation
			// }
			// healthCard.updateDefaultArchives(data).then(updateRes => {
			// 	if (updateRes.data.code == 200) {
			// 		this.refreshUserInfo({ phone: this.loginValue.phoneNum });
			// 		this.getHealthCardList()
			// 	} else {
			// 		uni.showToast({
			// 			title: "更新失败，稍后重试.",
			// 			icon: "none",
			// 		});
			// 	}
			// })
		},
		//删除就诊人
		deletePatients(archiveId, isDefault) {
			if (isDefault) {
				this.toastObj = {
					state: true,
					message: '不允许删除默认就诊人，请先设置其他就诊人为默认就诊人',
					url: '',
					tips: '',
				}
			} else {
				uni.showModal({
					title: "提示",
					content: "确定删除该就诊人吗？",
					success: (res) => {
						if (res.confirm) {
							try {
								let data = {
									archiveId,
									phone: this.loginValue.phoneNum,
								}
								healthCard.deleteByHealthCardId(data).then(res => {
									if (res.data.code === 200) {
										uni.showToast({
											title: "删除成功",
											icon: "none",
										});
									} else {
										uni.showToast({
											title: res.data.msg,
											icon: "none",
										});
									}
									this.getHealthCardList()
									this.refreshUserInfo({ phone: this.loginValue.phoneNum });
								})
							} catch (error) {
								console.log(error)
								//TODO handle the exception
							}
						}
					},
				});
			}
		},
		authSuccess(e) {
			const res = e.detail;
			this.todo(res);
		},
		authFail(e) {
			console.log('授权失败：', e)
		},
		authCancel(e) {
			console.log('用户取消授权：', e)
		},
	}
}
</script>

<style lang="less" scoped>
.manage {
	width: 100vw;
	height: 100%;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;

	.headTitle {
		line-height: 64rpx;
		background: #F0F7FF;
		color: #1B98FF;
		font-size: 28rpx;
		text-align: center;
	}

	.information {
		width: 100%;
		overflow: auto;

		ul {
			width: 681.3rpx;
			margin: 0 auto;

			>li {
				width: 681.3rpx;
				background: #ffffff;
				border-radius: 15.27rpx;
				margin-top: 30rpx;
				padding-bottom: 15rpx;

				.title {
					margin: 0 28rpx;
					height: 88rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					image {
						width: 30rpx;
						height: 30rpx;
						margin: 0 10rpx 0 20rpx;
					}

					.name {
						display: flex;
						align-items: center;
						font-size: 34.35rpx;
						line-height: 34.35rpx;
						font-family: PingFang SC, PingFang SC-600;
						font-weight: 600;
						color: #000000;
						padding: 10rpx 0;

						.big {
							margin-right: 15rpx;
						}

						.small {
							line-height: 26.72rpx;
							font-size: 26.72rpx;
							color: #666666;
							font-weight: 400;
							margin-right: 15rpx;
						}

						.relation {
							padding: 5rpx 10rpx;
							background: #4286ff;
							border-radius: 7.63rpx;
							color: #ffffff;
							font-weight: 400;
							font-size: 22.9rpx;
							line-height: 22.9rpx;
						}
					}

					.ok {
						display: flex;
						align-items: center;
						font-size: 26.72rpx;
						line-height: 26.72rpx;
						font-family: PingFang SC, PingFang SC-400;
						font-weight: 400;
						color: #666666;
						padding: 10rpx 0;
					}

					.dele {
						color: #ff0000;
					}
				}

				.center {
					margin: 0 28rpx 25rpx;
					display: flex;
					justify-content: space-between;

					.content {
						margin-top: 20rpx;

						text {
							&:nth-child(1) {
								display: inline-block;
								width: 145rpx;
								color: #999999;
							}

							&:nth-child(2) {
								color: #333333;
								margin-right: 20rpx;
							}

							&:nth-child(3) {
								padding: 6rpx 14rpx;
								background: rgba(66, 134, 255, 0.08);
								border-radius: 26.72rpx;
								color: #4286ff;
								font-size: 22.9rpx;
								line-height: 22.9rpx;
							}
						}

						.money {
							color: #ff4848 !important;
						}
					}

					.img {
						margin: 20rpx auto 0 auto;

						image {
							width: 624rpx;
							height: 351.15rpx;
							border-radius: 11.45rpx;
						}
					}
				}

				.bottomBtn {
					color: #999999;
					font-size: 26.72rpx;
					margin-top: 20rpx;

					image {
						width: 30rpx;
						height: 30rpx;
						margin-left: 8rpx;
					}
				}

				.upHealthCard {
					color: #1B98FF;
					font-size: 26.72rpx;
					margin-top: 20rpx;
				}
			}
		}

		//电子健康卡
		.wrap {
			border-top: 1px solid #eee;
			background: #fff;
			min-height: 99%;
			padding-top: 1%;
			width: 100%;
			font-family: 'PINGFANG MEDIUM', 'PingFang SC', 'Microsoft YaHei', sans-serif;
			font-weight: 600;

			.cardNum {
				margin-left: 28rpx;
				padding: 10rpx 0 0;
			}

			.card-face-container {
				height: 351rpx;
				width: 620rpx;
				margin: 15rpx auto;
				position: relative;
				color: #000000;
			}

			.card-face-container .card-bg {
				height: 100%;
				width: 100%;
				position: absolute;
			}

			.card-face-container .card-top-info {
				position: absolute;
				top: 15rpx;
				width: calc(100% - 15rpx - 20rpx);
				padding: 0 15rpx 0 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.card-face-container .card-top-info .card-top-org {
				font-size: 22rpx;
				line-height: 22rpx;
			}

			.card-face-container .card-top-info .card-top-title {
				display: flex;
				align-items: center;
				font-size: 30rpx;
				line-height: 36rpx;
				color: #2B2B2B;
			}

			.card-face-container .card-top-info .card-top-title img {
				height: 58rpx;
				width: 58rpx;
				margin-right: 10rpx;
			}

			.card-face-container .card-detail-info {
				position: absolute;
				top: 100rpx;
				width: calc(100% - 30rpx - 15rpx);
				padding-left: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
			}

			.card-face-container .card-detail-info .card-user-info {
				font-size: 30rpx;
				color: #2B2B2B;
			}

			.card-face-container .card-detail-info .card-user-info .card-user-id {
				font-size: 28rpx;
				line-height: 28rpx;
				display: block;
				padding-top: 10rpx;
			}

			.card-face-container .card-detail-info .card-qrcode {
				background: #FFFFFF;
				padding: 5rpx;
				position: relative;
			}

			.card-face-container .card-detail-info .card-qrcode .card-qrcode-logo {
				height: 164rpx;
				width: 164rpx;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}

			.card-face-container .card-detail-info .card-qrcode img {
				height: 164rpx;
				width: 164rpx;
			}

			.card-face-container .card-footer {
				position: absolute;
				font-size: 22rpx;
				bottom: 26rpx;
				left: 50%;
				transform: translateX(-50%);
				white-space: nowrap;
				letter-spacing: 0;
				line-height: 22rpx;
			}

			.bottom {
				display: flex;
				align-items: center;
				font-size: 26.72rpx;
				line-height: 26.72rpx;
				font-family: PingFang SC, PingFang SC-400;
				font-weight: 400;
				color: #666666;
				padding: 10rpx 0;
				margin: auto 65rpx;
				justify-content: space-between;

				.default image {
					width: 32rpx;
					height: 32rpx;
					margin-right: 10rpx;
				}

			}
		}
	}

	.btn {
		width: 681.3rpx;
		height: 87.79rpx;
		background: #4286ff;
		border-radius: 20rpx;
		margin: 30rpx auto 0;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		padding: 15rpx 0;

		image {
			width: 41.98rpx;
			height: 41.98rpx;
			margin-right: 15rpx;
		}

		text {
			font-size: 30.53rpx;
			line-height: 30.53rpx;
		}
	}

	.auth-popup {
		width: 80vw;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-sizing: border-box;
	}

	.auth-header {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 30rpx;
	}

	.auth-content {
		margin-bottom: 40rpx;
		text-align: center;
		font-size: 30rpx;
		color: #666;
	}

	.auth-tip {
		font-size: 26rpx;
		color: #999;
		margin-top: 15rpx;
	}

	.healCard {
		justify-content: space-between;
		align-items: center;
	}

	.auth-button {
		color: white;
		background: #1B98FF;
		font-size: 14px;
		padding: 20rpx;
		border-radius: 10rpx;
		text-align: center;
	}

	.cancel-button {
		font-size: 14px;
		margin-top: 30rpx;
	}

}
</style>