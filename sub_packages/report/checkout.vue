<template>
	<view class="details">
		<view class="middle">
			<personalInformation :report="report" />
			<view class="uni-container">
				<uni-table border stripe emptyText="暂无更多数据" v-for="(i,x) in list" :key="i">
					<uni-tr>
						<uni-th>项目</uni-th>
						<uni-th>结果</uni-th>
						<uni-th>参考值</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in i.section" :key="index">
						<uni-td>{{item.E02.content ? item.E02.content : ''}}</uni-td>
						<uni-td>
							<view :class="{ 'text-red': isAbnormal(item) }">
								{{
									item.E03.content && item.E06.content && item.E06.content.indexOf('--')
										? (
												item.E03.content < item.E06.content.split('--')[0]
													? item.E03.content + '（低）'
													: (
															item.E03.content > item.E06.content.split('--')[1]
																? item.E03.content + '（高）'
																: item.E03.content
														)
											)
										: (item.E03.content ? item.E03.content : (item.E07.content?flagType(item.E07.content):''))
								}}
							</view>
						</uni-td>
						<uni-td>{{item.E06.content ? item.E06.content : ''}}</uni-td>
					</uni-tr>
				</uni-table>
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
				title:'',
				report:{},
				list:[],
				flagList:[],
			}
		},
		computed: {
			...mapState(['footData']),
		},
		onLoad(e) {
			this.report = JSON.parse(decodeURIComponent(e.report))
			if(this.report.documentID){
			this.documentReview(this.report)
			this.flag()
			}
			
		},
		methods: {
			isAbnormal(item) {
				if (item.E03.content && item.E06.content) {
					const [minNum, maxNum] = item.E06.content.split('--');
					return item.E03.content < minNum || item.E03.content > maxNum;
				}
				return false;
			},
			documentReview(item){
				try {
					let data = {
						patientID: this.footData.patientUniquelyIdentifies,
						// patientID:'0001954286',
						// patientID:'0001347569',
						// visitNumber:'861560',
						visitNumber:this.report.visitNumber,
						documentType:item.documentType,
						documentID:item.documentID
					}
					elseApi.documentReview(data).then(res => {
						if(res.data.code===200){
							let data = res.data.data.body.documentSearchRp.documents.document[0].documentContentJson.clinicalDocument.structuredBody.section || []
							this.list = data.slice(1)
							.map(item => {
							    return {
							        ...item,
							        section: item.section.filter(i => {
							            return i.desc === '检验子项结果';
							        })
							    };
							});
							if(data[1]){
								const { E14, E20 } = data[1];
								const str = this.list[0] && this.list[0].section
								.map(item =>{
									if(item.E07.content!=='M'){
										return `${item.E02.content}参考值${item.E06.content}结果${item.E03.content}`
									}
								}).filter(Boolean).join()
								const newData = {
								  reportDoctor: E14?.content,
								  auditDoctor: E20?.content,
								  manifestation:str,
									department: '',
								  title:'检验'
								};
								this.report = {...this.report,...newData}
							}
							// this.list = data.filter(item => {
							// 	return item.desc==='检验子项结果'
							// })
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			flag(){
				elseApi.flag().then(res => {
					if(res.data.code===200){
						this.flagList = res.data.data || []
						console.log(res.data,111)
					}
				})
			},
			flagType(flag){
				const item = this.flagList.find(item => item.dictValue === flag);
				return item ? item.dictLabel : null;
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
			.uni-container {
				width: 96%;
				margin: 0 auto;
				uni-table {
				  width: 100%;
				  table-layout: auto; 
				}
				.text-red {
				  color: red;
				}
			}
			.personal-2{
				background: #ffffff;
				width: 722rpx;
				margin: 16rpx auto 0 auto;
				border-radius: 12rpx;
				
				.center {
					margin: 0 20rpx;
					display: flex;
					flex-direction: column;
					
					.title {
						display: flex;
						// justify-content: center;
						align-items: center;
						width: 680rpx;
						height: 46rpx;
						background: #f0f0f0;
						margin: 26rpx auto 0 auto;
						>view {
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 24rpx;
							line-height: 24rpx;
							&:nth-child(1){
								width: 5%;
							}
							&:nth-child(2){
								width: 18%;
							}
							&:nth-child(3){
								width: 26%;
							}
							&:nth-child(4){
								width: 16%;
							}
							&:nth-child(5){
								width: 15%;
							}
							&:nth-child(6){
								width: 20%;
							}
						}
					}
					>ul {
						margin-bottom: 26rpx;
						
						>li {
							display: flex;
							width: 680rpx;
							border-bottom: 2rpx solid #dcdfe5;
							>view {
								flex: 1;
							    display: flex;
							    justify-content: center;
							    align-items: center;
							    font-size: 24rpx;
								min-height: 46rpx;
								border-right: 2rpx solid #dcdfe5;
							    &:nth-child(1){
							    	max-width: 5%;
							    }
							    &:nth-child(2){
							    	max-width: 18%;
							    }
							    &:nth-child(3){
							    	max-width: 26%;
							    }
							    &:nth-child(4){
							    	max-width: 16%;
							    }
								&:nth-child(5){
									max-width: 15%;
								}
							    &:nth-child(6){
							    	max-width: 20%;
									border: 0;
							    }
						    }
						}
					}
					
				}
			}
			
		}
		
		
	}
</style>