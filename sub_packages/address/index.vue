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
									<text class="name">{{item.contactName}}</text>
									<text>{{pixelateNumber(item.contactNumbre)}}</text>
								</view>
								<view class="address">
									{{item.provincesAndMunicipalities ? item.provincesAndMunicipalities+' - ' : ''}}{{item.detailedAddress}}
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
					{id: 1, contactName: '张三', isDefault: 0, contactNumbre: '15895623023', provincesAndMunicipalities: '山东省淄博市周口区', detailedAddress:"幸福里小区3-2-502"},
					{id: 2, contactName: '李茂武', isDefault: 1, contactNumbre: '185362365202', provincesAndMunicipalities: '湖南省龙口市龙口区', detailedAddress:"康博3-2-502"},
					{id: 3, contactName: '王小二', isDefault: 0, contactNumbre: '18956323636', provincesAndMunicipalities: '广东省广州市番禺区', detailedAddress:"番禺1号3-2-502"},
					{id: 4, contactName: '刘晓娟', isDefault: 0, contactNumbre: '15125658956', provincesAndMunicipalities: '海南省海口市海口区', detailedAddress:"幸福里小区3-2-502"},
					{id: 5, contactName: '赵楚生', isDefault: 0, contactNumbre: '13965230236', provincesAndMunicipalities: '山东省青岛市黄岛区', detailedAddress:"黄岛二中医3-2-502"},
				],
				prescNo: '',
				type: 'edit',
				defaultAddressId: null,
				checkboxSelectedMap: {}
			}
		},
		computed: {
			...mapState(['footData']),
		},
		mounted() {
			this.list.forEach(it => {
			    this.$set(this.checkboxSelectedMap, it.id, it.isDefault ? [it.id] : [])
			    if (it.isDefault) this.defaultAddressId = it.id
			  })
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
			onCheckboxChange(item) {
				// 强制只保留当前项为选中，从而实现单选效果
				// 把所有项设为未选中
				this.list.forEach(it => {
					this.$set(this.checkboxSelectedMap, it.id, [])
					it.isDefault = false
				})
				// 设置当前项选中
				this.$set(this.checkboxSelectedMap, item.id, [item.id])
				item.isDefault = true
				this.defaultAddressId = item.id
		
				// 如果需要同步到后端，可在这里调用接口
				// addressApi.setDefaultAddress(item.id).then(...)
				uni.showToast({ title: '已设置为默认地址', icon: 'none' })
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