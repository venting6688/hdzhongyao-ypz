<template>
	<view class="details">
		<view class="middle">
			<personalInformation :report="report" />
			<view class="uni-container">
				<uni-table border stripe emptyText="暂无更多数据" v-for="(i,x) in list" :key="i">
					<uni-tr>
						<uni-th width="220rpx">项目</uni-th>
						<uni-th>结果</uni-th>
						<uni-th>参考值</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in i.examItem" :key="index">
						<uni-td width="220rpx">{{item.itemName}}</uni-td>
						<uni-td>
							<view :class="{ 'text-red': isAbnormal(item) }">
								{{
									item.quaResult && item.itemRefRange && item.itemRefRange.indexOf('-')
										? (
												item.quaResult < item.itemRefRange.split('-')[0]
													? item.quaResult 
													: (
															item.quaResult > item.itemRefRange.split('-')[1]
																? item.quaResult
																: item.quaResult
														)
											)
										: (item.quaResult ? item.quaResult : '')
								}}
							</view>
						</uni-td>
						<uni-td>{{item.itemRefRange}}</uni-td>
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
			if (this.report.examItem && !Array.isArray(this.report.examItem)) {
				this.report.examItem = [this.report.examItem]; // 对象转数组
			}
			this.list.push(this.report);
		},
		methods: {
			isAbnormal(item) {
				if (item.quaResult && item.itemRefRange) {
					const [minNum, maxNum] = item.itemRefRange.split('-');
					return item.quaResult < minNum || item.quaResult > maxNum;
				}
				return false;
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