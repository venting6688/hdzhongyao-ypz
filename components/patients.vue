<template>
	<view>
		<view class="stack-container">
			<view class="layer top-layer">
				<view class="patients" v-if="footData.patientName != undefined || defaultVal.patientName != undefined">
					<view class="info" @click="cutPatient">
						<view class="name">
							<text>{{footData.patientName ? footData.patientName : defaultVal.patientName}}</text>
							<view class="change">
								<uni-icons type="person" class="icon" color="$global-color" />
								<text :class="fontMode === 'elder' ? 'text-elder' : ''">切换就诊人</text>
							</view>
						</view>
						<view class="id">{{pixelateNumber(footData.idNum ? footData.idNum : defaultVal.idNum)}}</view>
					</view>
					<view class="code" @click="code">
						<image src="https://aiwz.sdtyfy.com:8099/img/qrcode.png" mode="aspectFit" />
					</view>
				</view>
				<view class="addPatients" v-else @click="onPatientClick">
					<uni-icons type="plus" class="icon" :size="fontMode === 'elder' ? 40 : 34" color="$global-color"></uni-icons>
					<text :class="fontMode === 'elder' ? 'text-elder' : 'text-normal'">暂无就诊人，点击绑定就诊人</text>
				</view>
			</view>
			<view class="layer middle-layer"></view>
			<view class="layer bottom-layer"></view>
		</view>
		
		<uni-popup class="qrcode" safe-area  ref="uvQrcode">
				<view class="box" v-if="qrcodeState">
				<image class="img" :src="`data:image/png;base64,${qrCode}`" mode=""></image>
				<!-- <uv-qrcode ref="qrcode" size="500rpx" :value="qrCode"></uv-qrcode> -->
			</view>
		</uni-popup>
		<uni-popup class="cutPatientDialog" @maskClick="cutPatientPopupClick" :safe-area="false"  ref="cutPatientPopup" type="bottom">
		   <popupFamily v-if="cutPatientPopupState" :personageObj="personageObj" @handle="show" />
		</uni-popup>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin.js'
	import popupFamily from './popupFamily.vue';
	import { mapState, mapMutations } from 'vuex'
	
	export default {
		mixins: [mixin],
		props: {
		  fontMode: {
		    type: String,
		    default: 'normal'
		  }
		},
		components:{
			popupFamily,
		},
		computed: {
			...mapState(['footData']),
		},
		data() {
			return {
				registerData:{
					archivesList:[]
				},
				personageObj:{
					list:[],
					sole:{},
				},
				defaultVal: {},
				timer:null,
				qrCode:null,
				qrcodeState:false,
				cutPatientPopupState:true,
			}
		},
		mounted() {
			this.loginData()
		},
		methods: {
			show(){
				this.$refs.cutPatientPopup.close()
			},
			
			onPatientClick() {
				uni.navigateTo({ url: '/sub_packages_healthcard/family/familyManage' })
			},
			
			code(){
				if (this.footData.healthCardData != null) {
					let hospitalId = '40088';
					let healthCardId = this.footData.patientCard;
					let webviewUrl = '/pages/webview/webview?url=$url';
					let redirectUrl = '';
					let fieldCode = '';
					wx.navigateTo({
						url: `plugin://healthCardPlugins/healthcode?hospitalId=${hospitalId}&healthCardId=${healthCardId}&webviewUrl=${encodeURIComponent(webviewUrl)}&redirectUrl=${encodeURIComponent(redirectUrl)}`,
					});	
				} else {
					this.qrCode = this.footData.qrCode
					this.$refs.uvQrcode.open('center')   //弹框
					this.qrcodeState = true
				}
			},
			
			cutPatientPopupClick(){
				this.timer = setTimeout(()=>{
					this.cutPatientPopupState = false
					clearTimeout(this.timer)
					this.timer = null
				},1500)
			},
			
			cutPatient(){
				if(this.timer){
					clearTimeout(this.timer)
					this.timer = null
					this.cutPatientPopupState = false
				}
				this.$nextTick(() => {
					this.loginData()
					this.cutPatientPopupState = true
					this.$refs.cutPatientPopup.open('bottom')   //弹框
				});
			},
			
			loginData(){
				let loginValue = uni.getStorageSync("loginData");
				if(loginValue != undefined){
					this.registerData = loginValue
					this.defaultVal = this.registerData.defaultArchives
					this.personageObj.list = this.registerData && this.registerData.archivesList
					this.personageObj.sole = this.footData
				}
			},
			
		},
	}
</script>

<style lang="scss" scoped>
	.stack-container {
		position: relative;
		width: 720rpx;
		height: 200rpx;
		margin: -10rpx auto 25rpx;
		.layer {
		  position: absolute;
		  width: 100%;
		  height: 200rpx;
		  border-radius: 20rpx;
		  color: #fff;
		  text-align: center;
		  line-height: 200rpx;
		  font-weight: bold;
		}
	}
	.addPatients {
		height: 100%;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	  align-items: center;
		color: $global-color;
		.icon {
			line-height: 1;
			vertical-align: middle;
			color: $global-color;
			margin-right: 5rpx;
			margin-bottom: 20rpx;
		}
	}
	.text-normal {
	  font-size: 32rpx;
		line-height: 1;
	}
	.text-elder {
	  font-size: 38rpx;
		line-height: 1;
	}
	.patients {
		display: flex;
		padding: 30rpx;
		justify-content: space-between;
	  align-items: center;
		height: 100%;
		.info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			.name {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				color: #333333;
				text {
					line-height: 1;
					display: inline-block;
					height: auto;
					margin: 0;
					padding: 0;
				}
			}
			.id {
			  color: #6C7AAA;
			  margin-top: 20rpx;
			  font-size: 30rpx;
				line-height: 1;
				text-align: left;
			}
			.change {
				display: flex;
				align-items: center;
				background: #F3F7FF;
				color: $global-color;
				height: 50rpx;
				border-radius: 40rpx;
				margin-left: 15rpx;
				padding: 15rpx;
				.icon {
					vertical-align: middle; 
					margin-right: 5rpx;
					line-height: 1;
				}
				text {
					font-size: 28rpx;
					line-height: 1;
				}
			}
		}
		.code {
			background: #F3F7FF;
			border-radius: 15rpx;
			height: 155rpx;
			padding: 15rpx;
			image {
				width: 128rpx;
				height: 128rpx;
			}
		}
	}
	/* 底层 */
	.bottom-layer {
	  background-color: #F1EDE9;
	  top: 20rpx;
	  z-index: 1;
	}
	/* 中层 */
	.middle-layer {
	  background-color: #CDBFA7;
	  top: 10rpx;
	  z-index: 2;
	}
	/* 上层 */
	.top-layer {
	  background-color: #fff;
	  top: 0rpx;
	  z-index: 3;
	}
</style>