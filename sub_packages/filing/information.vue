<template>
	<view class="information">
		<!-- <view class="authorization">
			一键授权，已有健康卡用户快速绑定
		</view>
		<view class="bar">
			<view @click="relationBtn(i)" :class="{b:informationObj.relation===i}" v-for="(i,x) in barList" :key="x">{{i}}</view>
		</view> -->
		<form>
			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input v-model="informationObj.patientName" placeholder="请输入" name="input" />
			</view>
			<view class="cu-form-group">
				<view class="title">性别</view>
				<input v-model="informationObj.sex" placeholder="请输入" name="input" />
				<!-- <text class="answer">{{informationObj.sex}}</text> -->
			</view>
			<view class="cu-form-group">
				<view class="title">民族</view>
				<input v-model="informationObj.nation" placeholder="请输入" name="input" />
				<!-- <text class="answer">{{informationObj.nation}}</text> -->
			</view>
			<view class="cu-form-group">
				<view class="title">出生日期</view>
				<input v-model="informationObj.birthdayday" placeholder="年-月-日" name="input" />
				<!-- <text class="answer">{{informationObj.birthdayday}}</text> -->
			</view>
			<view class="cu-form-group">
				<view class="title">家庭住址</view>
				<input v-model="informationObj.address" placeholder="请输入" name="input" />
				<!-- <text class="answer">{{informationObj.address}}</text> -->
			</view>
			<view class="cu-form-group">
				<view class="title">身份证号</view>
				<input v-model="informationObj.idNo" placeholder="请输入" name="input" />
				<!-- <text class="answer">{{informationObj.idNo}}</text> -->
			</view>
			<view class="cu-form-group">
				<view class="title">患者类型</view>
				<text class="answer">自费</text>
			</view>
			<view class="cu-form-group">
				<view class="x">
					*
				</view>
				<view class="title">职业</view>
				<picker @change="occupationPickerChange" :value="occupationPickerIndex" range-key="name" :range="occupationPicker">
					<view class="picker">
						{{occupationPickerIndex>-1?occupationPicker[occupationPickerIndex].name:'请选择'}}
					</view>
				</picker>
			</view>
			
			<view class="cu-form-group" style="margin-top: 30rpx;">
				<view class="x">
					*
				</view>
				<view class="title">手机号</view>
				<input v-model="informationObj.phone"  type="number" placeholder="请输入手机号" name="input"></input>
			</view>
			<!-- <view class="cu-form-group">
				<view class="x">
					*
				</view>
				<view class="title">验证码</view>
				<input v-model="informationObj.verificationCode" placeholder="请输入短信验证码" name="input" />
				<view @click="verificationCodeBtn" v-if="!verificationCodeState" class="verificationCode">
					获取验证码
				</view>
				<view class="answer" v-else>
					{{time}}s
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
		<view class="confirm" @click="Filing" :class="{unclickable:!informationObj.patientName ||!informationObj.idNo ||!informationObj.phone }">
			确认建档
		</view>
		<!-- <view class="confirm" @click="Filing" :class="{unclickable:!informationObj.occupation ||!informationObj.patientType ||!informationObj.phone }">
			确认建档
		</view> -->
	</view>
</template>
<script>
	import filingApi from '@/api/filingApi.js'
	import {mapMutations} from 'vuex'
	export default {
		data(){
			return {
				informationObj:{
					relation:'',
					patientName:'',
					sex:'',
					nationality:'',
					birthday:'',
					address:'',
					occupation:'',
					patientType:'',
					num:'',
					phone:'',
					verificationCode:'',
				},
				occupationPickerIndex: -1,
				patientTypePickerIndex:-1,
				occupationPicker: [
					{name:'国家公务员',type:'11'},
					{name:'专业技术人员',type:'13'},
					{name:'职员',type:'17'},
					{name:'企业管理人员',type:'21'},
					{name:'工人', type:'24'},
					{name:'农民', type:'27'},
					{name:'学生', type:'31'},
					{name:'现役军人', type:'37'},
					{name:'自由职业者', type:'51'},
					{name:'个体经营者', type:'54'},
					{name:'无业人员', type:'70'},
					{name:'退(离)休人员', type:'80'},
					{name:'其他',type:'90'},
					{name:'散居儿童',type:'97'},
					{name:'幼托儿童',type:'98'},
					],
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
			}
		},
		onLoad(e) {
			// this.informationObj = JSON.parse(decodeURIComponent(e.getIdCardInformation))
			// this.$set(this.informationObj,'relation','本人')
			// this.informationObj.patientType = '01'   //自费
			// if(this.informationObj.name){
			// 	this.informationObj.birthday = [this.informationObj.birthday.slice(0,4),this.informationObj.birthday.slice(4,6),this.informationObj.birthday.slice(6)].join('-')
			// }
			 
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
			Filing(){
				if (!this.informationObj.patientName ||!this.informationObj.idNo ||!this.informationObj.phone) {
					uni.showToast({
						title: '请完善您的信息',
						icon: 'none',   
						duration: 2000 
					})
				} else {
					this.informationObj.patientType = '自费';
					filingApi.archive(this.informationObj).then(res => {
						let result = JSON.parse(res.data.msg);
						if(result.success){
							uni.showToast({
								title: '建档成功',
								duration: 2000
							});
							uni.setStorageSync('loginData', result.data);
							wx.reLaunch({ url: '/pages/more/index' })
						}else{
							uni.showToast({
							    title: result.msg,
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