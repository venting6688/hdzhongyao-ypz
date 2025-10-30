<template>
  <view class="order-card">
    <view class="order-header">
      <text class="order-date">{{ order.date }}</text>
      <text class="order-status">{{ order.status }}</text>
    </view>

    <view  v-for="goods in order.goods" :key="goods.id">
      <view class="order-body" @click="onClickOrderDetail(order)">
        <image :src="goods.img" mode="aspectFill" class="order-img"></image>
        <view class="order-info">
          <text class="order-name">{{ goods.name }}</text>
          <view class="price-qty">
            <text class="order-price">￥{{ goods.price }}</text>
            <text class="order-qty">×{{ goods.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="order-footer" v-if="isShowFooter">
      <text class="total">总金额 ￥{{ order.total }}</text>

      <view class="actions">
        <view
          v-if="order.status === '待收货'"
          class="btn"
          @click="viewLogistics(order)"
        >查看物流</view>

				<view
				  v-if="order.status === '等待发货'"
				  class="btn"
				  @click="viewLogistics(order)"
				>申请退款</view>

        <view
          v-if="order.status === '待收货'"
          class="btn primary"
          @click="confirmOrder(order)"
        >确认收货</view>

        <view
          v-if="order.status === '未付款'"
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
import shopApi from "@/api/shopApi.js";

export default {
  props: {
    order: Object,
    isShowFooter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loginData: null,
    }
  },
  mounted() {
    this.loginData = uni.getStorageSync("loginData");
  },
  methods: {
    viewLogistics(order) {
      console.log('查看物流', order.id)
    },
    async confirmOrder(order) {
      const res = await shopApi.confirmOrderApi({
        orderId: order.id,
        userId: this.loginData.userId,
      });
      if (res.errno === 0) {
        uni.showToast({
          title: "确认收货成功",
          icon: "success",
        });
        this.$emit("getOrderListEmit");
      }
    },
    async cancelOrder(order) {
      const res = await shopApi.cancelOrderApi({
        orderId: order.id,
        userId: this.loginData.userId,
      });
      if (res.errno === 0) {
        uni.showToast({
          title: "取消成功",
          icon: "success",
        });
        this.$emit("getOrderListEmit");
      }
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
    margin-top: 15rpx;
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
