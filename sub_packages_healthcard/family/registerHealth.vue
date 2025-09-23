<template>
	<view class="information">
		<form>
			<view class="cu-form-group">
				<view class="x">*</view>
				<view class="title">姓名</view>
				<input v-model="informationObj.name" placeholder="请输入" name="input" />
			</view>
			<view class="cu-form-group">
				<view class="x">*</view>
				<view class="title">证件类型</view>
				<picker mode="selector" :value="informationObj.idType" :range="cardTypeValue" @change="onIdTypeChange">
					<text class="picker birth">{{selectedIdType}}</text>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="x">*</view>
				<view class="title">证件号码</view>
				<input v-model="informationObj.idNumber" placeholder="请输入" name="input" @input="parseIdCard" maxlength="18" />
			</view>
			<view class="cu-form-group">
				<view class="title">性别</view>
				<picker mode="selector" :value="informationObj.gender" :range="sexs" @change="onSexChange">
					<text class="picker birth">{{selectedSex}}</text>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="x">*</view>
				<view class="title">民族</view>
				<picker mode="selector" :value="informationObj.nation" :range="nations" @change="onNationChange">
					<text class="picker birth">{{selectedNation}}</text>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">出生日期</view>
				<picker mode="date" :value="informationObj.birthday" :start="startDate" :end="endDate" fields="day" @change="bindDateChange">
				    <text class="picker birth">{{informationObj.birthday}}</text>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="x">*</view>
				<view class="title">家庭关系</view>
				<picker mode="selector" :value="informationObj.relation" :range="relation" @change="onRelationChange">
					<text class="picker birth">{{selectedRelation}}</text>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">省市区</view>
				<picker mode="region" @change="chooseregion" :value="provincesAndMunicipalities">
					<view class="picker">
						<text>{{ provincesAndMunicipalities }}</text>
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">详细地址</view>
				<input v-model="informationObj.address" name="input" />
			</view>
			<view class="cu-form-group" style="margin-top: 30rpx;">
				<view class="x">*</view>
				<view class="title">手机号</view>
				<input v-model="informationObj.phone1" placeholder="请输入院内预留手机号" type="number" maxlength="11" name="input" />
			</view>
			<!-- <view class="cu-form-group">
				<view class="x">*</view>
				<view class="title">验证码</view>
				<input v-model="informationObj.verificationCode" placeholder="请输入短信验证码" name="input" />
				<view @click="verificationCodeBtn" v-if="!verificationCodeState" class="verificationCode">
					获取验证码
				</view>
				<view class="answer" v-else>
					{{time}}
				</view>
			</view> -->
		</form>
		<view class="tips">
			<view class="tips-title">
				温馨提示
			</view>
			<view class="center">
				<view>★  上述身份信息需要在医院建档，请务必填写真实信息；</view>
				<view>★  手机号需要填写本人正在使用的手机号</view>
			</view>
		</view>
		<view 
			class="confirm" 
			@click="saveInfo" 
			:class="{unclickable:!informationObj.name || !informationObj.idNumber || !informationObj.phone1 }"
		>
			提交绑卡信息
		</view>
	</view>
