<template>
  <view class="order-card" :class="{ 'has-padding': isShowFooter }">
    <view class="order-header">
      <text class="order-date">{{ order.date }}</text>
      <text class="order-status">{{ order.status }}</text>
    </view>

    <view v-for="goods in order.goods" :key="goods.id">
      <view class="order-body" @click="onClickOrderDetail(order)">
        <image :src="goods.img" mode="aspectFill" class="order-img"></image>
        <view class="order-info">
          <text class="order-name">{{ goods.name }}</text>
          <view class="price-qty">
            <text class="order-price">￥{{ goods.price | formatPrice }}</text>
            <text class="order-qty">×{{ goods.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="order-footer" v-if="isShowFooter">
      <text class="total">总金额 ￥{{ order.total | formatPrice }}</text>

      <view class="actions">
        <view
          v-if="order.status === '待收货'"
          class="btn"
          @click="viewLogistics(order)"
          >查看物流</view
        >

        <view
          v-if="order.status === '等待发货'"
          class="btn"
          @click="onClickApplyRefund(order)"
          >申请退款</view
        >

        <view
          v-if="order.status === '待收货'"
          class="btn primary"
          @click="confirmOrder(order)"
          >确认收货</view
        >

        <view
          v-if="order.status === '未付款'"
          class="btn"
          @click="cancelOrder(order)"
          >取消订单</view
        >

        <view
          v-if="order.status === '未付款'"
          class="btn primary"
          @click="payNow(order)"
          >继续支付</view
        >

        <view
          v-if="order.status === '已完成'"
          class="btn primary"
          @click="buyAgain(order)"
          >再次购买</view
        >
      </view>
    </view>
    <uni-popup ref="refundPopup" type="bottom" background-color="#fff">
      <view class="popup-header">
        <text class="popup-title">确认退款信息</text>
        <uni-icons
          type="close"
          size="24"
          color="#666"
          @click="closeNotePopup"
        ></uni-icons>
      </view>
      <view class="popup-content">
        <view v-for="goods in order.goods" :key="goods.id">
          <view class="order-body" @click="onClickOrderDetail(order)">
            <image :src="goods.img" mode="aspectFill" class="order-img"></image>
            <view class="order-info">
              <text class="order-name">{{ goods.name }}</text>
              <view class="price-qty">
                <text class="order-price">￥{{ goods.price | formatPrice }}</text>
                <text class="order-qty">×{{ goods.quantity }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="refund-amount-container">退款金额： <text class="refund-amount"> ￥{{ order.total | formatPrice }}</text></view>
        <view class="refund-reason">
          <text>退款原因：</text>
          <textarea
            v-model="orderData.note"
            placeholder="请输入您的退款原因"
            maxLength="100"
            class="note-textarea"
          ></textarea>
        </view>
      </view>
      <view class="popup-footer">
        <button class="confirm-btn" @click="confirmNote">确认</button>
      </view>
    </uni-popup>
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
    };
  },
  filters: {
    formatPrice(value) {
      if (typeof value !== "number") return "0.00";
      return (value / 100).toFixed(2);
    },
  },
  mounted() {
    this.loginData = uni.getStorageSync("loginData");
  },
  methods: {
    viewLogistics(order) {
      console.log("查看物流", order.id);
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
      // console.log(order);
      // const goodsData = [{
      //   ...this.order,
      //   quantity: 1,
      // }];
      // uni.navigateTo({
      //   url: `/sub_packages/shop/submitOrder?goodsData=${encodeURIComponent(JSON.stringify(goodsData))}`,
      // });
    },
    buyAgain(order) {
      console.log("再次购买", order.id);
    },
    onClickOrderDetail(order) {
      uni.navigateTo({
        url: "/sub_packages/shop/orderDetail?id=" + order.id,
      });
    },
    async onClickApplyRefund(order) {
      this.$refs.refundPopup.open();
    },
    closeNotePopup() {
      this.$refs.refundPopup.close();
    },
  },
};
</script>

<style scoped lang="less">
.order-card {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}
.order-card.has-padding {
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
  color: #faaa03;
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
  border: 1px solid #a77d50;
  border-radius: 30rpx;
  color: #a77d50;
  background: transparent;
}
.btn.primary {
  background: #a77d50;
  color: #fff;
}

.popup-header {
  display: flex;
  justify-content: center; /* 居中标题 */
  align-items: center;
  position: relative;
  padding: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.popup-header uni-icons {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
}
.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  padding: 30rpx;
  color: #333;
}

.popup-content {
  height: 60vh;
  overflow: auto;
  padding: 0 30rpx;
  .refund-amount-container {
    margin: 25rpx 0;
    .refund-amount {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      float: right;
    }
  }

  .refund-reason {
    display: flex;
    > text {
      width: 160rpx;
    }
  }
}

.popup-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.popup-footer {
  padding: 30rpx;
  .confirm-btn {
    background-color: #9a7546;
    color: #fff;
    border: none;
    border-radius: 50rpx;
    font-size: 32rpx;
    width: 95%;
    margin-bottom: 20rpx;
  }
}

.popup-btn {
  background-color: #4286ff;
  color: #fff;
  border: none;
  border-radius: 50rpx;
  font-size: 32rpx;
  width: 100%;
}
.note-textarea {
  //width: 75%;
  height: 250rpx;
  padding: 20rpx;
  //margin: 20rpx auto;
  font-size: 28rpx;
  border: 1rpx solid #ccc;
  border-radius: 12rpx;
  resize: none;
  background-color: #f5f5f5;
}

.popup-content {
  height: 770rpx;
}
</style>
