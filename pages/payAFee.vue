<template>
	<view class="box">
		<view class="exothecium">
			<view class="center">
					<view class="personal">
						<view class="name">
							姓名:<text>张*萌</text>
						</view>
						<view class="money">
							余额:<text>1325元</text>
						</view>
						<view class="card">
							卡号:<text>32111111111</text>
						</view>
					</view>
					<view class="head">
						<view class="btn">
							<view class="left" @click="prescription(1)" :class="{back:number==1}">
								药品处方
							</view>
							<view class="right" @click="prescription(2)" :class="{back:number==2}">
								输液处方
							</view>
						</view>
					</view>
					<view class="information">
						<view class="department">
							开放科室:<text>眼科</text>
						</view>
						<view class="doctor">
							开放医生:<text>张海军</text>
						</view>
						<view class="amount">
							药品数量:<text>6盒</text>
						</view>
						<view class="order">
							处方订单:<text>1233333</text>
						</view>
					</view>
					<view class="drug">
							<ul>
								<li v-for="item in 8" :key="item">
									<view class="drugNames">
										泰诺林-儿童 对乙酰氨基酚混悬液滴剂20ml*1瓶/盒
									</view>
									<view class="price">
										￥23.50
										<view class="quantity">
											×2
										</view>
									</view>
									
								</li>
							</ul>
							<view class="total">
								合计:<text>168.44元</text>
							</view>
					</view>
					<view class="pay">
						<button class="pay-btn cu-btn">处方缴费</button>
						<view >
							
						</view>
					</view>
				</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				number:1,
			}
		},
		methods: {
			prescription(number){
				this.number = number
			},
			
		}
	}
</script>

<style lang="less" >
    .box {
	    width: 100vw;
	    height: 100%; 
	    background-color: #f5f5f5;
	    display: flex;
		align-items: center;
	    flex-direction: column;
		.exothecium{
			overflow: auto;
			flex: auto;
			
			.center {
					margin-top: 30rpx;
					width: 686rpx;
					
					background: #ffffff;
					border-radius: 12rpx;
					
					.personal {
						height: 100rpx;
						width: 650rpx;
						margin: 0 18rpx;
						border-bottom: 2rpx solid #EEEEEE;
						display: flex;
						font-size: 33rpx;
						color: #999999;
						
						.name,
						.money,
						.card{
							display: flex;
							justify-content: center;
							align-items: center;
						}
						.name {
							width: 26%;
						}
						.money {
							width: 30%;
						}
						.card {
							width: 44%;
							
						}
						text {
							color: #000;
						}
					}
					
					.head  {
						height: 100rpx;
						width: 650rpx;
						margin: 0 18rpx;
						border-bottom: 2rpx solid #EEEEEE;
						display: flex;
						align-items: center;
						.btn {
							width: 670rpx;
							display: flex;
							justify-content: space-evenly;
							 
							.left,
							.right {
								width: 252rpx;
								height: 70rpx;
								border-radius: 10rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 36rpx;
								line-height: 36rpx;
								color: #000;
							}
							.back{
								background: #1b98ff;
								color: #fff;
							}
						}
					}
					.information {
						// height: 100rpx;
						width: 650rpx;
						margin: 0 18rpx;
						padding: 30rpx 0;
						border-bottom: 2rpx solid #EEEEEE;
						font-size: 36rpx;
						
						.department,
						.doctor,
						.amount,
						.order{
							display: flex;
							justify-content: space-between;
							align-items: center;
							color: #999999;
							margin:10rpx 0;
						}
						
						text {
							color: #000000;
						}
					}
					
					.drug {
						height: 700rpx;
						overflow: hidden;
						display: flex;
						flex-direction: column;
						width: 650rpx;
						margin: 0 18rpx;
						ul {
							width: 100%;
							flex: auto;
							overflow: auto;
							border-bottom: 2rpx solid #EEEEEE;
							
							li {
								margin: 30rpx 0;
								display: flex;
								justify-content: space-between;
								align-items: center;
								font-size: 34rpx;
								.drugNames {
									width: 70%;
									
								}
								.price{
									.quantity{
										color: #999999;
										font-size: 30rpx;
									}
									
								}
								
								
							}
						}
						
						.total {
							text-align: right;
							font-size: 34rpx;
							margin: 20rpx 0 50rpx 0;
							text {
								color: #ec2c4f;
							}
						}
					}
					.pay {
						text-align: center;
						margin-bottom: 50rpx;
						.pay-btn {
							width: 520rpx;
							height: 80rpx;
							background: linear-gradient(343deg,#479cff 0%, rgba(71,216,251,0.80) 100%);
							border-radius: 70rpx;
							font-size: 36rpx;
							color: #ffffff;
							line-height: 34rpx;
							margin-bottom: 50rpx;
						}
					}
				}
			
		}
		
		   }
</style>
