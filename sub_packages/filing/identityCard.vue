<template>
	<view class="identityCard">
		<view class="box choice">
			<view class="img" @click="after">
				<image v-if="img" :src="img" mode=""></image>
				<image v-else src="../static/image/icon-id-img@2x.png" mode=""></image>
			</view>
			<view class="text">
				请点击上传身份证人像面
			</view>
		</view>
		<view class="box">
			<view class="tips">
				<view class="title">
					温馨提示：
				</view>
				<view class="tips-text">
					请上传真实清晰的证件照片，身份证照片不得有遮挡确保边缘完整。以免信息审核不通过。
				</view>
				<view class="tips-img">
					<view>
						<view class="img">
							<image src="../static/image/Frame@2x.png" mode=""></image>
						</view>
						<text>标准</text>
					</view>
					<view>
						<view class="img">
							<image src="../static/image/Mask group@2x.png" mode=""></image>
						</view>
						<text>边框缺失</text>
					</view>
					<view>
						<view class="img">
							<image src="../static/image/Frame_2@2x.png" mode=""></image>
						</view>
						<text>照片模糊</text>
					</view>
					<view>
						<view class="img">
							<image src="../static/image/Frame_1@2x.png" mode=""></image>
						</view>
						<text>闪光强烈</text>
					</view>
				</view>
			</view>
		</view>
		<view class="btn" @click="confirm">
			下一步
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				img:'',
				fleg:true,
			}
		},
		onShow() {
			this.fleg = true
		},
		methods: {
			after (){
				uni.chooseImage({
				    count: 6, //默认9
				    sizeType: ['original', 'compressed'], 
				    sourceType: ['album'], //从相册选择
				    success:  (chooseImageRes) => {
				    	// 获取的格式是数组，多选会同时返回，单选只返回一项
						console.log('chooseImageRes',chooseImageRes)
				        this.img = chooseImageRes.tempFilePaths[0]
				    }
				});
			},
			confirm(){
				if(!this.img){
					uni.showToast({
					    title: '请先上传身份证图片',
					    icon: 'none',   
					    duration: 2000 
					})
					return
				}
				if(this.fleg){
					this.fleg = false
					uni.uploadFile({
						url: 'https://api.2zhongyi.cn/prod-api/mobile2/getIdCardInformation',
						filePath: this.img,
						name: 'multipartFile',
						success: (uploadFileRes) => {
							let res = JSON.parse(uploadFileRes.data).data;
							let data = {
								idNo: res.num,
								idType: 1,
								setupType: 1,
								patientType: res.patientType == '01' ? '自费' : '医保',
								patientName: res.name,
								sex: res.sex,
								birthday: res.birth,
								phone: res.phone,
								address: res.address,
								nation: res.nationality,
								cardNo: '',
								idSeqNo: '',
								cardType: '',
								fetalTimes: '',
								accountType: '',
								versionLevel: '',
								renamType: '',
								renamChannel: '', 
							}
							uni.navigateTo({
								url: `/sub_packages/filing/information?getIdCardInformation=${encodeURIComponent(JSON.stringify(data))}`
							})
							
						}
					});
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.identityCard {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		
		.box {
			width: 681.3rpx;
			height: 343.51rpx;
			background: #ffffff;
			border-radius: 19.08rpx;
			margin: 30rpx auto 0 auto;
			
		}
		.choice {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.img {
				width: 160rpx;
				height: 160rpx;
				margin-bottom: 20rpx;
				image {
					width: 160rpx;
					height: 160rpx;
				}
			}
			.text {
				font-size: 26.72rpx;
				font-family: PingFang SC, PingFang SC-400;
				font-weight: 400;
				text-align:center;
				color: #999999;
				line-height: 26.72rpx;
			}
		}
		
		.box {
			.tips {
				.title {
					margin: 20rpx 30rpx;
					width: 200rpx;
					font-size: 26.72rpx;
					color: #333333;
				}
				.tips-text {
					font-size: 22.9rpx;
					line-height: 36rpx;
					color: #999999;
					margin:0 30rpx 30rpx 30rpx;
				}
				.tips-img{
					margin: 30rpx;
					display: flex;
					justify-content: space-between;
					
					> view {
						text-align: center;
						.img {
							width: 143.13rpx;
							height: 100rpx;
							background: #eff6ff;
							border-radius: 3.82rpx;
							margin-bottom: 10rpx;
							image {
								width: 130rpx;
								height: 100rpx;
								
							}
						}
					}
				}
			}
		}
		.btn {
			width: 681.3rpx;
			height: 87.79rpx;
			background: #4286ff;
			border-radius: 43.89rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30.53rpx;
			line-height:30.53rpx;
			margin: 30rpx auto;
			color: #ffffff;
		}
	}
</style>