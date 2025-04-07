<template>
	<view class="box">
		<bar />
		<date @handle="show" />
		<view class="information">
			<ul v-if="list.length">
				<li @click="information(item)" v-for="(item,index) in list" :key="index">
					<view class="title">
						<view class="name">
							<text>{{item.appointmentTime?item.appointmentTime.split(' ')[0]:''}}</text>
						    <!-- <image src="../static/image/icon-edit.png" mode=""></image> -->
						</view>
						<view class="delete">
							<text>查看详情</text>
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
							<text>{{item.queueName}}</text>
						</view>
						<view class="no">
							<text>就诊医生：</text>
							<text>{{item.doctorName}}</text>
						</view>
					</view>
				</li>
			</ul>
			<view v-else class="without">
				<image src="https://aiwz.sdtyfy.com:8099/img/wu.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import bar from '../components/bar.vue'
	import elseApi from '@/api/elseApi.js'
	import { mapState } from 'vuex'
	import date from '../components/date.vue'
	export default {
		components:{
			bar,
			date,
		},
		data(){
			return {
				list:[],
				date:{},
			}
		},
		computed: {
			...mapState(['footData']),
		},
		methods: {
			getVisitRecord(){
				try {
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						startDate:this.date.startTime,
						endDate:this.date.endTime,
					}
					elseApi.getVisitRecord(data).then(res => {
						if(res.data.code===200){
							this.list = res.data.data.orders.order || []
						}else {
							this.list = []
						}
					})
				} catch (error) {
					console.log(error)
				}
			},
			show(time){
				const datePattern = /^\d{4}-\d{2}-\d{2}$/.test(time.startTime);
				if(datePattern){
					this.date = time
					this.getVisitRecord()
				}
			},
			information(item){
				let data = {...this.date,...item}
				uni.navigateTo({
					url: `/sub_packages/record/details?item=${encodeURIComponent(JSON.stringify(data))}`
				})
			}
			
		},
		mounted(){
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
					&:first-child{
						margin: 0;
					}
					
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
			.without {
				font-size: 40rpx;
				width: 681.3rpx;
				height: 500rpx;
				background: #ffffff;
				margin: 0 auto;
				border-radius: 15.27rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		
	}
</style>