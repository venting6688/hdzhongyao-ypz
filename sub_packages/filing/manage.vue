<!-- <template>
	<view class="manage">
		<view class="information">
			<ul>
				<li v-for="item in patientList" :key="item.patientCard">
					<view class="title">
						<view class="name">
							<text>{{pixelate(item.patientName)}}</text>
						    <image src="../static/image/icon-edit.png" mode=""></image>
						</view>
						<view class="delete">
							<image src="../static/image/icon-delete.png" mode=""></image>
							<text>删除</text>
						</view>
					</view>
					<view class="center">
						<view class="no">
							<text>手机号：</text>
							<text>{{pixelateNumber(item.phoneNum.toString())}}</text>
						</view>
						<view class="no">
							<text>身份证号：</text>
							<text>{{pixelateNumber(item.patientCard.toString())}}</text>
						</view>
					</view>
				</li>
			</ul>
		</view>
		<view class="btn" @click="increase">
			<image src="../static/image/icon-add.png" mode=""></image>
			<text>增加建档</text>
		</view>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin.js'
	export default {
		mixins: [mixin],
		data(){
			return {
				patientList:[],
			}
		},
		onShow() {
			let loginValue = uni.getStorageSync("loginData");
			if(loginValue){
				let registerData = JSON.parse(loginValue)
				this.patientList = registerData && registerData.archivesList
			}
		},
		methods: {
			increase() {
				uni.navigateTo({
					url: `/sub_packages/filing/identityCard`
				})
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
		
		.information {
			width: 100%;
			overflow: auto;
			ul {
				width: 681.3rpx;
				margin: 0 auto;
				> li {
					width: 681.3rpx;
					height: 215.65rpx;
					background: #ffffff;
					border-radius: 15.27rpx;
					margin-top: 30rpx;
					
					.title {
						margin: 0 20rpx;
						height: 88rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-bottom: 2rpx solid #F5F5F5;
						
						image {
							width: 30rpx;
							height: 30rpx;
							margin: 0 20rpx;
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
						}
						.delete {
							display: flex;
							align-items: center;
							font-size: 26.72rpx;
							line-height: 26.72rpx;
							font-family: PingFang SC, PingFang SC-400;
							font-weight: 400;
							color: #666666;
							padding: 10rpx 0;
						}
					}
					.center {
						margin: 0 20rpx;
						height: 125.65rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-evenly;
						.no {
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
		
		.btn {
			width: 681.3rpx;
			height: 87.79rpx;
			background: #4286ff;
			border-radius: 43.89rpx;
			margin: 60rpx auto;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #ffffff;
			
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
	}
</style> -->