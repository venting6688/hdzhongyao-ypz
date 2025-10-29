<template>
	<view class="user">
		<view class="content">
			<address-item
				v-for="(item, index) in list"
				:key="index"
				:item="item"
				:mode="'manage'"
				:checkboxSelectedMap="checkboxSelectedMap"
				@onCheckboxChange="onCheckboxChange"
				@onEdit="confirm"
				@onDelete="deleteAddress"
			/>
		</view>

		<view class="btn">
			<view class="confirm" @click="confirm({}, 'add')">新增收货地址</view>
		</view>
	</view>
</template>

<script>
import mixin from '@/mixins/mixin'
import { mapState } from 'vuex'
import shopApi from '@/api/shopApi.js'
import addressItem from '../components/addressItem.vue'

export default {
	mixins: [mixin],
	components: { addressItem },
	data() {
		return {
			userId: '',
			list: [],
			type: 'edit',
			defaultAddressId: null,
			checkboxSelectedMap: {}
		}
	},
	computed: {
		...mapState(['footData'])
	},
	onLoad() {
		let loginValue = uni.getStorageSync("loginData");
		this.userId = loginValue != null ? loginValue.userId : '';
		this.getAddressList();
	},
	onShow() {
		this.getAddressList();
	},
	methods: {
		confirm(item, type) {
			uni.navigateTo({
				url: `/sub_packages/address/detail?informationObj=${item ? encodeURIComponent(JSON.stringify(item)) : ''}&type=${type}`
			})
		},
		getAddressList() {
			shopApi.getAddressList(this.userId).then(res => {
				if (res.statusCode == 200) {
					this.list = res.data.data;
					this.list.forEach(it => {
						this.$set(this.checkboxSelectedMap, it.id, it.isDefault == 1 ? [it.id] : []);
						if (it.isDefault == 1) this.defaultAddressId = it.id;
					});
				}
			})
		},
		deleteAddress(id) {
			uni.showModal({
				title: "提示",
				content: "确定删除该地址吗？",
				success: (res) => {
					if (res.confirm) {
						shopApi.deleteAddress(id).then(res => {
							if (res.statusCode == 200) {
								uni.showToast({ title: "删除成功", icon: "none" });
								this.getAddressList();
							}
						})
					}
				},
			});
		},
		onCheckboxChange(item) {
			this.list.forEach(it => {
				this.$set(this.checkboxSelectedMap, it.id, [])
				it.isDefault = 0
			})
			this.$set(this.checkboxSelectedMap, item.id, [item.id])
			item.isDefault = 1
			this.defaultAddressId = item.id

			shopApi.saveAddress(item, this.userId).then()
			uni.showToast({ title: '已设置为默认地址', icon: 'none' })
		}
	}
}
</script>

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