</template>
<script>
	import mixin from '@/mixins/mixin.js'
	import {mapMutations} from 'vuex'
	import filingApi from '@/api/filingApi.js'
	import healthCard from '@/api/healthCard.js'
	export default {
		mixins: [mixin],
		data(){
			return {
				authCode:'',
				weChatCode: '',
				informationObj:{
					name:'',
					gender:'',
					nation:'', //民族
					address: '',
					birthday:'',
					idType: '',
					idNumber:'',
					phone1:'',
					relation:'',
					patientType: 0,
					verificationCode:'',
				},
				provincesAndMunicipalities: ['山东省','济南市','历下区'],
				nations: [
					'汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族',
					'满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '傈僳族',
					'傈僳族', '仡佬族', '东乡族', '高山族', '拉祜族', '水族', '佤族', '纳西族', '羌族', '土族',
					'佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族',
					'土族', '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族',
					'普米族', '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族','保安族','裕固族',
					'京族','塔塔尔族','独龙族','鄂伦春族','赫哲族','门巴族','珞巴族','基诺族'
				],
				cardType: [
					{index: '01', value: '居民身份证'},
					{index: '02', value: '居民户口簿'},
					{index: '03', value: '护照'},
					{index: '04', value: '军官证'},
					{index: '05', value: '驾驶证'},
					{index: '06', value: '港澳居民来往内地通行证	'},
					{index: '07', value: '台湾居民来往内地通行证'},
					{index: '08', value: '出生医学证明'},
					{index: '15', value: '外国人永久居留身份证'},
					{index: '16', value: '新生儿证件（3个月无证件儿童）'},
					{index: '17', value: '港澳台居民居住证'},
					{index: '99', value: '其他法定有效证件	'},
				],
				cardTypeValue: [
					'居民身份证','居民户口簿','护照','军官证','驾驶证','港澳居民来往内地通行证	',
				  '台湾居民来往内地通行证','出生医学证明','外国人永久居留身份证','新生儿证件（3个月无证件儿童）',
					'港澳台居民居住证','其他法定有效证件'
				],
				sexs: ['男', '女'],
				relation:['本人','父母','子女','夫妻', '亲属', '朋友', '其他'],
				siginData: {},
				selectedSex: '',
				selectedIdType: '',
				selectedNation: '',
				selectedRelation: '',
				verificationCodeState:false,
				time:60,
			}
		},
		onLoad(e) {
			this.authCode = e.authCode ? e.authCode : '';
			this.weChatCode = e.weChatCode ? e.weChatCode : '';
		},
		methods: {
			...mapMutations({
				setFootData:'SET_FOOT_DATA',
			}),
			
			//选择日期
			bindDateChange(e) { 
				this.informationObj.birthday = e.detail.value
			},
			//省市区
			chooseregion(event){
				this.provincesAndMunicipalities = event.detail.value.toString();
			},
			//性别
			onSexChange(e) {
				const index = e.detail.value
				this.selectedSex = this.sexs[index]
				this.informationObj.gender = this.selectedSex;
			},
			//民族
			onNationChange(e) {
				const index = e.detail.value
				this.selectedNation = this.nations[index]
				this.informationObj.nation = this.selectedNation;
			},
			//证件类型
			onIdTypeChange(e) {
				const index = e.detail.value;
				let val = this.cardTypeValue[index];
				let filter = this.cardType.filter(x => x.value == val);
				this.selectedIdType = val;
				this.informationObj.idType = filter[0].index;
			},
			//家庭关系
			onRelationChange(e) {
				const index = e.detail.value
				this.selectedRelation = this.relation[index]
				this.informationObj.relation = this.selectedRelation;
			},
			// 获取验证码
			verificationCodeBtn(){
				this.verificationCodeState = true
				this.count(60)
				filingApi.sendVerificationCode(this.informationObj.phone).then(res => {
				}).catch(err => {
					console.log('2：', err);
				})
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
			//通过身份证号获取出生日期+性别
			parseIdCard() {
				if (this.selectedIdType == '居民身份证') {
					const isValid = /(^\d{15}$)|(^\d{17}[\dXx]$)/.test(this.informationObj.idNumber);
					if (!isValid) {
						this.birthday = "";
						this.gender = "";
						return;
					}
						
					if (this.informationObj.idNumber.length === 15) {
						const birthPart = "19" + this.informationObj.idNumber.substring(6, 12);
						this.birthday = this.formatDate(birthPart);
					} else {
						const birthPart = this.informationObj.idNumber.substring(6, 14);
						this.informationObj.birthday = this.formatDate(birthPart);
					}
						
					const genderPos = this.informationObj.idNumber.length === 15 ? 14 : 16;
					const genderCode = parseInt(this.informationObj.idNumber.charAt(genderPos));
					this.selectedSex = genderCode % 2 === 1 ? "男" : "女";
				}
			},
	
			formatDate(dateStr) {
				return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
			},
			
			async saveInfo() {
				if (!this.informationObj.name ||!this.informationObj.idNumber ||!this.informationObj.phone1 ||!this.informationObj.relation) {
					uni.showToast({
						title: '请完善您的信息',
						icon: 'none',   
						duration: 2000 
					})
				} else {
					let loginValue = uni.getStorageSync("loginData");
					let data = {
						authCode: this.authCode,
						successRedirectUrl: 'mini:/sub_packages_healthcard/family/familyManage?healthCode=${healthCode}',
						failRedirectUrl: 'mini:/sub_packages_healthcard/family/registerHealth?regInfoCode=${regInfoCode}',
						verifyFailRedirectUrl: `mini:/sub_packages_healthcard/family/registerHealth`,
						faceUrl: `/sub_packages_healthcard/family/faceVerify`,
						domainChannel: 3,
						openId: loginValue.xcxOpenId,
						address: this.provincesAndMunicipalities+this.informationObj.address
					}
					this.informationObj = { ...this.informationObj, ...data };

					await healthCard.registerHealthCardPreFill(this.informationObj).then((res) => {
						if (res.data.code == 200) {
							let url = res.data.data.rsp.verifyUrl;
							if (url == '') {
								uni.showToast({
									title: res.data.data.commonOut.errMsg,
									duration: 2000
								});
							} else {
								uni.navigateTo({
									url: '/pages/webview/webview?url=' + encodeURIComponent(url)
								});
							}
						  
						}
					});
				}
			}
			
		},
	}
</script>

<style lang="less" scoped>
	.unclickable{
		background: #beccff !important;
	}
	
	.information {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		
		.authorization {
			font-size: 26.72rpx;
			text-align: center;
			color: #4286ff;
			margin: 20rpx 0;
		}
		.bar {
			margin: 0 30rpx;
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
			.b {
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
				.birth{
					height: 86rpx;
					display: inline-block;
					text-align: left;
					width: 420rpx;
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
				.x {
					color: red;
					margin-right: 10rpx;
				}
			}
		}
		
		.tips {
			font-size: 26.72rpx;
			color: #333333;
			margin: 0 30rpx;
			
			.tips-title {
				margin-bottom: 20rpx;
			}
			.center {
				view {
					font-size: 22.9rpx;
					color: #333333;
					margin: 15rpx 0;
				}
			}
		}
		.confirm {
			width: 681.3rpx;
			height: 87.79rpx;
			background: #4286ff;
			border-radius: 43.89rpx;
			margin:30rpx auto 60rpx auto;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30.53rpx;
			font-family: PingFang SC, PingFang SC-600;
			font-weight: 600;
			color: #ffffff;
			line-height: 30.53rpx;
			
		}
	}
</style>