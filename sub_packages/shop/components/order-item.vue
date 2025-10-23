<template>
  <view class="order-card">
    <view class="order-header">
      <text class="order-date">{{ order.date }}</text>
      <text class="order-status">{{ order.status }}</text>
    </view>

    <view class="order-body" @click="onClickOrderDetail(order)">
      <image :src="order.img" mode="aspectFill" class="order-img"></image>
      <view class="order-info">
        <text class="order-name">{{ order.name }}</text>
        <view class="price-qty">
          <text class="order-price">￥{{ order.price }}</text>
          <text class="order-qty">×{{ order.quantity }}</text>
        </view>
      </view>
    </view>

    <view class="order-footer">
      <text class="total">总金额 ￥{{ order.total }}</text>

      <view class="actions">
        <view
          v-if="order.status === '待收货'"
          class="btn"
          @click="viewLogistics(order)"
        >查看物流</view>

				<view
				  v-if="order.status === '待发货'"
				  class="btn"
				  @click="viewLogistics(order)"
				>申请退款</view>

        <view
          v-if="order.status === '待收货'"
          class="btn primary"
          @click="confirmReceive(order)"
        >确认收货</view>

        <view
          v-if="order.status === '待付款'"
          class="btn"
          @click="cancelOrder(order)"
        >取消订单</view>

        <view
          v-if="order.status === '待付款'"
          class="btn primary"
          @click="payNow(order)"
        >立即付款</view>

        <view
          v-if="order.status === '已完成'"
          class="btn primary"
          @click="buyAgain(order)"
        >再次购买</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    order: Object
  },
  methods: {
    viewLogistics(order) {
      console.log('查看物流', order.id)
    },
    confirmReceive(order) {
      console.log('确认收货', order.id)
    },
    cancelOrder(order) {
      console.log('取消订单', order.id)
    },
    payNow(order) {
      console.log('立即付款', order.id)
    },
    buyAgain(order) {
      console.log('再次购买', order.id)
    },
    onClickOrderDetail(order) {
      uni.navigateTo({
        url: '/sub_packages/shop/orderDetail?id=' + order.id
      })
    }
  }
}
</script>

<style scoped>
	.order-card {
		background: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		padding: 35rpx;
	}
	.order-header {
		display: flex;
		justify-content: space-between;
		color: #666;
		font-size: 26rpx;
		margin-bottom: 20rpx;
	}
	.order-status {
		color: #FAAA03;
	}
	.order-body {
		display: flex;
	}
	.order-img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}
	.order-info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		padding: 15rpx 15rpx 15rpx 0;
	}

	.price-qty {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.order-price {
		color: #333;
		font-size: 28rpx;
	}

	.order-qty {
		color: #999;
		font-size: 26rpx;
	}
	.order-footer {
		border-top: 1px solid #eee;
		margin-top: 20rpx;
		padding-top: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.total {
		color: #333;
		font-weight: bold;
	}
	.actions {
		display: flex;
		gap: 20rpx;
	}
	.btn {
		font-size: 26rpx;
		padding: 8rpx 20rpx;
		border: 1px solid #A77D50;
		border-radius: 30rpx;
		color: #A77D50;
		background: transparent;
	}
	.btn.primary {
		background: #A77D50;
		color: #fff;
	}
</style>
