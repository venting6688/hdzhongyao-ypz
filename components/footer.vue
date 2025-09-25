<template>
	<view>
		<view class="foot" :class="{footPadding:iosState}">
			<view class="content">
				<view class="foot-name" v-if="footData.patientName || siginData.patientName">
					<view class="patient-code">
						<view class="code">
							<image  src="@/static/image/Group 344.png" mode=""></image>
						 </view>
						<view class="text" >就诊码</view>
					</view>
					 <!-- <view class="patient-name" @click="cutPatient"> -->
					 <view class="patient-name">
						<view class="name">
							 <text>{{footData.patientName || siginData.patientName ? pixelate(footData.patientName || siginData.patientName):''}}</text>
							 <!-- <image src="@/static/image/Frame.png" mode="widthFix"></image> -->
						</view>
					 </view>
				</view>
				<view class="wire"  v-if="footData.patientName || siginData.patientName"></view>
				<view class="foot-bar" :class="{'bar-w':!footData.patientName || !siginData.patientName}">
					<view class="piece" 
					:style="{ width:'33.333%'}" 
					v-for="item in footList" 
					:key="item.name" 
					@click="footBtn(item)"
					>
						<view class="title">
							<image v-if="item.type==footState" :src="item.selectedIconPath" mode="widthFix"></image>
							<image v-else :src="item.iconPath" mode="widthFix"></image>
						</view>
						<view class="text" :class="{blue:item.type == footState}">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</view>	
		<uni-popup class="qrcode" safe-area  ref="uvQrcode">
			<view class="box" v-if="qrcodeState">
				<image class="img" :src="`data:image/png;base64,${qrCode}`" mode=""></image>
				<!-- <uv-qrcode ref="qrcode" size="500rpx" :value="qrCode"></uv-qrcode> -->
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import mixin from '../mixins/mixin'
	import HeaderbarApi from '@/api/HeaderbarApi.js'
	export default {
		mixins: [mixin],
		props: {
		  footState: Number,
		},
		
		data() {
			return {
				footList: [
          {
            pagePath: "/pages/virtualNurse/index",
            iconPath: 'https://aiwz.sdtyfy.com:8099/img/footNavigation+.png',
            selectedIconPath: 'https://aiwz.sdtyfy.com:8099/img/footNavigation.png',
            name: '护士导诊',
            type: 1,
          },
          {
            pagePath: "/pages/convenient/index",
            iconPath: 'https://aiwz.sdtyfy.com:8099/img/footNavigation1+.png',
            selectedIconPath: 'https://aiwz.sdtyfy.com:8099/img/footNavigation1.png',
            name: '便捷导引',
            type: 2,
          },
          {
            pagePath: "/pages/home/index",
            iconPath: 'https://aiwz.sdtyfy.com:8099/img/footNavigation2+.png',
            selectedIconPath: 'https://aiwz.sdtyfy.com:8099/img/footNavigation2.png',
            name: '更多服务',
            type: 3,
          }
        ],
			  loginMenu: ['护士导诊', '便捷导引', '更多服务'],
			  notLoginMenu: ['更多服务'],
				registerData:{
					archivesList:[]
				},
				personageObj:{
					list:[],
					sole:{},
				},
				qrCode:null,
				qrcodeState:false,
				iosState:false,
				cutPatientPopupState:true,
				timer:null,
				siginData: {}
			}
		},
		computed: { 
			...mapState(['footData', 'loginStatus']),
		},
	  async created() {
			uni.hideTabBar()
			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					this.iosState = false
					break;
				case 'ios':
					this.iosState = true
					break;
				default:
					this.iosState = true
					break;
			}
		},
		methods: {
			cutPatientPopupClick(){
				this.timer = setTimeout(()=>{
					this.cutPatientPopupState = false
					clearTimeout(this.timer)
					this.timer = null
				},1500)
			},
			show(){
				this.$refs.cutPatientPopup.close()
			},
			code(){
				this.qrCode = this.footData.qrCode
				this.$refs.uvQrcode.open('center')   //弹框
				this.qrcodeState = true
			},
			
			footBtn(e){
				uni.switchTab({
					url: e.pagePath,
				})
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
				if(loginValue){
					// this.registerData = JSON.parse(loginValue)
					this.registerData = loginValue;
					this.personageObj.list = this.registerData && this.registerData.archivesList
					this.personageObj.sole = this.footData
				}
			},
		},
		mounted() {
			this.loginData();
			let data = uni.getStorageSync('loginData');
			this.siginData = data.defaultArchives ? data.defaultArchives : {};
		},
	}
