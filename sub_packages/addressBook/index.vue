<template>
	<view class="user">
		<!-- <CustomNavBar :showBack="showBack" :title="title" /> -->
		<view class="content">
			<view class="list">
				<u-swipe-action class="swipe-container">
				    <u-swipe-action-item
					    class="swipe-item"
				      :options="options"
					    v-for="(item,index) in list" :key="index"
							@click="deleteAddress(item.id)"
				    >
				      <view @click="confirm(item, type)" class="swipe-action u-border-top u-border-bottom">
				        <view class="swipe-action__content">
				          <view class="midddle">
				          	<view class="title">
				          		<text class="name">{{item.contactName}}</text>
				          		<text>{{pixelateNumber(item.contactNumbre)}}</text>
				          	</view>
				          	<view class="address">
				          		{{item.provincesAndMunicipalities ? item.provincesAndMunicipalities+' - ' : ''}}{{item.detailedAddress}}
				          	</view>
				          </view>
				        </view>
				      </view>
				    </u-swipe-action-item>
				</u-swipe-action>
			</view>
		</view>
		<button class="cu-btn confirm" @click="confirm({}, 'add')">新增地址</button>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin'
	// import CustomNavBar from '@/components/CustomNavBar.vue';
	import {mapState} from 'vuex'
	import addressApi from '@/api/addressApi.js'
	export default {
		mixins: [mixin],
		// components:{
		// 	CustomNavBar,
		// },
		data(){
			return {
				options: [{
					text: '删除',
					style: { backgroundColor: '#FE563B' }
				}],
				list:[],
				prescNo: '',
				type: 'edit',
			}
		},
		computed: {
			...mapState(['footData']),
		},
		methods: {
			// 回退页面传递数据
			getValue(list){
				this.list.push(list)
			},
			confirm(item, type){
				uni.navigateTo({
					url:`/sub_packages/logistics/index?informationObj=${item?encodeURIComponent(JSON.stringify(item)):''}&prescNo=${this.prescNo}&type=${type}`
				})
			},
			//get list
			getAddressList(){
				try {
					let loginValue = uni.getStorageSync("loginData");
					loginValue = JSON.parse(loginValue);
					addressApi.getAddressList(loginValue.phoneNum).then(res => {
						if(res.data.code===200){
							this.list = res.data.rows;
						}else {
							this.list = []
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			//delete
			deleteAddress(id) {
				uni.showModal({
					title: "提示",
					content: "确定删除该地址吗？",
					success: (res) => {
						if (res.confirm) {
							try {
								addressApi.deleteAddress(id).then(res => {
									if(res.data.code === 200){
										uni.showToast({
											title: "删除成功",
											icon: "none",
										});
										this.getAddressList()
										 // uni.reLaunch({url: "/sub_packages/addressBook/index"});
									}else {
										this.list = []
									}
								})
							} catch (error) {
								console.log(error)
								//TODO handle the exception
							}
							
						}
					},
				});
			},
		},
		onShow() {
			const options = this.$mp.query;
			this.prescNo = options.num; //获取处方号
			this.showBack = true;
			this.title = '地址簿';
			this.type = options.type; //地址使用类型
			this.getAddressList()
		}
	}
</script>

<style>
</style>
<style lang="less" scoped>
	/deep/.u-swipe-action-item__right__button{
		border-radius:0 16rpx 16rpx 0;
	}
	/deep/.u-swipe-action-item{
		margin: 25rpx 0 !important;
	}
	.user {
		width: 100vw;
		height: 100%; 
		display: flex;
		flex-direction: column;
		
		.content {
			flex: auto;
			overflow: auto;
			margin-bottom: 50rpx;
			
			.swipe-action {
				border-top:0;
				border-bottom:0;
				border-radius:16rpx;
			    &__content {
					 .title {
					 	display: flex;
					 	align-items: center;
					 	// margin-bottom: 20rpx;
						padding:20rpx 25rpx 10rpx 25rpx;
					 	.name {
					 		font-size: 28rpx;
					 		line-height: 28rpx;
					 		color: #000000;
					 		margin-right: 20rpx;
					 	}
					 }
					 .address {
						 padding:20rpx  25rpx;
					 }
			
			        
			    }
			}
			.list {
				width: 714rpx;
				margin: 10rpx auto;
				color: #888888;
				font-size: 24rpx;
				
			}
			
		}
		.confirm {
			width: 620rpx;
			min-height: 92rpx;
			background: #4286ff;
			border-radius: 46rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			color: #ffffff;
			margin:0 auto 160rpx auto;
		}
	}
</style>