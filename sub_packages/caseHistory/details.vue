<template>
	<view class="details">
		<view class="middle">
			<view class="personal personal-1">
				<view class="title1">
					<view class="name">
						<text>张*萌</text>
						<text>23岁</text>
						<text>女</text>
					</view>
				</view>
				<view class="center">
					<view class="no">
						<text>就诊科室：</text>
						<text>{{item.patientName}}</text>
					</view>
					<view class="no doctor">
						<text>就诊医生：</text>
						<text>张海松</text>
						<text>主任医师</text>
					</view>
					<view class="no">
						<text>就诊时间：</text>
						<text>2023-07-15</text>
					</view>
				</view>
				<view class="tips">
					温馨提示：本次诊疗仅针对目前病情，如有病情变化，请及时复诊。
				</view>
				<ul>
					<li v-for="(item,index) in modulesList" :key="index">
						<view class="img">
							<image :src="item.img" mode=""></image>
						</view>
						<view class="name">
							{{item.name}}
						</view>
					</li>
				</ul>
			</view>
			<view class="personal personal-2">
				<view class="center">
					<view class="word">
						<text></text>
						<view>
							主诉
						</view>
						<view>
							突发咯血半天，量少，有误吸史，偶有咯痰。  双肺阴性
						</view>
					</view>
					<view class="word">
						<text></text>
						<view>
							现病史
						</view>
						<view>
							突发咯血半天，量少，有误吸史，偶有咯痰。  双肺阴性
						</view>
					</view>
					<view class="word">
						<text></text>
						<view>
							既往史
						</view>
						<view>
							否认既往病史
						</view>
					</view>
					<view class="word">
						<text></text>
						<view>
							临床检查
						</view>
						<view>
							一般情况尚可，神志清楚，呼吸平稳，急性病容，双肺呼吸音粗糙末闻及干湿啰音。心率78次/分，律齐。
						</view>
					</view>
					<view class="word">
						<text></text>
						<view>
							辅助检查
						</view>
						<view>
							血常规正常，胸部CT平扫未见确切病变，腹部超声未见异常
						</view>
					</view>
					<view class="word">
						<text></text>
						<view>
							初步诊断
						</view>
						<view>
							咯血待诊
						</view>
					</view>
					<view class="word">
						<text></text>
						<view>
							处理意见
						</view>
						<view>
							门诊随访, 1-3天后复诊,若有异常不适,即刻复诊，休息3天。
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				modulesList:[
					{
					    img:require('../static/image/caseHistory1.png'),
					    name:'电子病历',
					},
					{
					    img:require('../static/image/caseHistory2.png'),
					    name:'下载',
					},
					{
					    img:require('../static/image/caseHistory3.png'),
					    name:'智能解读',
					},
					
				],
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
	.details {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		.middle {
			overflow: auto;
			margin-bottom: 50rpx;
			.personal {
				width: 722rpx;
				background: #ffffff;
				border-radius: 12rpx;
				margin: 30rpx auto 0 auto;
				padding-bottom: 20rpx;
				.title {
					margin: 0 20rpx;
					height: 65rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					image {
						width: 12rpx;
						height: 18rpx;
						margin-left:20rpx;
					}
					
					.name {
						display: flex;
						align-items: center;
						font-size: 28rpx;
						line-height: 28rpx;
						font-family: PingFang SC, PingFang SC-600;
						color: #000000;
						padding: 10rpx 0;
					}
					.right {
						display: flex;
						align-items: center;
						font-size: 26.72rpx;
						line-height: 26.72rpx;
						font-family: PingFang SC, PingFang SC-400;
						font-weight: 400;
						color: #4286ff;
						padding: 10rpx 0;
					}
				}
			}
			.personal-1 {
				.title1 {
					margin: 0 20rpx;
					height: 70rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.name {
						display: flex;
						align-items: center;
						font-size: 40rpx;
						line-height: 40rpx;
						font-family: PingFang SC, PingFang SC-600;
						font-weight: 600;
						color: #000000;
						padding: 10rpx 0;
						text{
							margin-right:60rpx;
							
						}
					}
					
				}
				.center {
					margin: 0 20rpx;
					.no {
						margin: 12rpx 0;
						text {
							&:nth-child(1){
								color: #888888;
							}
							
						}
						
					}
					.doctor {
						text {
							&:nth-child(2){
								margin-right: 30rpx;
							}
							&:nth-child(3){
								color: #888888;
							}
						}
					}
				}
				.tips {
					margin:25rpx 20rpx 0 20rpx;
					font-size: 20rpx;
					color: #4286ff;
					line-height: 20rpx;
				}
				ul {
					width: 704rpx;
					margin: 30rpx auto 0 auto;
					height: 132rpx;
					background: #f0f8ff;
					border-radius: 20rpx;
					display: flex;
					// justify-content: center;
					align-items: center;
					li {
						width: 22%;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.img {
							width: 64rpx;
							height: 64rpx;
							background: rgba(75,168,255,0.14);
							border-radius: 50%;
							display: flex;
							justify-content: center;
							align-items: center;
							
							image {
								width: 36rpx;
								height: 36rpx;
							}
						}
						.name {
							margin-top: 6rpx;
							font-size: 20rpx;
						}
						
					}
				}
			}
			.personal-2{
				
				.center {
					margin: 0 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;				
					.word {
						border-bottom: 2rpx solid #eeeeee;
						padding: 10rpx 0;
						position: relative;
						text {
							position: absolute;
							top: 18rpx;
							display: inline-block;
							width: 4rpx;
							height: 20rpx;
							background: #0680ff;
							
						}
						
						view {
							margin-left: 15rpx;
							&:first-child{
								font-size: 28rpx;
							}
							&:last-child{
								margin-top: 6rpx;
								color: #888888;
								font-size: 24rpx;
							}
						}
						&:last-child {
							border: 0;
						}
					}
				}
			}
			
		}
		
		
	}
</style>