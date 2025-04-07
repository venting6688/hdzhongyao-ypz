<template>
	<view class="box">
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
	</view>
</template>

<script>
	export default {
		
		data(){
			return {
				year: '无',
				indexValue:'',
				date:{},
				index:0,
				dateState:0,
				startIndex:null,
				endIndex:null,
				monthArr:['无','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
			}
		},

		methods: {
			bindDateChange(e) {
			      this.year = e.detail.value;
				 
				  this.dateState = 0
				  this.dateFun()
			},
			bindPickerdateChange(e) {
			    this.index = e.detail.value;
				if(this.index.length===1){
					this.indexValue = `0${this.index}`
				}				
				this.dateState = 0
				this.dateFun()
			},
			timeClick(num){
				this.dateState = num
				this.year = '无'
				this.index = 0
				this.dateFun()
			},
			dateFun(){
				if(!this.dateState){
					this.date.startTime = `${this.year}-${this.indexValue}-01`
				    this.date.endTime = `${this.year}-${this.indexValue}-31`
				}else{
					if(this.dateState === 1 ){
						this.date = this.getLastMonth(6)
					}else {
						this.date = this.getLastMonth(3)
					}
				}
				this.$emit('handle',this.date)
			},
			padDate(value) {
			    return value < 10 ? '0' + value : value
			},
			// 获取近i月的时间段
			getLastMonth(i) {
			  const now = new Date()
			  const year = now.getFullYear()
			  let month = now.getMonth() + 1
			  month = 2
			  const day = now.getDate()
			  let dateRange = {}
			  dateRange.endTime = `${year}-${this.padDate(month)}-${this.padDate(day)}`;
			  let nowMonthDay = new Date(year, month, 0).getDate() //当前月的总天数
			  if (i == 12) {
			    //如果是12月，年数往前推一年
			    dateRange.startTime = `${year - 1}-${this.padDate(month)}-${this.padDate(day)}`;
			  } else{
			        let startYear = year;
			        let startMonth = month - i;
			        while (startMonth <= 0) {
			            startYear--;
			            startMonth += 12;
			        }
			        const startDate = new Date(startYear, startMonth - 1, 1); // 注意这里月份要减1，因为构造Date对象时月份是0-11范围
			        const endDate = new Date(year, month - 1, 1);
			
			        const startMonthDays = new Date(startYear, startMonth, 0).getDate();
			        const endMonthDays = new Date(year, month, 0).getDate();
			
			        // 计算起始时间的日期部分，考虑边界情况
			        let startDay = Math.min(day, startMonthDays);
			        if (startMonthDays < endMonthDays && day === endMonthDays) {
			            startDay = startMonthDays;
			        }
			
			        dateRange.startTime = `${startYear}-${this.padDate(startMonth)}-${this.padDate(startDay)}`;
			    }
			  return dateRange
			},
			

			
		},
		mounted() {
			this.endIndex= new Date().getFullYear();
			this.startIndex = this.endIndex - 5;
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
	}
</style>