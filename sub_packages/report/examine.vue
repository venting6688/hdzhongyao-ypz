<template>
	<view class="details">
		<view class="middle">
			<personalInformation :report="report"/>
			<view class="personal-2">
				<view class="center">
					<view class="word">
						<view>
							影像学表现:
						</view>
						
						<view>
							{{conclusion.E08.content?conclusion.E08.content:''}}
						</view>
					</view>
					<view class="word">
						<view>
							影像学诊断:
						</view>
						<view>
							{{conclusion.E09.content?conclusion.E09.content:''}}
						</view>
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import personalInformation from './components/personalInformation.vue';
	import elseApi from '@/api/elseApi.js'
	import { mapState } from 'vuex'
	export default {
		components:{
			personalInformation
		},
		data(){
			return {
				report:{},
				conclusion:{},
			}
		},
		computed: {
			...mapState(['footData']),
		},
		onLoad(e) {
			this.report = JSON.parse(decodeURIComponent(e.report))
			if(this.report.documentID){
			this.documentReview(this.report)
			}
		},
		methods: {
			documentReview(item){
				try {
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						// patientID:'0001915678',
						// patientID:'0001347569',
						// visitNumber:'849424',
						visitNumber:this.report.visitNumber,
						documentType:item.documentType,
						documentID:item.documentID
					}
					elseApi.documentReview(data).then(res => {
						if(res.data.code===200){
							this.conclusion = res.data.data.body.documentSearchRp.documents.document[0].documentContentJson.clinicalDocument.structuredBody.section[1] || []
							const { E15, E13,E08 } = this.conclusion;
							const newData = {
							  reportDoctor: E15?.content,
							  auditDoctor: E13?.content,
							  manifestation: E08?.content,
							  title:'检查'
							};
							this.report = {...this.report,...newData}
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
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
			.personal-2{
					background: #ffffff;
					width: 722rpx;
					margin: 16rpx auto 0 auto;
					border-radius: 12rpx;
				.center {
					margin: 0 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;				
					.word {
						border-bottom: 2rpx solid #eeeeee;
						padding: 16rpx 0;
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
								margin-top: 10rpx;
								color: #888888;
								font-size: 24rpx;
								line-height: 35rpx;
								letter-spacing: 2rpx;
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