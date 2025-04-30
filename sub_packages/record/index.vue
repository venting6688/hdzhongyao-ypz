<template>
	<view class="box">
		<bar />
		<date @handle="show" />
		<view class="information">
			<ul v-if="list.length">
				<li v-for="(item,index) in list" :key="index">
					<view class="title">
						<view class="name">
							<text>{{item.medDate}} {{item.medTime}}</text>
						    <!-- <image src="../static/image/icon-edit.png" mode=""></image> -->
						</view>
						<!-- <view class="delete">
							<text>查看详情</text>
							<image src="../static/image/Vector@2x.png" mode=""></image>
						</view> -->
					</view>
					<view class="center">
						<view class="no">
							<text>就诊人：</text>
							<text>{{siginData.patientName}}</text>
						</view>
						<view class="no">
							<text>就诊医生：</text>
							<text>{{item.doctName}}</text>
						</view>
						<view class="no">
							<text>就诊科室：</text>
							<text>{{item.deptName}}</text>
						</view>
						<view class="no">
							<text>就诊房间：</text>
							<text>{{item.address}}</text>
						</view>
						<view class="no">
							<text>就诊状态：</text>
							<text>{{item.statusName}}</text>
						</view>
					</view>
				</li>
			</ul>
			<zanwu v-else />
		</view>
	</view>
</template>

<script>
	import bar from '../components/bar.vue'
	import elseApi from '@/api/elseApi.js'
	import { mapState } from 'vuex'
	import date from '../components/date.vue'
	import zanwu from '../components/zanwu.vue'
	export default {
		components:{
			bar,
			date,
			zanwu,
		},
		data(){
			return {
				list:[],
				date:{},
				siginData: {}
			}
		},
		computed: {
			...mapState(['footData']),
		},
		methods: {
			getVisitRecord(){
				try {
					let data = {
						cardNo: this.siginData.patientCard,
						patientId: this.siginData.patientCard,
						cardType: 1, 
						patientId: '',
						startDate: this.date.startTime,
						endDate: this.date.endTime,
					}
					elseApi.registrationRecord(data).then(res => {
						let result = JSON.parse(res.data.msg);
						if(result.success){
							this.list = result.data;
							this.list.map(v => {
								v.statusName = this.showStatus(v.status);
								return v;
							})
						}else {
							this.list = []
						}
					})
				} catch (error) {
					console.log(error)
				}
			},
			
			showStatus(val) {
				let text = '';
				switch(val) {
					case '0':
						text = '已预约';
						break;
					case '1':
						text = '已挂号';
						break;
					case '2':
						text = '已取消';
						break;
					case '3':
						text = '已过期';
						break;
					case '4':
						text = '已停诊';
						break;
					case '5':
						text = '已退号';
						break;
					case '7':
						text = '就诊未完成';
						break;
					case '8':
						text = '就诊完成';
						break;
					case '101':
						text = '待支付';
						break;
					case '102':
						text = '取消锁号';
						break;
					default:
						text = '订单失效';
				}
				return text;
			},
			
			show(time){
				const datePattern = /^\d{4}-\d{2}-\d{2}$/.test(time.startTime);
				if(datePattern){
					this.date = time
					this.getVisitRecord();
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
			let data = uni.getStorageSync('loginData');
			this.siginData = data.defaultArchives ? data.defaultArchives : {};
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
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.no {
							padding: 5rpx 0;
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