<template>
	<view class="details">
		<view class="middle">
			<view class="personal personal-1">
				<view class="title1">
					<view class="name">
						<text>{{footData.patientName}}</text>
						<text>{{footData.sex}}</text>
					</view>
				</view>
				<view class="center">
					<view class="no">
						<text>就诊科室：</text>
						<text>{{information.queueName}}</text>
					</view>
					<view class="no doctor">
						<text>就诊医生：</text>
						<text>{{information.doctorName}}</text>
					</view>
					<view class="no">
						<text>就诊时间：</text>
						<text>{{information.appointmentTime?information.appointmentTime.split(' ')[0]:''}}</text>
					</view>
				</view>
				<view class="tips">
					温馨提示：本次诊疗仅针对目前病情，如有病情变化，请及时复诊。
				</view>
			</view>
			<view class="personal personal-3" v-if="examineList.length">
				<view class="title">
					<view class="name">
						<text>检查信息</text>
					</view>
				</view>
				<view class="center">
					<view class="no" @click="caseHistoryReport(1,item)" v-for="(item,index) in examineList" :key="index">
						<view>
							<text>检查项目：</text>
						    <text>{{item.documentTitle}}</text>
						</view>
						<view>
							<image src="../static/image/Vector@2x.png" mode=""></image>
						</view>
						
					</view>
					
				</view>
			</view>
			<view class="personal personal-3"  v-if="checkoutList.length">
				<view class="title">
					<view class="name">
						<text>检验信息</text>
					</view>
				</view>
				<view class="center">
					<view class="no" @click="caseHistoryReport(2,item)" v-for="(item,index) in checkoutList" :key="index">
						<view>
							<text>检验项目：</text>
						    <text>{{item.documentTitle}}</text>
						</view>
						<view>
							<image src="../static/image/Vector@2x.png" mode=""></image>
						</view>
						
					</view>
					
				</view>
			</view>
			<view class="personal personal-4" v-for="(item,index) in alreadyList" :key="index">
				<view class="title">
					<view class="name">
						<text>就诊费用</text>
					</view>
					<view class="right"  @click="caseHistoryReport(3,item)">
						<text>费用明细</text>
						<image src="../static/image/Vector@2x.png" mode=""></image>
					</view>
				</view>
				<view class="center">
					<view class="no">
						<text>流水号：</text>
						<text>{{item.invoiceNo}}</text>
					</view>
					
				</view>
				<view class="total">
					<text>合计：</text>
					<text>{{item.totalAmt}}元</text>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import elseApi from '@/api/elseApi.js'
	import outpatientExpenditureApi from '@/api/outpatientExpenditureApi.js'
	export default {
		data(){
			return {
				information:{},
				examineList:[],    //检查
				checkoutList:[],    //检验
				alreadyList:[],
			}
		},
		computed: {
			...mapState(['footData']),
		},
		onLoad(e) {
			this.information = JSON.parse(decodeURIComponent(e.item))
			if(this.information.visitNumber){
				this.getDocumentRetrieval('00')
				this.getDocumentRetrieval('99')
				this.getPaymentRecord()
			}
		},
		methods: {
			getDocumentRetrieval(type){
				try {
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						// patientID:'0001954286',
						// patientID:'0001347569',
						// visitNumber:'861560',
						visitNumber:this.information.visitNumber,
						documentType:type,
					}
					elseApi.getDocumentRetrieval(data).then(res => {
						if(res.data.code===200){
							if(type==='00'){
								this.examineList = res.data.data || []
							}else {
								this.checkoutList = res.data.data || []
							}
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			async getPaymentRecord(){
				try {
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						startDate:this.information.startTime,
						endDate:this.information.endTime,
						visitNumber:this.information.visitNumber,
					}
					outpatientExpenditureApi.getPaymentRecord(data).then(res => {
						if(res.data.code===200){
							this.alreadyList = res.data.data||[]
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			caseHistoryReport(num,item){
				let data = {...item,...this.information}
				if(num===1){
					uni.navigateTo({
						url: `/sub_packages/report/examine?report=${encodeURIComponent(JSON.stringify(data))}`
					})
				}else if(num===2){
					uni.navigateTo({
						url: `/sub_packages/report/checkout?report=${encodeURIComponent(JSON.stringify(data))}`
					})
				}else {
					uni.navigateTo({
						url: `/sub_packages/outpatientExpenditure/particulars?detail=${encodeURIComponent(JSON.stringify(item))}`
					})
				}
			}
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
							top: 20rpx;
							display: inline-block;
							width: 16rpx;
							height: 16rpx;
							background: #ff6262;
							border-radius: 50%;
							
						}
						view {
							margin-left: 25rpx;
						}
						&:last-child {
							border: 0;
						}
					}
				}
			}
			.personal-3,.personal-4{
				.center {
					margin: 0 20rpx;
					
					.no {
						padding: 26rpx 0;
						line-height: 28rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						border-bottom: 2rpx solid #dfdfdf;
						&:last-child{
							border: 0;
						}
						view{
							display: flex;
							justify-content: space-between;
							align-items: center;
							text {
								font-size: 28rpx;
								min-height: 28rpx;
								&:nth-child(1){
									color: #888888;
								}
								&:nth-child(2){
									width: 480rpx;
								}
								
							}
							image {
								width: 20rpx;
								height: 28rpx;
								margin-right:20rpx;
							}
						}
						
					}
				}
			}
			.personal-4 {
				.center {
					border-bottom: 2rpx solid #eeeeee;
				}
				.total {
					margin-top: 20rpx;
					text-align: right;
					text {
						&:nth-child(2){
							color: #ec2e50;
							margin-right: 20rpx;
						}
						
					}
				}
			}
		}
		
		
	}
</style>