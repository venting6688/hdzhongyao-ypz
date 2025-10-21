<template>
	<view class="user">
		<view class="content">
			<view 
				class="list" 
				v-for="(item,index) in list" 
				:key="index"
			>
				<uni-swipe-action ref="swipeActionRefs" :key="item.id">
					<uni-swipe-action-item
					  :right-options="swipeOptions"
					  @click="deleteAddress(index)"
					  class="swipe-item"
					>
						<view class="addressItem" @click="confirm(item, type)">
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
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>
		<view class="btn">
			<view class="confirm" @click="confirm({}, 'add')">新增收货地址</view>
		</view>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin'
	import {mapState} from 'vuex'
	import addressApi from '@/api/addressApi.js'
	export default {
		mixins: [mixin],
		data(){
			return {
				options: [{
					text: '删除',
					style: { backgroundColor: '#FE563B' }
				}],
				list:[
					{id: 1, contactName: '张三', contactNumbre: '15895623023', provincesAndMunicipalities: '山东省淄博市周口区', detailedAddress:"幸福里小区3-2-502"},
					{id: 2, contactName: '李茂武', contactNumbre: '185362365202', provincesAndMunicipalities: '湖南省龙口市龙口区', detailedAddress:"康博3-2-502"},
					{id: 3, contactName: '王小二', contactNumbre: '18956323636', provincesAndMunicipalities: '广东省广州市番禺区', detailedAddress:"番禺1号3-2-502"},
					{id: 4, contactName: '刘晓娟', contactNumbre: '15125658956', provincesAndMunicipalities: '海南省海口市海口区', detailedAddress:"幸福里小区3-2-502"},
					{id: 5, contactName: '赵楚生', contactNumbre: '13965230236', provincesAndMunicipalities: '山东省青岛市黄岛区', detailedAddress:"黄岛二中医3-2-502"},
				],
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
					url:`/sub_packages/address/detail?informationObj=${item?encodeURIComponent(JSON.stringify(item)):''}&prescNo=${this.prescNo}&type=${type}`
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
		// onShow() {
		// 	const options = this.$mp.query;
		// 	this.prescNo = options.num; //获取处方号
		// 	this.showBack = true;
		// 	this.title = '地址簿';
		// 	this.type = options.type; //地址使用类型
		// 	this.getAddressList()
		// }
	}
</script>

<style>
</style>
<style lang="less" scoped>
	.user {
		width: 100vw;
		height: 100%; 
		display: flex;
		flex-direction: column;
		.content {
			flex: auto;
			overflow: auto;
			margin-bottom: 50rpx;
			
			.list {
				margin: 15rpx 20rpx;
				color: #888888;
				font-size: 24rpx;
				background: #fff;
				border-radius: 20rpx;
				.addressItem {
					padding: 30rpx;
				}
			}
		}
		.btn {
			background: #fff;
			padding: 20rpx 30rpx 40rpx;
			.confirm {
				background: #9A7546;
				border-radius: 20rpx;
				font-size: 32rpx;
				color: #ffffff;
				padding: 20rpx;
				text-align: center;
			}
		}
	}
</style>