<template>
	<view class="user">
		<view class="content">
			<view 
				class="list" 
				v-for="(item,index) in list" 
				:key="index"
			>
				<view class="addressItem">
					<view class="midddle">
						<view class="title">
							<text class="name">{{item.userName}}</text>
							<text>{{pixelateNumber(item.telNumber)}}</text>
						</view>
						<view class="address">
							{{item.fullRegion ? item.fullRegion+' - ' : ''}}{{item.detailInfo}}
						</view>
						<view class="operating">
							<!-- 左侧：设置默认地址 -->
							<view class="left">
								<uni-data-checkbox
									:localdata="[ { text: '', value: item.id } ]"
									v-model="checkboxSelectedMap[item.id]"
									selectedColor="#9A7546"
									@change="onCheckboxChange(item)"
								/>
								<text class="default-text">{{ item.isDefault ? '已默认' : '设为默认地址' }}</text>
							</view>
						
							<!-- 右侧：修改、删除 -->
							<view class="right">
								<text class="btn edit" @click="confirm(item, type)">修改</text>
								<text class="btn delete" @click.stop="deleteAddress(item.id)">删除</text>
							</view>
						</view>
					</view>
				</view>
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
	import shopApi from '@/api/shopApi.js'
	export default {
		mixins: [mixin],
		data(){
			return {
				userId: '',
				options: [{
					text: '删除',
					style: { backgroundColor: '#FE563B' }
				}],
				list:[],
				prescNo: '',
				type: 'edit',
				defaultAddressId: null,
				checkboxSelectedMap: {}
			}
		},
		computed: {
			...mapState(['footData']),
		},
		onLoad() {
			let loginValue = uni.getStorageSync("loginData");
			loginValue = loginValue ? JSON.parse(loginValue) : null;
			this.userId = loginValue != null ? loginValue.userId : '';
			this.getAddressList();
		},
		methods: {
			confirm(item, type){
				uni.navigateTo({
					url:`/sub_packages/address/detail?informationObj=${item ? encodeURIComponent(JSON.stringify(item)) : ''}&type=${type}`
				})
			},
			getAddressList(){
				shopApi.getAddressList(this.userId).then(res => {
					if(res.statusCode == 200){
						this.list = res.data.data;
						this.list.forEach(it => {
							this.$set(this.checkboxSelectedMap, it.id, it.isDefault == 1 ? [it.id] : [])
							if (it.isDefault == 1) this.defaultAddressId = it.id
						})
					}
				})
			},
			//delete
			deleteAddress(id) {
				uni.showModal({
					title: "提示",
					content: "确定删除该地址吗？",
					success: (res) => {
						if (res.confirm) {
							try {
								shopApi.deleteAddress(id).then(res => {
									if(res.statusCode == 200){
										uni.showToast({
											title: "删除成功",
											icon: "none",
										});
										this.getAddressList()
									} else {
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
			onCheckboxChange(item) {
				// 强制只保留当前项为选中，从而实现单选效果
				// 把所有项设为未选中
				this.list.forEach(it => {
					this.$set(this.checkboxSelectedMap, it.id, [])
					it.isDefault = 0
				})
				// 设置当前项选中
				this.$set(this.checkboxSelectedMap, item.id, [item.id])
				item.isDefault = 1
				this.defaultAddressId = item.id
				
				shopApi.saveAddress(item, this.userId).then()
				uni.showToast({ title: '已设置为默认地址', icon: 'none' })
			},
		},
		onShow() {
		  this.getAddressList()
		},
	}
</script>

<style lang="less" scoped>
	/deep/ .uni-data-checklist .checklist-group .checklist-box.is-checked {
	  background-color: transparent !important; /* 去掉背景色 */
	  border-color: #9A7546 !important; /* 保留选中时边框色（可改） */
	}
	
	/deep/ .uni-data-checklist .checklist-group .checklist-box.is-checked::after {
	  background-color: #9A7546 !important; /* 勾选图标颜色 */
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
			
			.list {
				margin: 15rpx 20rpx;
				color: #333;
				font-size: 30rpx;
				background: #fff;
				border-radius: 20rpx;
				.addressItem {
					padding: 30rpx;
					.address {
						padding-top: 20rpx;
					}
					.operating {
					  display: flex;
					  justify-content: space-between;
					  align-items: center;
					  margin-top: 20rpx;
					
					  .left {
					    display: flex;
					    align-items: center;
					
					    /deep/ .uni-data-checklist .checklist-group .checklist-box {
					      border-radius: 50%;
					      margin-right: 10rpx;
					    }
					
					    /deep/ .uni-data-checklist .checklist-text {
					      font-size: 26rpx;
					      color: #666;
					    }
					
					    /deep/ .uni-data-checklist .checklist-box.is-checked {
					      background-color: #9A7546;
					      border-color: #9A7546;
					    }
					  }
					
					  .right {
					    display: flex;
					    gap: 20rpx;
					
					    .btn {
					      font-size: 26rpx;
					      border: 1px solid #9A7546;
					      border-radius: 30rpx;
					      padding: 6rpx 20rpx;
					      color: #9A7546;
					
					      &.delete {
					        border-color: #FE563B;
					        color: #FE563B;
					      }
					    }
					  }
					}

				}
			}
		}
		.btn {
			background: #fff;
			padding: 20rpx 30rpx 50rpx;
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