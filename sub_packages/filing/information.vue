<template>
	<view class="information">
		<form>
			<view class="cu-form-group">
				<view class="x">*</view>
				<view class="title">姓名</view>
				<input v-model="informationObj.patientName" placeholder="请输入" name="input" />
			</view>
			<view class="cu-form-group">
				<view class="x">*</view>
				<view class="title">身份证号</view>
				<input v-model="informationObj.idNo" placeholder="请输入" name="input"  @input="parseIdCard" maxlength="18" />
			</view>
			<view class="cu-form-group">
				<view class="title">性别</view>
				<picker mode="selector" :value="informationObj.sex" :range="sexs" @change="onSexChange">
					<text class="picker birth">{{selectedSex}}</text>
				</picker>
			</view>
			<view class="cu-form-group">
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
				<view class="title">家庭关系</view>
				<picker mode="selector" :value="informationObj.relation" :range="barList" @change="onRelationChange">
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
				<input v-model="address" name="input" />
			</view>
			<view class="cu-form-group">
				<view class="title">患者类型</view>
				<input v-model="informationObj.patientType" placeholder="自费或医保" name="input" />
			</view>
			<view class="cu-form-group" style="margin-top: 30rpx;">
				<view class="x">*</view>
				<view class="title">手机号</view>
				<input v-model="informationObj.phone" placeholder="请输入院内预留手机号" type="number" maxlength="11" name="input" />
			</view>
			
			<view class="cu-form-group">
				<view class="x">*</view>
				<view class="title">验证码</view>
				<input v-model="informationObj.verificationCode" placeholder="请输入短信验证码" name="input" />
				<view @click="verificationCodeBtn" v-if="!verificationCodeState" class="verificationCode">
					获取验证码
				</view>
				<view class="answer" v-else>
					{{time}}
				</view>
			</view>
			
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
		@click="Filing" 
		:class="{unclickable:!informationObj.patientName ||!informationObj.idNo || !informationObj.phone || !informationObj.verificationCode}">
			添加就诊人
		</view>
	</view>
