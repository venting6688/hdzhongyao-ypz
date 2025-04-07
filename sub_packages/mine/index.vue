<template>
	<view class="user">
		<view class="content">
			<view class="top">
				<text>绑定手机号:</text>
				<text>{{pixelateNumber(footData.phoneNum)}}</text>
			</view>
			<view class="list">
				<navigator url="/sub_packages/prescription/index">
					<view class="row">
						<view class="left">
							<veiw class="text">更多处方</veiw>
						</view>
						<view class="right">
							<uni-icons type="right" size="15" color="#ccc"></uni-icons>
						</view>
					</view>
				</navigator>
				<navigator url="/sub_packages/addressBook/index?type=edit">
					<view class="row">
						<view class="left">
							<veiw class="text">地址簿</veiw>
						</view>
						<view class="right">
							<uni-icons type="right" size="15" color="#ccc"></uni-icons>
						</view>
					</view>
				</navigator>
			</view>
			<view class="list">
				<navigator>
					<view class="row">
						<view class="left">
							<veiw class="text">常见问题帮助</veiw>
						</view>
						<view class="right">
							<uni-icons type="right" size="15" color="#ccc"></uni-icons>
						</view>
					</view>
				</navigator>
				<navigator>
					<view class="row">
						<view class="left">
							<veiw class="text">用户反馈</veiw>
						</view>
						<view class="right">
							<uni-icons type="right" size="15" color="#ccc"></uni-icons>
						</view>
					</view>
				</navigator>
				<navigator>
					<view class="row">
						<view class="left">
							<veiw class="text">用户隐私保护说明</veiw>
						</view>
						<view class="right">
							<uni-icons type="right" size="15" color="#ccc"></uni-icons>
						</view>
					</view>
				</navigator>
			</view>
			
		</view>
		
		<foot :footState="footState"/>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin'
	import foot from '@/components/footer.vue'
	import {mapState} from 'vuex'
	export default {
		mixins: [mixin],
		components:{
			foot,
		},
		data(){
			return {
				footState:2,
			}
		},
		computed: {
			...mapState(['footData']),
		},
		methods: {
			
		},
		mounted() {
			
		}
	}
</script>

<style lang="less" scoped>
	.user {
		width: 100vw;
		height: 100%; 
		display: flex;
		flex-direction: column;
		margin-top: 24rpx;
		.content {
			width: 750rpx;
			text-align: center;
			flex: auto;
			overflow: auto;
			.top {
				width: 722rpx;
				height: 100rpx;
				margin:0 auto;
				background: #ffffff;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				>text {
					margin-left: 30rpx;
					&:first-child{
						color: #999999;
					}
				}
			}
			.list {
				width: 722rpx;
				background: #ffffff;
				border-radius: 12rpx;
				margin: 24rpx auto;
				.row {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding:0 6rpx;
					height: 92rpx;
					border-bottom: 1px solid #ededed;
					position: relative;
					// &:last-child{ border-bottom:0 }
					.left{
						display: flex;
						align-items: center;
						.text{
							padding-left: 20rpx;
							color:#000
						}
					}
					.right{
						display: flex;
						align-items: center;
						.text{
							font-size: 28rpx;
							color:#aaa;
						}
					}
					button{
						position: absolute;
						top:0;
						left:0;
						height: 100rpx;
						width:100%;
						opacity: 0;
					}
				}
			}
			// .bottom {
			// 	margin-top: 30rpx;
			// 	>ul {
			// 		width: 722rpx;
			// 		background: #ffffff;
			// 		border-radius: 12rpx;
			// 		margin: 0 auto;
			// 		padding: 20rpx 0;
			// 		>li {
			// 			padding: 20rpx 0;
			// 			margin:0 30rpx;
			// 			border-bottom: 2rpx solid #ededed;
			// 			&:last-child{
			// 				border: 0;
			// 			}
						
			// 			view {
			// 				display: flex;
			// 				justify-content: space-between;
			// 				text{
			// 					display: inline-block;
			// 					font-size: 28rpx;
			// 					line-height: 28rpx;
								
			// 				}
			// 				image {
			// 					width: 26rpx;
			// 					height: 26rpx;
			// 				}
			// 			}
			// 		}
					
			// 	}
			// }
			.confirm {
				width: 512rpx;
				height: 92rpx;
				background: #ff5c5c;
				border-radius: 46rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				line-height: 32rpx;
				color: #ffffff;
				margin: 60rpx auto;
				
			}
		}
		
	}
</style>