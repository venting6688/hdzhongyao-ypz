<template>
  <view class="submit-order-page">
    <visitNotice
      ref="notice"
      :fontMode="fontMode"
      :noticeType="noticeType"
      @confirmed="handleConfirm"
    />
    <view class="address-card" @click="toSelectAddress">
      <uni-icons
        type="location-filled"
        size="24"
        class="icon-location"
      ></uni-icons>
      <view class="address-content">
        <template v-if="orderData.address.street">
          <view class="address-detail">
            <text class="region">{{ orderData.address.region }}</text>
            <view>{{ orderData.address.street }}</view>
          </view>
          <view class="user-info">
            <text class="name">{{ orderData.address.name }}</text>
            <text class="phone">{{ orderData.address.phone }}</text>
          </view>
        </template>
        <template v-else>
          <view class="no-address">请选择收货地址</view>
        </template>
      </view>
      <uni-icons type="arrowright" size="18" color="#333"></uni-icons>
    </view>

    <view class="goods-card">
      <view class="goods-item">
        <image
          :src="orderData.goods.image"
          mode="aspectFill"
          class="goods-image"
        ></image>
        <view class="goods-info">
          <view class="goods-name">{{ orderData.goods.name }}</view>
          <view class="goods-price">¥{{ orderData.goods.price | formatPrice }}</view>
        </view>
        <view class="goods-quantity">
          ×
          {{ orderData.goods.quantity }}
				</view>
      </view>

      <view class="item-line total-price-line">
        <text class="value actual-price">
          <text class="label shifu-text">实付</text>
					¥{{orderData.goods.actualPrice | formatPrice}}
				</text>
      <order-item :order="orderData" :isShowFooter="false"></order-item>
      <!--      <view class="goods-item">-->
      <!--        <image-->
      <!--          :src="orderData.goods.image"-->
      <!--          mode="aspectFill"-->
      <!--          class="goods-image"-->
      <!--        ></image>-->
      <!--        <view class="goods-info">-->
      <!--          <view class="goods-name">{{ orderData.goods.name }}</view>-->
      <!--          <view class="goods-price"-->
      <!--            >¥{{ orderData.goods.price | formatPrice }}</view-->
      <!--          >-->
      <!--        </view>-->
      <!--        <view class="goods-quantity">-->
      <!--          ×-->
      <!--          {{ orderData.goods.quantity }}</view-->
      <!--        >-->
      <!--      </view>-->

      <view class="item-line total-price-line">
        <text class="value actual-price">
          <text class="label shifu-text">实付</text>¥{{
            orderData.actualPrice | formatPrice
          }}</text
        >
      </view>
      <!--    </view>-->

      <!--    <view class="extra-info-card">-->
      <view class="item-line">
        <text class="label">配送:</text>
        <view class="value">{{ orderData.deliveryMethod }}</view>
      </view>

      <view class="item-line" @click="toEditNote">
        <text class="label">备注:</text>
        <view class="value note-text" v-show="orderData.note">
          {{ orderData.note }}
        </view>
        <view class="value note-text is-empty" v-show="!orderData.note">
          请给我备注
        </view>
        <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
      </view>
    </view>
    <view class="footer-bar">
      <view class="price-summary">
        <view class="total">
          合计
          <text class="amount">¥{{ orderData.goodsPrice | formatPrice }}</text>
        </view>
        <view class="delivery-fee">
          配送费 ¥{{ orderData.deliveryFee | formatPrice }}
        </view>
      </view>
      <button
        class="pay-button"
        @click="submitOrder"
        :disabled="!canPay"
        :class="{ 'disabled-btn': !canPay }"
      >
        在线审方
      </button>
    </view>
  </view>
</template>

<script>
import visitNotice from "@/components/visitNotice.vue";
import shopApi from "@/api/shopApi.js";
import orderItem from "@/sub_packages/shop/components/order-item.vue";

