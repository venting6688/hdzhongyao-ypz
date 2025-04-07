<template>
	<view class="box">
		<bar />
		<date @handle="show" />
		<view class="head">
			<view>
				
				<view class="name" @click="headBtn(1)">
					<view :class="{black:headIndex===1}">
						检查报告
						<view class="wire" :class="{blue:headIndex===1}"></view>
					</view>
				</view>
				<view class="name" @click="headBtn(2)">
					<view :class="{black:headIndex===2}">
						检验报告
					<view class="wire" :class="{blue:headIndex===2}"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="information">
			<ul v-if="List.length">
				<li @click="information(item)" v-for="(item,index) in List" :key="index">
					<view class="content">
						<view class="title">
							<view class="name">
								<!-- <text>{{item.departmentName}}</text>
							    <image src="../static/image/icon-edit.png" mode=""></image> -->
							</view>
							<view class="delete">
								<text>查看报告</text>
								<image src="../static/image/Vector@2x.png" mode=""></image>
							</view>
						</view>
						<view class="center">
							<view class="no">
								<text>文档ID：</text>
								<text>{{item.documentID}}</text>
							</view>
							<view class="no">
								<text>申请科室：</text>
								<text>{{item.queueName}}</text>
							</view>
							<view class="no">
								<text>{{headIndex===1?'检查':'检验'}}项目：</text>
								<text>{{item.documentTitle}}</text>
							</view>
							<view class="no">
								<text>{{headIndex===1?'检查':'检验'}}时间：</text>
								<text>{{item.updateDate}} {{item.updateTime}}</text>
							</view>
						</view>
					</view>
				</li>
			</ul>
			<view class="without" v-else>
				<image src="https://aiwz.sdtyfy.com:8099/img/wu.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import bar from '../components/bar.vue'
	import date from '../components/date.vue'
	import elseApi from '@/api/elseApi.js'
	import { mapState } from 'vuex'
	export default {
		components:{
			bar,
			date,
		},
		data(){
			return {
				headIndex:1,
				date:{},
				List:[],
			}
		},
		computed: {
			...mapState(['footData']),
		},
		
		methods: {
			show(time){
				const datePattern = /^\d{4}-\d{2}-\d{2}$/.test(time.startTime);
				if(datePattern){
					this.date = time
					if(this.headIndex === 1){
						this.getVisitRecord('00')
					}else{
						this.getVisitRecord('99')
					}
				}
			},
			headBtn(num){
				this.headIndex = num
				if(num===1){
					this.getVisitRecord('00')
				}else if(num===2){
					this.getVisitRecord('99')
					
				}
				
			},
			getVisitRecord(type){
				try {
					console.log(this.footData.patientUniquelyIdentifies)
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						startDate:this.date.startTime,
						endDate:this.date.endTime,
					}
					elseApi.getVisitRecord(data).then(res => {
						if(res.data.code===200){
							let arr = res.data.data.orders.order || []
							for (let item of arr) {
							  this.getDocumentRetrieval(type,item)
							}
							
						}else {
							this.List = []
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			getDocumentRetrieval(type,i){
				try {
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						// patientID:'0001954286',
						// patientID:'0001347569',
						// visitNumber:'861560',
						visitNumber:i.visitNumber,
						documentType:type,
					}
					elseApi.getDocumentRetrieval(data).then(res => {
						if(res.data.code===200){
							this.List = res.data.data
							.map(item => ({ ...item, ...i }));
						}else {
							this.List = []
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			information(item){
				if(this.headIndex===1){
					//检查
					uni.navigateTo({
						url: `/sub_packages/report/examine?report=${encodeURIComponent(JSON.stringify(item))}`
					})
				}else {
					//检验
					uni.navigateTo({
						url: `/sub_packages/report/checkout?report=${encodeURIComponent(JSON.stringify(item))}`
					})
				}
			}
		},
	}
</script>

<style lang="less" scoped>
	.box {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		
		.head {
			width: 681.3rpx;
			margin: 0 auto;
			background: #ffffff;
			// height: 120rpx;
			
			border-radius: 12rpx 12rpx 0 0;
			>view{
				padding-top: 20rpx;
				margin: 0 20rpx;
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #eeeeee;
				
				
				.name {
					display: flex;
					align-items: center;
					margin-right:40rpx;
					font-family: PingFang SC, PingFang SC-600;
					color: #000000;
					padding: 10rpx 0;
					font-size: 32rpx;
					line-height: 32rpx;
					color: #8a8a8a;
										
				}
				
				.wire {
					width: 92rpx;
					height: 8rpx;
					margin: 18rpx auto 0 auto;
					border-radius: 8rpx;
				}
				.blue {
					background: #4286ff;
				}
				.black {
					color: #000000;
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
					background: #ffffff;
					&:last-child{
						.content{
							border: 0 !important;
						}
					}
					
					>.content{
						padding-bottom: 20rpx;
						margin: 0 20rpx;
						border-bottom: 2rpx solid #eeeeee;
						
						.title {
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
							height: 140rpx;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							.no {
								font-size: 24rpx;
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
</style>