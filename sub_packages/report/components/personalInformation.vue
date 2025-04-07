<template>
	<view class="details">
		<view class="middle">
			<view class="personal-1">
				<view class="title1">
					<view class="name">
						<text>{{footData.patientName}}</text>
						<text>{{footData.sex}}</text>
					</view>
				</view>
				<view class="center">
					<view class="no">
						<text>文档ID：</text>
						<text>{{report.documentID?report.documentID:''}}</text>
					</view>
					<view class="no">
						<text>检查项目：</text>
						<text>{{report.documentTitle?report.documentTitle:''}}</text>
					</view>
					<view class="no">
						<text>申请科室：</text>
						<text>{{report.queueName?report.queueName:''}}</text>
					</view>
					<view class="no">
						<text>申请医生：</text>
						<text>{{report.doctorName?report.doctorName:''}}</text>
					</view>
					<view class="no two">
						<text>检查时间：</text>
						<text>{{report.updateDate?report.updateDate:''}} {{report.updateTime?report.updateTime:''}}</text>
					</view>
					<view class="no">
						<text>报告医师：</text>
						<text>{{report.reportDoctor?report.reportDoctor:''}}</text>
					</view>
					<view class="no">
						<text>审核医师：</text>
						<text>{{report.auditDoctor?report.auditDoctor:''}}</text>
					</view>
				</view>
				<view class="tips">
					温馨提示：本报告仅供临床医师结合临床参考
				</view>
				<ul>
					<li @click="navigator(index)" v-for="(item,index) in modulesList" :key="index">
						<template>
							<view class="img">
								<image :src="item.img" mode=""></image>
							</view>
							<view class="name">
								{{item.name}}
							</view>
						</template>
						<!-- <web-view v-else :src="webUrl"></web-view> -->
					</li>
				</ul>
			</view>
			
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		props:{
			title:String,
			report:Object,
		},
		data(){
			return {
				webUrl:'https://m.yzhcloud.com/pf/SYYEFY/?f=wechatpid&amp;sd=xC4I5c6TqaKcIvtd++dhpA==&amp;fp=5pyx6Zuo54aZ',
				modulesList:[
					// {
					//     img:require('../../static/image/caseHistory5.png'),
					//     name:'查看报告',
					// },
					// {
					//     img:require('../../static/image/caseHistory3.png'),
					//     name:'下载',
					// },
					{
					    img:require('../../static/image/caseHistory1.png'),
					    name:'智能解读',
					},
					// {
					//     img:require('../../static/image/caseHistory4.png'),
					//     name:'云胶片',
					// },
				],
			}
		},
		computed: {
			...mapState(['footData']),
		},
		methods: {
			navigator(index){
				// if(index!==2){
				// 	return
				// }
				if(this.report.title==='检查'){
					
				}else{
					
				}
				wx.reLaunch({
				    url: `/pages/virtualNurse/index?pattern=2&&manifestation=${this.report.manifestation}`,
				})
				console.log(this.report.manifestation)
			},
		},
		mounted() {
		},
		
	}
</script>

<style lang="less" scoped>
	.details {
		width: 100vw;
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		.middle {
			overflow: auto;
			
			.personal-1 {
				background: #ffffff;
				width: 722rpx;
				margin: 16rpx auto 0 auto;
				border-radius: 12rpx;
				padding-bottom: 20rpx;
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
					display: flex;
					flex-wrap: wrap;
					.no {
						min-width: 50%;
						margin: 12rpx 0;
						text {
							&:nth-child(1){
								color: #888888;
							}
							
						}
						
					}
					.two {
						min-width: 100%;
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
						width: 25%;
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

			
		}
		
		
	}
</style>