<template>
	<view class="register">
		<view class="application">
			<view class="head">
				住院申请单
			</view>
			<view class="middle">
				<view>
					<text>登记号:</text>
					<text>0103743894738</text>
				</view>
				<view>
					<text>开单医生:</text>
					<text>张海松</text>
				</view>
				<view>
					<text>开单时间:</text>
					<text>2023/11/20 14:35</text>
				</view>
				<view>
					<text>临床诊断:</text>
					<text>支气管炎</text>
				</view>
				<view>
					<text>住院科室:</text>
					<text>呼吸内科</text>
				</view>
				<view>
					<text>住院病区:</text>
					<text>呼吸内科二病区</text>
				</view>
				<view>
					<text>病区地点:</text>
					<text>内科住院楼11层西病区</text>
				</view>
			</view>
		</view>
		<view class="content">
			<ul>
				<li :class="{blue:item.state}" v-for="(item,index) in titleList" :key="index">
					{{item.name}}
				</li>
			</ul>
			<van-progress class="custom-class" :percentage="number" />
			<form v-if="number===25">
				<view class="cu-form-group">
					<view class="title">姓名</view>
					<span>张萌萌</span>
					<!-- <input placeholder="请输入姓名" v-model="informationObj.patientName" name="input" /> -->
				</view>
				<view class="cu-form-group">
					<view class="title">性别</view>
					<span>女</span>
					<!-- <van-radio-group :value="informationObj.sex" @change="onChange">
					  <van-radio name="男">男</van-radio>
					  <van-radio name="女">女</van-radio>
					</van-radio-group> -->
				</view>
				<view class="cu-form-group">
					<view class="title">出生日期</view>
					<span>1999年2月12日</span>
					<!-- <picker mode="date" :value="informationObj.dob" :start="startDate" :end="endDate" fields="day" @change="bindDateChange">
					    <text class="picker birth">{{informationObj.dob}}</text>
					</picker> -->
				</view>
				<view class="cu-form-group">
					<view class="title">手机号</view>
					<input placeholder="请输入手机号" v-model="informationObj.patientPhone" maxlength="11" type="number" name="input" />
				</view>
				<view class="cu-form-group">
					<view class="title">家庭住址</view>
					<picker mode="region" @change="chooseregion" :value="informationObj.region" >
					    <text class="picker ">{{informationObj.region}}</text>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">详细地址</view>
					<input placeholder="请输入详细地址" v-model="informationObj.address" name="input" />
				</view>
			</form>
			<form v-if="number===50">
				<view class="cu-form-group">
					<view class="title">姓名</view>
					<input placeholder="请输入姓名" v-model="informationObj.accompanyName" name="input" />
				</view>
				<view class="cu-form-group">
					<view class="title">关系</view>
					<picker @change="occupationPickerChange" :value="relation" range-key="name" :range="relationList">
						<view class="picker">
							{{informationObj.relation?informationObj.relation:'请选择'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">手机号</view>
					<input placeholder="请输入手机号" v-model="informationObj.accompanyPhone" maxlength="11" type="number" name="input" />
				</view>
			</form>
			<view class="price" v-if="number===75">
				<view class="">
					需缴纳预交金额:2000元
				</view>
			</view>
			<view class="complete" v-if="number===100">
				<view class="patient message">
					<view class="head">
						<text></text>
						<text>住院人信息</text>
					</view>
					<view class="middle">
						<view class="name">
							<text>姓名:</text>
							<text>张哓萌</text>
							<text>性别:</text>
							<text>女</text>
						</view>
						<view>
							<text>出生时间:</text>
							<text>1995年3月24日</text>
						</view>
						<view>
							<text>手机号:</text>
							<text>13654215789</text>
						</view>
						<view>
							<text>家庭住址:</text>
							<text>山东省济南市天桥区K88名泉广场E3座</text>
						</view>
					</view>
				</view>
				<view class="accompany message">
					<view class="head">
						<text></text>
						<text>陪护人信息</text>
					</view>
					<view class="middle">
						<view>
							<text>姓名:</text>
							<text>董志敏</text>
							<text>关系:</text>
							<text>父母</text>
						</view>
						<view>
							<text>手机号:</text>
							<text>13654215789</text>
						</view>
					</view>
				</view>
				<view class="money message">
					<view class="head">
						<text></text>
						<text>预交金金额</text>
					</view>
					<view class="middle">
						<view class="name">
							<text>支付方式:</text>
							<text>银联微信</text>
						</view>
						<view>
							<text>支付金额:</text>
							<text>500元</text>
						</view>
						<view>
							<text>支付时间:</text>
							<text>2024年8月15日  11:23:56</text>
						</view>
						<view>
							<text>支付单号:</text>
							<text>36652242266556952236</text>
						</view>
					</view>
				</view>
			</view>
			<view class="btn">
				<button  v-if="number===50 || number===75" class="cu-btn" @click="lastStep">上一步</button>
				<button v-if="priceState" class="cu-btn" @click="priceBtn">充值</button>
				<button v-else :class="{gray:number===100}" class="cu-btn" @click="nextStep">{{btnName}}</button>
				<button v-if="number===100" class="cu-btn" @click="skip">立即入院</button>
			</view>
		</view>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin.js'
	export default {
		mixins: [mixin],
		data (){
			return {
				titleList:[
					{
					    name:'住院人信息',
						state:true
				    },
					{
					    name:'陪护人信息',
						state:false
					},
					{
					    name:'缴纳预交金',
						state:false
					},
					{
					    name:'完成登记',
						state:false
					},
				],
				priceState:false,
				number:25,
				btnName:'下一步',
				title:'住院人信息',
				informationObj:{
					patientName:'张萌萌',
					sex:'女',
					patientPhone:'15123334567',
					dob:'2025',
					region:['山东省'],
					address:'',
					accompanyPhone:'',
					accompanyName:'',
					relation:'',
				},
				relationList:[
					{
					    name:"本人",
				    },
					{
					    name:"配偶",
					},
					{
					    name:"父母",
					},
					{
					    name:"子女",
					},
					{
					    name:"其他",
					},
				],
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
			skip(){
				uni.navigateBack();
			},
			priceBtn(){
				this.priceState = false
			},
			occupationPickerChange(e) {
				this.informationObj.relation = this.relationList[e.detail.value].name;
				console.log('this',this.informationObj)
			},
			lastStep(){
				this.number-=25
				
				if(this.number===25){
					this.titleList[1].state = false;
				}else if(this.number===50){
					this.priceState = false
					this.titleList[2].state = false;
				}
			},
			nextStep(){
				if(this.number===100){
					this.number=25
					this.btnName = '下一步'
					for (let i = 1; i < this.titleList.length; i++) {
					    this.titleList[i].state = false;
					}
				}else {
					this.number+=25
					if(this.number===75){
						this.priceState = true
					}
					if(this.number===100){
						this.btnName = '返回修改'
					}
				}
				// 每次增加25，算出this.titleList的下标
				const index = this.number / 25 - 1;
				if (index >= 0 && index < this.titleList.length) {
				    this.titleList[index].state = true;
				}
			},
			onChange(evt) {
				this.informationObj.sex = evt.detail
			},
			bindDateChange(e) { //选择日期
			    this.informationObj.dob = e.detail.value
			},
			chooseregion(event){
				this.informationObj.region = event.detail.value.toString()
			},
			
		},
	}
	
</script>

<style lang="less" scoped>
	.register {
		width: 100vw;
		height: 100%;
		display: flex;
		flex-direction: column;
		
		.application {
			width: 726rpx;
			background: #ffffff;
			border-radius: 16rpx;
			margin: 20rpx auto;
			
			.head {
				padding: 15rpx 0;
				margin: 0 20rpx;
				display: flex;
				justify-content: center;
				border-bottom: 2rpx solid #d1d9e3;
				font-weight: 600;
				font-size: 32rpx;
			}
			.middle {
				padding: 20rpx 0;
				margin: 0 20rpx;
				
				view {
					margin: 10rpx 0;
					
					text {
						&:first-child{
							color: #888888;
							display: inline-block;
							width: 130rpx;
						}
					}
				}
			}
		}
		.content {
			width: 726rpx;
			background: #ffffff;
			padding: 0 20rpx;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			overflow: auto;
			flex: auto;
			border-radius: 16rpx 16rpx 0rpx 0rpx;
			>ul {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 10rpx;
				
				>li{
					padding: 20rpx 0;
					color: #888888;
					font-weight: 400;
					width: 25%;
					display: flex;
					justify-content: center;
				}
				.blue {
					color: #1b98ff !important;
				}
			}
			.custom-class{
				/deep/.van-progress__portion {
                    transition: width 0.5s ease;
                }
				/deep/.van-progress {
					height: 12rpx !important;
					background: #f0f7ff !important;
				}
				/deep/.van-progress__pivot{
					color: transparent !important;
					min-width: 20rpx !important;
					max-width: 20rpx !important;
					height: 20rpx !important;
					border-radius: 50% !important;
				}
			}
			form {
				margin:30rpx;
				height: 800rpx;
				overflow: auto;
				
				.cu-form-group {
					min-height: 86rpx;
					display: flex;
					justify-content: left;
					.title {
						width: 180rpx;
					}
					.answer {
						color: #999999;
					}
					/deep/.picker{
						text-align: left;
					}
					/deep/.van-radio-group {
						display: flex;
						justify-content: center;
						.van-radio{
							margin-right:40rpx;
						}
					}
				}
			}
			.price {
				height: 800rpx;
				view {
					margin: 30rpx auto;
					text-align: center;
				}
			}
			.complete{
				margin: 10rpx 0;
				height: 800rpx;
				.message {
					.head {
						margin-top: 10rpx;
						text{
							&:first-child{
								display: inline-block;
								width: 6rpx;
								height: 24rpx;
								background: #0680ff;
								border-radius: 46rpx;
								margin-right: 10rpx;
							}
						}
					}
					.middle {
						padding:10rpx 20rpx;
						border-bottom: 2rpx solid #D1D9E3;
						view {
							margin: 10rpx 0;
							display: flex;
							text {
								display: inline-block;
								
								&:first-child{
									color: #999999;
									width: 140rpx;
								}
								&:nth-child(3){
									color: #999999;
									width: 80rpx;
									margin-left: 100rpx;
								}
								&:last-child{
								}
							}
						}
					}
				}
				.patient {
					.middle {
						view {
							// margin-right: 160rpx;
						}
					}
				}
			}
			.btn {
				display: flex;
				justify-content: space-evenly;
				margin-bottom: 120rpx;
				button {
					width: 240rpx;
					min-height: 76rpx;
					background: linear-gradient(353deg,#479cff 0%, rgba(71,216,251,0.80) 100%);
					border-radius: 70rpx;
					color: #fff;
					font-size: 32rpx;
				}
				.gray {
					background: #96B2D3;
				}
			}
		}
	}
</style>