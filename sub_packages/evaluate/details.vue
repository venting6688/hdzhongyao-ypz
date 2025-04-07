<template>
	<view class="box">
		<view class="information">
			<ul>
				<li  class="li1" v-for="(item,index) in list" :key="index">
					<view class="title">
						<view class="name">
							<text>{{item.title}}</text>
						</view>
					</view>
					<view class="center">
						<view class="evaluate">
						    <van-rate color="#FF7A00" :data-index="index" :value="item.rateValue" @change="onChange" />
							<text :class="{gray:!evaluateList[item.rateValue-1]}">{{evaluateList[item.rateValue-1]?evaluateList[item.rateValue-1]:'未评价'}}</text>
						</view>
						<view class="cause" v-if="item.rateValue&&item.rateValue<4">
							<view  :class="{colour:i.bOn}" @click="clickItem(index,x)" class="causeList" v-for="(i,x) in item.cause" :key="x">
								{{i.value}}
							</view>
						</view>
					</view>
				</li>
				<li class="li2">
					<view>
						<textarea padding="0" maxlength="-1" class="test" placeholder="您对本次诊疗服务有什么建议或看法，敬请指导！我们将持续改进，感谢您的配合！"></textarea>
					</view>
				</li>
			</ul>
		</view>
		<view class="confirm" @click="confirm">
			提交
		</view>
	</view>
</template>
<script>
	export default {
		data(){
			return {
				list:[
					{
						title:'1、 您对门诊的清洁卫生是否满意？',
						cause:[
							{
							    value:'垃圾桶清理不及时',
						    },
							{
							    value:'地面积水/路滑',
							},
							{
							    value:'卫生间异味',
							},
							{
							    value:'地面污渍',
							},
							{
							    value:'其他'
							},
						]
					},
					{
						title:'2、 医院内的路标和指示是否清晰明确？',
						cause:[
							{
							    value:'指向不清楚',
							},
							{
							    value:'找不到卫生间',
							},
							{
							    value:'其他',
							},
							
						]
					},
					{
						title:'3、 您对所接触到的导医台工作人员服务是否满意？',
						cause:[
							{
							    value:'服务态度不好',
							},
							{
							    value:'沟通交流不顺畅',
							},
							{
							    value:'疑问回答不上来',
							},
							{
							    value:'其他',
							},
							
						]
					},
					{
						title:'4、 您对所接触到的分诊护士服务是否满意？',
						cause:[
							{
							    value:'服务态度不好',
							},
							{
							    value:'沟通交流不顺畅',
							},
							{
							    value:'疑问回答不上来',
							},
							{
							    value:'其他',
							},
						]
					},
					{
						title:'5、 您对接诊医生服务是否满意？',
						cause:[
							{
							    value:'服务态度不好',
							},
							{
							    value:'描述病情不明了',
							},
							{
							    value:'看诊时间短',
							},
							{
							    value:'其他',
							},
							
							
						]
					},
					{
						title:'6、 您对就诊秩序与叫号是否满意？',
						cause:[
							{
							    value:'排队混乱',
							},
							{
							    value:'有插队现象',
							},
							{
							    value:'叫号声音小',
							},
							{
							    value:'无人维护秩序',
							},
							{
							    value:'其他',
							},
						]
					},
					{
						title:'7、 您对本次就诊的总体评价是？',
						cause:[
							{
							    value:'等候时间长',
							},
							{
							    value:'看诊时间短',
							},
							{
							    value:'服务态度不好',
							},
							{
							    value:'检查项目太多',
							},
							{
							    value:'其他',
							},
						]
					},
					
				],
				evaluateList:['非常差','差','一般','好','非常好'],
				choice:[],
			}
		},
		methods: {
			confirm(){
				let value = 0
				let mean = 0
				for (let i = 0; i < this.list.length; i++) {
					
					if(!this.list[i].rateValue){
						uni.showToast({
						    title: '您还有未评价的内容',
						    icon: 'none',   
						    duration: 2000 
						}) 
						return
					}
					value+=this.list[i].rateValue
				}
				mean = value / this.list.length
				let items = JSON.stringify(Math.round(mean))
				uni.setStorageSync('mean', items)
				uni.navigateBack();
			},
			clickItem(index,x){
				const temp = this.list[index].cause[x]
				temp.bOn = !this.list[index].cause[x].bOn
				this.$set(this.list[index].cause, x, temp)
				if (this.choice.indexOf(temp.value) !== -1) {
				    this.choice.splice(this.choice.indexOf(temp.value), 1)
				} else {
				    this.$set(this.choice, this.choice.length, temp.value)
				}
			},
			onChange(event){
				let index = event.currentTarget.dataset.index
				this.$set(this.list[index],'rateValue', event.detail)
			},
			
			
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
			padding-top: 30rpx;
			ul {
				width: 681.3rpx;
				margin: 0 auto;
				> .li1 {
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
						display: flex;
						align-items: center;
						
						.name {
							display: flex;
							align-items: center;
							font-size: 28rpx;
							line-height: 34.35rpx;
							font-family: PingFang SC, PingFang SC-600;
							font-weight: 600;
							color: #000000;
							padding: 30rpx 0;
						}
					}
					.center {
						margin: 0 20rpx;
						padding-bottom: 10rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						
						.evaluate {
							margin: 10rpx 0 0 50rpx;
							font-size: 28rpx;
							line-height: 28rpx;
							display: flex;
							align-items: center;
							text {
								
								&:last-child {
									margin-left: 18rpx;
								}
							}
							.gray {
								color: #999999;
							}
						}
						.cause{
							margin: 30rpx 40rpx 0 40rpx;
							display: flex;
							flex-wrap: wrap;
							
							.causeList{
								height: 46rpx;
								margin: 10rpx;
								padding: 0 26rpx;
								border: 2rpx solid #d9d9d9;
								border-radius: 24rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								color: #999999;
								font-size: 24rpx;
								line-height: 24rpx;
							}
							.colour {
								border: 2rpx solid #ff3a3a;
								color:#FF3A3A ;
							}
						}
						
					}
					
				}
				.li2 {
					width: 681.3rpx;
					// height: 230rpx;
					padding-bottom: 20rpx;
					background: #ffffff;
					border-radius: 15.27rpx;
					margin-top: 30rpx;
					&:first-child{
						margin: 0;
					}
					
					>view {
						display: flex;
						margin: 20rpx;
						padding-top: 10rpx;
						
						.test {
							width: 590rpx;
							height: 200rpx;
						}
						
					}
					
				}
			}
		}
		.confirm {
			width: 534.35rpx;
			height: 87.79rpx;
			background: #4286ff;
			border-radius: 43.89rpx;
			margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
			line-height: 32rpx;
			font-size: 32rpx;
			color: #ffffff;
			margin-bottom: 60rpx;
		}
	}
</style>