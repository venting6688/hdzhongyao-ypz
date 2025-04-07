<template>
	<view class="box">
		<bar />
		<view class="header">
			<view class="date">
				<picker mode="date" header-text="选择年"  :start="startIndex" :end="endIndex" fields="year" :value="year" @change="bindDateChange">
				    <view class="date">
				        <text>{{year!=='无'?year+'年':year}}</text>
				        <image src="../../static/image/Frame.png" mode=""></image>
				    </view>
				</picker>
				<picker @change="bindPickerdateChange" :value="index" :range="monthArr">
				    <view class="date">
				      <text>{{monthArr[index]}}</text>
					  <image src="../../static/image/Frame.png" mode=""></image>
				    </view>
				  </picker>
			</view>
			<view class="date-btn">
				<view :class="{blue:dateState===1}" @click="timeClick(1)">
					近半年
				</view>
				<view :class="{blue:dateState===2}" @click="timeClick(2)">
					近三个月
				</view>
			</view>
		</view>
		<view class="information">
			<ul>
				<li @click="information" v-for="item in patientList" :key="item.patientCard">
					<view class="title">
						<view class="name">
							<text>2023年12月20日</text>
						    <!-- <image src="../static/image/icon-edit.png" mode=""></image> -->
						</view>
						<view class="delete">
							<text>查看病历</text>
							<image src="../static/image/Vector@2x.png" mode=""></image>
						</view>
					</view>
					<view class="center">
						<view class="no">
							<text>就诊人：</text>
							<text>{{item.patientName}}</text>
						</view>
						<view class="no">
							<text>就诊科室：</text>
							<text>呼吸内科门诊</text>
						</view>
						<view class="no">
							<text>就诊医生：</text>
							<text>张海松</text>
						</view>
					</view>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	import bar from '../components/bar.vue'
	export default {
		components:{
			bar,
		},
		data(){
			return {
				year: '无',
				index:0,
				dateState:0,
				startIndex:null,
				endIndex:null,
				monthArr:['无','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				patientList:[
					{
						patientName:'张张张'
					},
					{
						patientName:'张张张'
					},
					{
						patientName:'张张张'
					},
					{
						patientName:'张张张'
					},
					{
						patientName:'张张张'
					},
					{
						patientName:'张张张'
					},
				]
			}
		},
		methods: {
			bindDateChange(e) {
			      this.year = e.detail.value;
				  this.dateState = 0
			},
			bindPickerdateChange(e) {
			    this.index = e.detail.value;
				this.dateState = 0
			},
			timeClick(num){
				this.year = '无'
				this.index = 0
				this.dateState = num
			},
			information(){
				uni.navigateTo({
					url: `/sub_packages/caseHistory/details`
				})
			}
			
		},
		mounted(){
			this.endIndex= new Date().getFullYear();
			this.startIndex = this.endIndex - 5;
		}
	}
</script>

<style lang="less" scoped>
	.box {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24rpx 30rpx;
			
			
			.date {
				min-width: 208rpx;
				height: 72rpx;
				background: #ffffff;
				border-radius: 12rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.date {
					display: flex;
					justify-content: center;
					align-items: center;
					min-width: 50%;
					padding: 0 10rpx;
					
					text {
						min-width: 60rpx;
					}
					image {
						width: 22rpx;
						height: 12rpx;
					}
				}
			}
			.date-btn {
				display: flex;
				view {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 56rpx;
					font-size: 28rpx;
					line-height: 28rpx;
					border: 2rpx solid #4286ff;
					border-radius: 42rpx;
					padding: 0 20rpx;
					color: #076aff;
					margin-left: 20rpx;
				}
				.blue {
					background: #4286ff !important;
					color: #ffffff !important;
				}
			}
		}
		.information {
			width: 100%;
			overflow: auto;
			margin-bottom: 50rpx;
			ul {
				width: 681.3rpx;
				margin: 0 auto;
				> li {
					width: 681.3rpx;
					// height: 230rpx;
					padding-bottom: 20rpx;
					background: #ffffff;
					border-radius: 15.27rpx;
					margin-top: 30rpx;
					
					.title {
						margin: 0 20rpx;
						height: 70rpx;
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
							color: #4286ff;
							padding: 10rpx 0;
						}
					}
					.center {
						margin: 0 20rpx;
						height: 140rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
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
		
	}
</style>