</template>
<script>
	import filingApi from '@/api/filingApi.js'
	import registrationApi from '@/api/registrationApi.js'
	import mixin from '@/mixins/mixin.js'
	import {mapMutations} from 'vuex'
	export default {
		mixins: [mixin],
		data(){
			return {
				informationObj:{
					idNo:'',
					idType:'1',
					patientName:'',
					patientType: '自费', //病人类型
					guarderId: '', //监护人身份证id
					sex:'',
					birthday:'',
					phone:'',
					address:'',
					nation:['汉族'], //民族
					verificationCode: '',
					relation: '',
				},
				provincesAndMunicipalities: ['山东省','济南市','历下区'],
				nations: [
					'汉族', '壮族', '满族', '回族', '苗族', '维吾尔族', '土家族', '彝族', '蒙古族', '藏族',
					'布依族', '侗族', '瑶族', '朝鲜族', '白族', '哈尼族', '哈萨克族', '黎族', '傣族', '畲族',
					'傈僳族', '仡佬族', '东乡族', '高山族', '拉祜族', '水族', '佤族', '纳西族', '羌族', '土族',
					'仫佬族', '锡伯族', '柯尔克孜族', '达斡尔族', '景颇族', '毛南族', '撒拉族', '布朗族', '塔吉克族',
					'阿昌族', '普米族', '鄂温克族', '怒族', '京族', '基诺族', '德昂族', '保安族', '俄罗斯族', '裕固族',
					'乌孜别克族', '门巴族', '鄂伦春族', '独龙族', '塔塔尔族', '赫哲族', '珞巴族'
				],
				sexs: ['男', '女'],
				address: '',
				occupationPickerIndex: -1,
				patientTypePickerIndex:-1,
				barList: ['本人','父母','子女','夫妻', '亲属', '朋友', '其他'],
				countTimer: null,
				time: 60,
				verificationCodeState:false,
				siginData: {},
				loginPhoneNum: '',
				selectedRelation: '',
				selectedNation: '',
				selectedSex: '',
			}
		},
		computed:{
			startDate() { return this.getDate('start') },
			endDate() { return this.getDate('end') },
		},
		mounted() {
			this.$nextTick(()=>{
				uni.$emit('pageNavigated');
			})
		},
		onLoad() {
			this.loginValue = uni.getStorageSync("loginData");
			this.loginPhoneNum = this.loginValue.phoneNum;
		},
		methods: {
			...mapMutations({
				setFootData:'SET_FOOT_DATA',
			}),
			occupationPickerChange(e) {
				this.occupationPickerIndex = e.detail.value
				this.informationObj.occupation = this.occupationPicker[e.detail.value].type;
			},
			relationBtn(i){
				this.informationObj.relation = i
			},
			//选择日期
			bindDateChange(e) { 
				this.informationObj.birthday = e.detail.value
			},
			//省市区
			chooseregion(event){
				this.provincesAndMunicipalities = event.detail.value.toString();
			},
			//民族
			onNationChange(e) {
				const index = e.detail.value
				this.selectedNation = this.nations[index]
				this.informationObj.nation = this.selectedNation;
			},
			//性别
			onSexChange(e) {
				const index = e.detail.value
				this.selectedSex = this.sexs[index]
				this.informationObj.sex = this.selectedSex;
			},
			//家庭关系
			onRelationChange(e) {
				const index = e.detail.value
				this.selectedRelation = this.barList[index]
				this.informationObj.relation = this.selectedRelation;
			},
			// 获取验证码
			verificationCodeBtn(){
				this.verificationCodeState = true
				this.count(60)
				filingApi.sendVerificationCode(this.informationObj.phone).then(res => {
				})
				.catch(err => {
					console.log('2：', err);
				})
			},
			//通过身份证号获取出生日期+性别
			parseIdCard() {
				const isValid = /(^\d{15}$)|(^\d{17}[\dXx]$)/.test(this.informationObj.idNo);
				if (!isValid) {
					this.birthday = "";
					this.gender = "";
					return;
				}
					
				if (this.informationObj.idNo.length === 15) {
					const birthPart = "19" + this.informationObj.idNo.substring(6, 12);
					this.birthday = this.formatDate(birthPart);
				} else {
					const birthPart = this.informationObj.idNo.substring(6, 14);
					this.informationObj.birthday = this.formatDate(birthPart);
				}
					
				const genderPos = this.informationObj.idNo.length === 15 ? 14 : 16;
				const genderCode = parseInt(this.informationObj.idNo.charAt(genderPos));
				this.selectedSex = genderCode % 2 === 1 ? "男" : "女";
				this.informationObj.sex = this.selectedSex
			},
				
			formatDate(dateStr) {
				return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
			},
			
			Filing(){
				if (!this.informationObj.patientName ||!this.informationObj.idNo ||!this.informationObj.phone ||!this.informationObj.verificationCode) {
					uni.showToast({
						title: '请完善您的信息',
						icon: 'none',   
						duration: 2000 
					})
				} else {
					this.informationObj.patientType = '自费';
					this.informationObj.address = this.provincesAndMunicipalities+this.address;
					this.informationObj.isDefault = true;
					this.informationObj.loginPhoneNum = this.loginPhoneNum;
					this.informationObj.cardType = '1';
					this.informationObj.cardNo = this.informationObj.idNo;
					
					filingApi.archive(this.informationObj).then(res => {
						if(res.data.code === 200){
							let result = res.data.data.defaultArchives;
							uni.showToast({
								title: '建档成功',
								duration: 2000
							});
							if (!result.patientCard) {
								result.patientCard = result.idNum;
							}
							this.refreshUserInfo();
							wx.reLaunch({ url: '/sub_packages_healthcard/family/familyManage' })
						}else{
							uni.showToast({
								title: res.data.msg ? res.data.msg : '建档失败',
								icon: 'none',   
								duration: 3000 
							})
						}
					}).catch(err => {
						console.log('2：', err);
					})
				}
			},
			// 刷新用户信息
			async refreshUserInfo(){
				try{
				    const res = await filingApi.archiveQuery({phone: this.loginPhoneNum}).then(res => {
						let result = res.data.data;
						if(res.data.code === 200){
							this.setFootData(result.defaultArchives);
							uni.setStorageSync('loginData', result);
						}
					})
				}catch(e){
					console.log(e);
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