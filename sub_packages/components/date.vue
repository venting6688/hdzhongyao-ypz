<template>
	<view class="box">
		<view class="header">
			<view class="date">
				<picker 
					:class="{'datePicker': true, 'blue': dateState === 0}"
					mode="date" 
					:value="selectDate" 
					:start="startDate" 
					:end="endDate" 
					fields="month"
					@change="dateChange"
				>
				    <text class="picker birth">{{selectDate}}</text>
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
	</view>
</template>

<script>
	import moment from 'moment';
	
	export default {
		
		data(){
			return {
				date:{},
				index:0,
				dateState:0,
				selectDate: moment().format('YYYY-MM'),
			}
		},
		computed:{
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			timeClick(num){
				this.dateState = num
				let monthNum = this.dateState === 1 ? 6 : 3;
				this.date = {
					startTime: moment().subtract(monthNum, 'months').format('YYYY-MM-DD'),
					endTime: moment().format('YYYY-MM-DD'),
				}
				this.$emit('handle',this.date)
			},
			dateChange: function(e) {
				this.dateState = 0
				this.selectDate = e.detail.value;
				let year = this.selectDate.split('-')[0];
				let month = this.selectDate.split('-')[1];
				let startDate = moment({year: year, month: month - 1, day: 1}).startOf('month');
				let endDate = moment(startDate).endOf('month');
				this.date = {
					startTime: moment(startDate).format('YYYY-MM-DD'),
					endTime: moment(endDate).format('YYYY-MM-DD'),
				}
				this.$emit('handle',this.date)
			},
			getDate(type) { //年月日
			    const date = new Date();
			    let year = date.getFullYear();
			    let month = date.getMonth() + 1;
			    let day = date.getDate();
			    			
			    if (type === 'start') {
			        year = year - 100;
			    } else if (type === 'end') {
			        year = year;
			    }
			    month = month > 9 ? month : '0' + month;
			    day = day > 9 ? day : '0' + day;
			    return `${year}-${month}-${day}`;
			},
		},
		mounted() {
			this.timeClick(2)
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
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24rpx 30rpx;
			.blue {
				background: #4286ff !important;
				color: #ffffff !important;
			}
			.date {
				.datePicker {
					height: 56rpx;
					font-size: 28rpx;
					line-height: 56rpx;
					border: 2rpx solid #4286ff;
					border-radius: 15rpx;
					padding: 0 50rpx;
					color: #076aff;
					margin-left: 20rpx;
				}
				.birth{
					height: 86rpx;
					display: inline-block;
					text-align: left;
				}
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
					border-radius: 15rpx;
					padding: 0 20rpx;
					color: #076aff;
					margin-left: 20rpx;
				}
				
			}
		}
	}
</style>