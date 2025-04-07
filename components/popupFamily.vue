<template>
	<view class="center" >
			  <view class="title">
			  	切换家庭成员
			  </view>                                                                                                                                                                   
			<view class="scroll" >
			 <view class="middle">
				<view class="li" v-for="(item,index) in personageObj.list" :key="index" @click="updateDefaultArchives(item)" :class="{blue:personageObj.sole.patientName==item.patientName}">
					
					<view class="name">
						<text>{{item.patientName}}</text>
					</view>
					<!-- <view class="price">
						状态:<text>{{item.state}}</text>
					</view> -->
					<view class="img" >
						<image v-if="personageObj.sole.patientName==item.patientName" src="@/static/image/right.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			</view>
			<view class="btn">
				<!-- <button class="cu-btn" @click="recharge(1)">门诊充值</button> -->
				<button class="cu-btn" @click="recharge(2)">添加家庭成员</button>
			</view>
	</view>
</template>

<script>
	import HeaderbarApi from '@/api/HeaderbarApi.js'
	import mixin from '../mixins/mixin'
	import {mapMutations ,mapState} from 'vuex'
	export default {
		mixins: [mixin],
		props: {
		    personageObj: Object,
		},
		data(){
			return {
				registerData:{
					archivesList:[]
				},
				personage:{patientName:''},
				
			}
		},
		computed: {
			...mapState(['footData']),
		},
		watch: {
			// 切换就诊人后重新渲染页面
		    footData(newVal, oldVal) {
			  if(oldVal && oldVal.patientUniquelyIdentifies && (newVal.patientUniquelyIdentifies!==oldVal.patientUniquelyIdentifies)){
				this.setShowState(false)
				this.$nextTick(() => {
				    this.setShowState(true)
				});
			  }
		    }
		},
		mounted() {
			let loginValue = uni.getStorageSync("loginData");
			if(loginValue){
				this.registerData = JSON.parse(loginValue)
				this.refreshUserInfo(this.registerData.phoneNum)
			}
		},
		methods: {
			...mapMutations({
				setFootData:'SET_FOOT_DATA',
				setShowState:'SET_SHOW_STATE',
			}),
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
					console.log('45',e);
				}
			},
			recharge(num){
				this.$emit('handle','')
				if(num===1){
					uni.navigateTo({
						url: `/sub_packages/outpatientTopUp/index`
					})
				}else {
					uni.navigateTo({
						url: `/sub_packages/family/familyInformation`
					})
				}
				
			},
		}
	}
	
</script>

<style lang="less" scoped>
	.blue {
		color: #0386FF !important;
	}
	.center {
		width: 750rpx;
		background-color: #ffffff;
		border-radius: 30rpx 30rpx 0 0;
		// height: 570rpx;
		overflow: hidden;
		.title {
			display: flex;
			align-items: center;
			height: 50rpx;
			margin: 20rpx;
			font-size: 38rpx;
		}
	    .scroll {
	    	height: 55%;
	    	.middle {
	    		    margin: 0 20rpx 0 20rpx;
	    			padding-top: 20rpx;
	    			.li {
	    				width: 96%;
	    				min-height: 80rpx;
	    				display: flex;
	    				justify-content: space-between;
	    				align-items: center;
	    				margin: 20rpx 5rpx;
	    				color: #92a1bb;
	    				padding:0 20rpx 0 40rpx;
	    				background: #f9fbfe;
	    				border-radius: 20rpx;
	    				
	    				&:first-child{
	    					margin-top: 10rpx;
	    				}
	    				.name {
	    					width: 20%;
	    					font-size: 32rpx;
	    					line-height: 32rpx;
	    				}
	    				.no {
	    					width: 36%;
	    					margin-left: 3%;
	    					font-size: 32rpx;
	    					line-height: 32rpx;
	    				}
	    				.price{
	    					width: 29%;
	    					font-size: 32rpx;
	    					line-height: 32rpx;
	    				}
	    				.img {
	    					width: 11%;
	    					height: 48rpx;
	    					line-height: 48rpx;
	    					text-align: center;
	    					// margin-left:80rpx;
	    					image {
	    						width: 46rpx;
	    						height: 48rpx;
	    					}
	    				}
	    			}
	    			
	    			.colour {
	    				border: 2rpx dashed #797979;
	    				// background: #479cff !important;
	    				// color: #ffffff;
	    			}
	    		}
	    }
		.btn{
			margin-bottom: 20rpx;
			height: 130rpx;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			
			button {
				transform: translate(0,-10rpx);
				font-size: 38rpx;
				width: 300rpx;
				height: 80rpx;
				background: linear-gradient(351deg,#479cff 0%, rgba(71,216,251,0.80) 100%);
				border-radius: 70rpx;
				color: #ffffff;
			}
		}
			
	}
</style>