<template>
	<view class="list">
		<view class="addressItem">
			<view class="midddle">
				<view class="title">
					<text class="name">{{ item.userName }}</text>
					<text class="phone">{{ pixelateNumber(item.telNumber) }}</text>
				</view>

				<view class="address">
					{{ item.fullRegion ? item.fullRegion + ' - ' : '' }}{{ item.detailInfo }}
				</view>

				<!-- 操作区：仅在管理模式显示 -->
				<view class="operating" v-if="mode === 'manage'">
					<view class="left">
						<uni-data-checkbox
							:localdata="[{ text: '', value: item.id }]"
							v-model="checkboxSelectedMap[item.id]"
							selectedColor="#9A7546"
							@change="$emit('onCheckboxChange', item)"
						/>
						<text class="default-text">{{ item.isDefault ? '已默认' : '设为默认地址' }}</text>
					</view>

					<view class="right">
						<text class="btn edit" @click="$emit('onEdit', item, 'edit')">修改</text>
						<text class="btn delete" @click.stop="$emit('onDelete', item.id)">删除</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'addressItem',
	props: {
		item: { type: Object, required: true },
		mode: { type: String, default: 'manage' }, // manage | select
		checkboxSelectedMap: { type: Object, default: () => ({}) }
	},
	methods: {
		pixelateNumber(number) {
			if (!number) return ''
			return number.slice(0, 3) + '****' + number.slice(-4)
		}
	}
}
</script>

<style lang="less" scoped>
/deep/ .uni-data-checklist .checklist-group .checklist-box.is-checked {
  background-color: transparent !important;
  border-color: #9A7546 !important;
}
  
/deep/ .uni-data-checklist .checklist-group .checklist-box.is-checked::after {
  background-color: #9A7546 !important;
}

.list {
	margin: 15rpx 20rpx;
	color: #333;
	font-size: 30rpx;
	background: #fff;
	border-radius: 20rpx;

	.addressItem {
		padding: 30rpx;
		.phone {
			padding-left: 30rpx;
		}
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
</style>