</script>

<style lang="less" scoped>
	    .footPadding{
				padding:0 0 165rpx 0 !important;
	    }
	    .blue {
	    	color: #0386FF !important;
	    }
		.bar-w{
			width: 100% !important;
		}
        .foot {
			width: 750rpx;
			height: 144rpx;
			padding:5rpx 0 160rpx 0;
			background: #ffffff;
			z-index: 100;
			box-shadow: 0rpx -4rpx 8rpx 0rpx rgba(184,192,204,0.20);
		
			.content {
				padding-left:35rpx;
				width: 750rpx;
				height: 144rpx;
				display: flex;
				align-items: center;
				// background: #999;
				.foot-name {
					display: flex;
					
					.patient-code {
						// background: #797979;
						width: 86rpx;
						text-align: center;
						height: 124rpx;
						margin: 20rpx 24rpx 0 0;
						
						.code {
							margin-bottom: 8rpx;
							
							image {
								width: 72rpx;
								height: 72rpx;
							}
						}
						.text {
							width: 86rpx;
							font-size: 27rpx;
						}
					}
					
					.patient-name {
						height: 124rpx;
						width: 186rpx;
						display: flex;
						align-items: center;
						
						.name {
							width: 186rpx;
							font-size: 45rpx;
							display: flex;
						
							text {
								width: 119rpx;
								// background: darkblue;
								text-align: center;
							}
							
							image {
								display: inline-block;
								width: 50rpx;
								height: 60rpx;
								// background: red;
							}
						}
						
						.price {
							margin-top: 10rpx;
							font-size: 29rpx;
							// background: rebeccapurple;
							
							text {
								margin-right: 10rpx;
							}
						}
					}
				}
				
				.wire {
					margin-top: 0rpx;
					width: 0rpx;
					height: 74rpx;
					border: 2rpx solid #e8e8e8;
				}
				
				.foot-bar {
					// background: tomato;
					width: 422rpx;
					height: 144rpx;
					display: flex;
					
					.piece {
						width: 33.333%;
						height: 144rpx;
						font-size: 24rpx;
						color: #000000;
						line-height: 24rpx;
						
						
						.title {
							margin-top: 20rpx;
							// background: #0F74C8;
							height: 70rpx;
							width: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							text-align: center;
							
							image {
								width: 40rpx;
								height: 40rpx;
							}
						}
						
						.text {
							font-size: 28rpx;
							width: 100%;
							height: 40rpx;
							// background-color: #456565;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
				}
			}
		}
		.qrcode{
			.box {
				width: 600rpx;
				height: 620rpx;
				background: #ffffff;
				display: flex;
				border-radius: 14rpx;
				align-items: center;
				justify-content: center;
				.img{
					width: 90%;
					height: 80%;
				}
			}
			
			
		}
		.Dialog {
			width: 750rpx;
			.center {
				width: 750rpx;
				background-color: #ffffff;
				border-radius: 30rpx 30rpx 0 0;
				height: 540rpx;
				overflow: hidden;
				.title {
					display: flex;
					align-items: center;
					height: 50rpx;
					margin: 20rpx;
					font-size: 38rpx;
				}
			.scroll {
					height: 100%;
					.middle {
						    margin: 0 20rpx 0 20rpx;
							padding-top: 20rpx;
							display: flex;
							flex-wrap: wrap;
							.li {
								width: 33.3333%;
								margin-bottom: 40rpx;
								
								
								.img{
									width: 100%;
									text-align: center;
									
									image {
									    width: 40rpx;
									    height: 40rpx;
								    }
								}
								.name {
									width: 100%;
									text-align: center;
									font-size: 32rpx;
									color: #000000;
									line-height: 32rpx;
									margin-top: 15rpx;
									
								}
							}
							
							.colour {
								border: 2rpx dashed #797979;
								// background: #479cff !important;
								// color: #ffffff;
							}
						}
					}
				}
		}
		.cutPatientDialog{
			width: 100%;
		}
</style>
