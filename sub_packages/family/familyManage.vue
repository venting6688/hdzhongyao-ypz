<template>
	<view class="manage">
		<view class="information">
			<ul>
				<li v-for="(item,index) in patientList.slice(0,5)" :key="item.patientCard">
					<view class="title">
						<view class="name" @click="amend(index)">
							<text class="big">{{pixelate(item.patientName)}}</text>
							<text class="small">{{item.sex}}</text>
							<text class="relation">{{item.relation}}</text>
						    <image src="../static/image/icon-edit.png" mode=""></image>
						</view>
						<view class="ok" @click="updateDefaultArchives(item)">
							<image v-if="footData.patientName==item.patientName" src="../static/image/icon-ok.png" mode=""></image>
							<image v-else src="../static/image/grayOk.png" mode=""></image>
							<text>默认就诊人</text>
						</view>
					</view>
					<view class="center">
						<view class="content">
							<text>证件号：</text>
							<text>{{pixelateNumber(item.patientCard.toString())}}</text>
						</view>
						
						<view class="content" v-if="item.unfold">
							<text>余额：</text>
							<text class="money">￥{{item.accBalance}}</text>
						</view>
						<view class="img" v-if="item.unfold">
							<health-card-users
							  hospitalId="100001"
							  :finish="onFinish"
							/>
							<!-- <health-card-create-card
							   hospitalId="30369"
							   :finish="onFinish"
							 /> -->
							<!-- <image src="../static/image/healthCard.png" mode=""></image> -->
						</view>
					</view>
					<view class="bottomBtn" @click="unfoldFun(index)">
						<text>{{!item.unfold?'展开详情':'收起详情'}}</text>
						<image v-if="!item.unfold" src="../static/image/bottom.png" mode=""></image>
						<image v-else src="../static/image/top.png" mode=""></image>
					</view>
				</li>
			</ul>
		</view>
		<view class="btn" @click="increase">
			<image src="../static/image/icon-add.png" mode=""></image>
			<text>添加家庭成员（剩{{5-this.patientList.length}}人）</text>
		</view>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin.js'
	import {mapMutations , mapState} from 'vuex'
	import HeaderbarApi from '@/api/HeaderbarApi.js'
	export default {
		mixins: [mixin],
		data(){
			return {
				patientList:[],
			}
		},
		onShow() {
			let loginValue = uni.getStorageSync("loginData");
			if(loginValue){
				let registerData = JSON.parse(loginValue)
				this.patientList = registerData && registerData.archivesList
				this.patientList.forEach((item, i) => {
				    item.defaul = false;
				    this.$set(this.patientList, i, item);
				});
				const temp = this.patientList[0];
				temp.default = true;
				this.$set(this.patientList, 0, temp);
			}
		},
		computed: {
			...mapState(['footData']),
		},
		methods: {
			...mapMutations({
				setFootData:'SET_FOOT_DATA',
			}),
			amend(index){
				uni.navigateTo({
					url: `/sub_packages/family/familyAmend?informationObj=${encodeURIComponent(JSON.stringify(this.patientList[index]))}`
				})
			},
			onFinish(e) {
			    console.log('🐞 onFinish', e);
			},
			// 刷新用户信息
			async refreshUserInfo(phoneNum){
				try{
				    const res = await HeaderbarApi
					.refreshUserInfo(phoneNum)
					.then((result) => {
						if(result.data.code === 200){
							let data = result.data.data
							this.setFootData(data.defaultArchives)
							let items = JSON.stringify(data)
							uni.setStorageSync('loginData', items)
						}
					})
				}catch(e){
					console.log(e);
				}
			},
			// 切换家庭成员
			async updateDefaultArchives(item){
				let loginValue = uni.getStorageSync("loginData");
				let value = JSON.parse(loginValue)
				if(item.patientCard===value.defaultArchives.patientCard){
					return
				}
				try{
					let data = {
						phone:item.phoneNum,
						patientCard:item.patientCard,
					}
				const res = await HeaderbarApi
					.updateDefaultArchives(data)
					.then((result) => {
						this.$emit('handle',item)
						this.refreshUserInfo(value.phoneNum)
					})
				}catch(e){
					console.log(e);
				}
			},
			unfoldFun(index){
				console.log(';;d;d;d')
				const temp = this.patientList[index]
				temp.unfold = !this.patientList[index].unfold
				this.$set(this.patientList, index, temp)
			},
			increase() {
				uni.navigateTo({
					url: `/sub_packages/family/familyInformation`
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.manage {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		
		.information {
			width: 100%;
			overflow: auto;
			ul {
				width: 681.3rpx;
				margin: 0 auto;
				> li {
					width: 681.3rpx;
					background: #ffffff;
					border-radius: 15.27rpx;
					margin-top: 30rpx;
					padding-bottom: 15rpx;
					
					.title {
						margin: 0 20rpx;
						height: 88rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-bottom: 2rpx solid #F5F5F5;
						
						image {
							width: 30rpx;
							height: 30rpx;
							margin: 0 10rpx 0 20rpx;
						}
						
						.name {
							display: flex;
							align-items: center;
							font-size: 34.35rpx;
							line-height: 34.35rpx;
							font-family: PingFang SC, PingFang SC-600;
							font-weight: 600;
							color: #000000;
							padding: 10rpx 0;
							
							.big {
								margin-right: 15rpx;
							}
							.small {
								line-height: 26.72rpx;
								font-size: 26.72rpx;
								color: #666666;
								font-weight: 400;
								margin-right: 15rpx;
							}
							.relation{
								padding: 5rpx 10rpx;
								background: #4286ff;
								border-radius: 7.63rpx;
								color: #ffffff;
								font-weight: 400;
								font-size: 22.9rpx;
								line-height: 22.9rpx;
							}
						}
						.ok {
							display: flex;
							align-items: center;
							font-size: 26.72rpx;
							line-height: 26.72rpx;
							font-family: PingFang SC, PingFang SC-400;
							font-weight: 400;
							color: #666666;
							padding: 10rpx 0;
						}
					}
					.center {
						margin: 0 20rpx 25rpx 20rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-evenly;
						.content {
							margin-top: 20rpx;
							text {
								&:nth-child(1){
									display: inline-block;
									width: 145rpx;
									color: #999999;
								}
								&:nth-child(2){
									color: #333333;
									margin-right: 20rpx;
								}
								&:nth-child(3){
									padding: 6rpx 14rpx;
									background: rgba(66,134,255,0.08);
									border-radius: 26.72rpx;
									color: #4286ff;
									font-size: 22.9rpx;
									line-height: 22.9rpx;
								}
							}
							.money {
								color: #ff4848 !important;
							}
						}
						.img {
							margin: 20rpx auto 0 auto;
							image {
								width: 624rpx;
								height: 351.15rpx;
								border-radius: 11.45rpx;
							}
						}
					}
					.bottomBtn {
						display: flex;
						align-items: center;
						justify-content: center;
						color: #999999;
						font-size: 26.72rpx;
						
						image {
							width: 30rpx;
							height: 30rpx;
							margin-left: 8rpx;
						}
					}
				}
			}
		}
		
		.btn {
			width: 681.3rpx;
			height: 87.79rpx;
			background: #4286ff;
			border-radius: 43.89rpx;
			margin: 60rpx auto;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #ffffff;
			
			image {
				width: 41.98rpx;
				height: 41.98rpx;
				margin-right: 15rpx;
			}
			text {
				font-size: 30.53rpx;
				line-height: 30.53rpx;
			}
		}
	}
</style>