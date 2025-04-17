<template>
	<view class="information">
		<form>
			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input v-model="informationObj.patientName" placeholder="请输入" name="input" />
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
				<view class="title">身份证号</view>
				<input v-model="informationObj.idNo" placeholder="请输入" name="input" />
			</view>
			<view class="cu-form-group">
				<view class="title">患者类型</view>
				<input v-model="informationObj.patientType" placeholder="自费或医保" name="input" />
			</view>
			
			<view class="cu-form-group" style="margin-top: 30rpx;">
				<view class="title">手机号</view>
				<input v-model="informationObj.phone" placeholder="请输入院内预留手机号" type="number" maxlength="11" name="input" />
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
		<view class="confirm" @click="Filing" :class="{unclickable:!informationObj.patientName ||!informationObj.idNo}">
			确认建档
		</view>
	</view>
</template>
<script>
	import filingApi from '@/api/filingApi.js'
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
					sex:['男'],
					birthday:'1995-01-01',
					phone:'',
					address:'',
					nation:['汉族'], //民族
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
				selectedNation: '',
				sexs: ['男', '女'],
				selectedSex: '',
				address: '',
				occupationPickerIndex: -1,
				patientTypePickerIndex:-1,
				patientTypePicker: [
					{name:'自费', type:'01'},
					{name:'本市职工慢病', type:'02'},
					{name:'本市居民慢病', type:'03'},
					{name:'省内异地职工门诊', type:'04'},
					{name:'省直', type:'05'},
					{name:'离休',type:'06'},
					{name:'省外异地职工慢病', type:'07'},
					{name:'省内异地职工慢病', type:'08'},
					{name:'省内异地居民门诊', type:'09'},
					{name:'省内异地居民慢病', type:'10'},
					{name:'省直门诊慢病', type:'11'},
					{name:'本市职工普通门诊', type:'12'},
					{name:'省外异地职工门诊', type:'13'},
					{name:'省外异地居民慢病',type:'14'},
					{name:'省外异地居民门诊',type:'15'},
				],
				barList:['本人','配偶','父母','子女','其他'],
				countTimer:null,
				time:60,
				verificationCodeState:false,
				siginData: {}
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
			Filing(){
				if (!this.informationObj.patientName ||!this.informationObj.idNo ||!this.siginData.phoneNum) {
					uni.showToast({
						title: '请完善您的信息',
						icon: 'none',   
						duration: 2000 
					})
				} else {
					this.informationObj.patientType = '自费';
					this.informationObj.address = this.provincesAndMunicipalities+this.address;
					this.informationObj.isDefault = true;
					filingApi.archive(this.informationObj).then(res => {
						if(res.data.code === 200){
							let result = res.data.data.defaultArchives;
							uni.showToast({
								title: '建档成功',
								duration: 2000
							});
							this.setFootData(res.data.data.defaultArchives);
							uni.setStorageSync('loginData', res.data.data);
							wx.reLaunch({ url: '/pages/more/index' })
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
		onShow() {
			let data = uni.getStorageSync('loginData');
			this.siginData = data.defaultArchives ? data.defaultArchives : {};
		}
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