export default {
  components: {
    visitNotice,
    orderItem,
  },
  data() {
    return {
      showMain: false,
      canPay: false,
      fontMode: "normal",
      noticeType: "order",
      orderData: {},
    };
  },
  // 过滤器用于金额格式化
  filters: {
    formatPrice(value) {
      if (typeof value !== "number") return "0.00";
      return value.toFixed(2);
    },
  },
  computed: {
    finalTotal() {
      return 5.0 + this.orderData.deliveryFee;
    },
  },
  onLoad(options) {
    this.showMain = false;
    this.canPay = false;
    this.$nextTick(() => {
      this.$refs.notice.open();
    });

    const drugId = options.id;
    console.log(drugId);
    if (drugId) {
      this.checkOrder(drugId);
      this.getDetail();
    }
  },
  onShow() {},
  methods: {
    /** 提交订单前检查 */
    async checkOrder(drugId) {
      const res = await shopApi.checkOrderApi({
        goodsId: drugId,
        productId: 81,
        number: 10,
        userId: 19,
      });
      console.log(res);
      if (res) {
      } else {
      }
    },
    /** 获取订单详情 */
    async getDetail() {
      shopApi.getOrderDetailApi({ orderId: 20, userId: 19 }).then((res) => {
        const { orderInfo, orderGoods } = res.data;
        const newOrders = {
          id: orderInfo.id,
          date: orderInfo.addTime,
          goodsPrice: orderInfo.goodsPrice,
          actualPrice: orderInfo.actualPrice,
          status: orderInfo.orderStatusText,
          goods: orderGoods.map(
            ({ id, goodsName, retailPrice, number, listPicUrl }) => ({
              id,
              name: goodsName,
              price: retailPrice,
              quantity: number,
              img: listPicUrl,
            })
          ),
        };
        this.orderData = newOrders;
        console.log(newOrders);
      });
    },
    handleConfirm() {
      this.showMain = true;
      this.canPay = true;
    },
    toSelectAddress() {
      uni.navigateTo({
        url: "/sub_packages/address/index",
      });
    },
    toEditNote() {
      uni.showModal({
        title: "添加备注",
        content: this.orderData.note || "",
        editable: true,
        placeholderText: "请输入您的要求或留言...",
        success: (res) => {
          if (res.confirm) {
            this.orderData.note = res.content;
          }
        },
      });
    },

    /** 提交订单并支付 */
    async submitOrder() {
      if (!this.orderData.address.street) {
        uni.showToast({
          title: "请选择收货地址",
          icon: "none",
        });
        return;
      }

      uni.showLoading({ title: "提交中..." });

      const payload = {
        addressId: this.orderData.address.id,
        userId: this.orderData.userId,
        postscript: this.orderData.postscript,
      };

      const res = await shopApi.submitOrderApi(payload);
      if (res) {
        uni.showToast({
          title: "订单提交成功",
          icon: "success",
        });
      } else {
        uni.showToast({
          title: "订单提交失败",
          icon: "none",
        });
      }

      // 模拟提交成功，直接跳转
      setTimeout(() => {
        uni.hideLoading();
        this.startPayment("ORDER_20251021123456");
      }, 1000);
    },

    /** 启动支付流程 */
    startPayment(orderId) {
      // 这里调用 uni.requestPayment 发起微信/支付宝支付
      uni.showToast({ title: "订单提交成功，跳转支付", icon: "success" });
      uni.requestPayment({
        provider: "wxpay", // 服务提提供商
        timeStamp: res.data.miniPayRequest.timeStamp, // 时间戳
        nonceStr: res.data.miniPayRequest.nonceStr, // 随机字符串
        package: res.data.miniPayRequest.package,
        signType: res.data.miniPayRequest.signType, // 签名算法
        paySign: res.data.miniPayRequest.paySign, // 签名
        success: (result) => {
          uni.showToast({
            title: "支付成功",
            icon: "success",
          });
        },
        fail: (result) => {
          uni.showToast({
            title: "支付失败",
            icon: "none",
          });
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
/* 变量 */
@theme-color: #f04848;
@price-color: #ff4848;
@dark-text: #333333;
@medium-text: #666666;
@light-text: #999999;
@card-bg: #ffffff;
@border-color: #eeeeee;

.submit-order-page {
  padding-bottom: 150rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 通用卡片样式 */
.address-card,
.goods-card,
.extra-info-card,
.notice-card {
  margin: 20rpx;
  padding: 20rpx;
  background-color: @card-bg;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

/* 地址区域 */
.address-card {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icon-location {
    margin-right: 20rpx;
    color: @theme-color;
    align-self: stretch;
  }

  .address-content {
    flex: 1;
    margin-right: 20rpx;
    font-size: 28rpx;
    color: @dark-text;

    .address-detail {
      font-weight: bold;
      line-height: 1.5;
      .region {
        margin-right: 10rpx;
        font-weight: normal;
        color: @medium-text;
      }
    }
    .user-info {
      margin-top: 5rpx;
      font-size: 26rpx;
      color: @medium-text;
      .name {
        margin-right: 20rpx;
      }
    }
    .no-address {
      color: @theme-color;
      font-weight: bold;
    }
  }
}

/* 商品卡片区域 */
.goods-card {
  padding: 20rpx 20rpx 0;

  .goods-item {
    display: flex;
    align-items: center;
    padding-bottom: 20rpx;
    margin-bottom: 20rpx;

    .goods-image {
      width: 180rpx;
      height: 140rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
      flex-shrink: 0;
    }

    .goods-info {
      flex: 1;
      .goods-name {
        font-size: 30rpx;
        color: @dark-text;
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
        margin-bottom: 20rpx;
      }
      .goods-price {
        font-size: 34.62rpx;
        color: @dark-text;
        margin-top: 5rpx;
        font-weight: 500;
      }
    }

    .goods-quantity {
      font-size: 30rpx;
      color: @medium-text;
      margin-left: 20rpx;
    }
  }

  .total-price-line {
    justify-content: flex-end;
    padding-top: 0;
    border-bottom: 1rpx solid @border-color;
    .shifu-text {
      font-size: 28rpx;
      color: @dark-text;
      margin-right: 10rpx;
    }
    .actual-price {
      font-size: 36rpx;
      color: @price-color;
      font-weight: 500;
    }
  }
}

/* 配送及备注区域 */
.extra-info-card {
  padding: 0 20rpx;
}

.item-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25rpx 0;
  /* border-bottom: 1rpx solid @border-color; */
  font-size: 28rpx;

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: @medium-text;
    min-width: 80rpx;
  }

  .value {
    flex: 1;
    text-align: right;
    color: @medium-text;
  }

  .note-text {
    /* 备注不换行并省略号 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 10rpx;
  }

  .is-empty {
    color: #d9d9d9;
  }
}

.notice-card {
  .notice-card-title {
    font-size: 30rpx;
    color: @dark-text;
    font-weight: bold;
    margin-bottom: 20rpx;
    text-align: center;
  }
}

/* 底部栏 */
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 162rpx;
  padding: 0 20rpx calc(constant(safe-area-inset-bottom) / 2) 20rpx;
  padding: 0 20rpx calc(env(safe-area-inset-bottom) / 2) 20rpx;
  background-color: @card-bg;
  border-top: 1rpx solid @border-color;
  z-index: 99;

  .price-summary {
    display: flex;
    flex-direction: column;
    text-align: left;

    .total {
      font-size: 20rpx;
      color: @light-text;

      .amount {
        font-size: 36rpx;
        color: @price-color;
        margin-left: 10rpx;
      }
    }

    .delivery-fee {
      font-size: 20rpx;
      color: @light-text;
    }
  }

  .pay-button {
    background-color: #9a7546;
    color: @card-bg;
    font-size: 32rpx;
    height: 72rpx;
    width: 200rpx;
    border-radius: 40rpx;
    margin: 0;
    /* padding: 10rpx; */

    /* 覆盖默认 button 样式 */
    &::after {
      border: none;
    }
  }

  .disabled-btn {
    background-color: #ccc !important;
    color: #f5f5f5;
  }
}
</style>
