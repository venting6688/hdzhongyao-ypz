<template>
  <view class="submit-order-page">
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
          <view class="goods-price"
            >¥{{ orderData.goods.price | formatPrice }}</view
          >
        </view>
        <view class="goods-quantity">
          ×
          {{ orderData.goods.quantity }}</view
        >
      </view>

      <view class="item-line total-price-line">
        <text class="value actual-price">
          <text class="label shifu-text">实付</text>¥{{
            orderData.goods.actualPrice | formatPrice
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

    <view class="notice-card">
      <view class="notice-card-title">
        -购药须知-
      </view>
      <view> 1.本平台是黄岛第二中医医院官方互联网医疗服务平台</view>
      <view> 2.所有药品均经专业药师审核，</view>
      <view> 3.患者需如实填写个人信息和健康状况评估，医生不提供诊疗咨询，慢性病复诊服务。若评估后不适合，请线下到院就诊咨询。</view>
      <view> 4.此药饮不可代替正常药物使用。</view>
      <view> 5.急重症患者请及时就医，不适合使用本服务</view>
      <view> 用药安全须知</view>
      <view> 1.请按包装说明或者医嘱使用，不可擅自增减剂量</view>
      <view> 2.不同中药的储存要求及保存时间不同(常规放在阴凉干燥处保存)，拿到中药后请及时使用，发现有异常情况请勿使用，若出现数量不对、药品质量问题请拨打电话-0532-88191639</view>
      <view> 3.孕妇、儿童、哺乳期妇女、肝肾功能异常者及过敏体质者在医师指导下服用。</view>
      <view> 4.此药饮不可代替正常药物使用，如遇冲突请线下咨询医生</view>
      <view> 代茶饮使用问题解答</view>
      <view> 1.下单信息填写错误，可扫码入群，联系群内工作人员或者拨打0532-88191639进行信息更改。</view>
      <view> 2.代茶饮一天一付，7付为一疗程，适量沸水冲泡或煮服。颜色变淡可停止服用。</view>
      <view> 3.不建议同时服用2种代茶饮，在医师指导下更换其他种类代茶饮。</view>
      <view> 4.开封的代茶饮请及时封口，通风干燥处存放。</view>
      <view> 5.代茶饮期间避免过量摄入寒凉腥辣食物。</view>
      <view> 配送服务说明</view>
      <view> 1.可在中药窗口凭单自取，也可快递到家(需承担快递费当天下单后统一次日发货，发出的药品除质量问题概不退换。</view>
    </view>

    <view class="footer-bar">
      <view class="price-summary">
        <view class="total">
          合计
          <text class="amount">¥{{ finalTotal | formatPrice }}</text>
        </view>
        <view class="delivery-fee">
          配送费 ¥{{ orderData.deliveryFee | formatPrice }}
        </view>
      </view>
      <button class="pay-button" @click="submitOrder">立即支付</button>
    </view>
  </view>
</template>

<script>
const MOCK_ORDER_DATA = {
  address: {
    name: "徐女士",
    phone: "139 8510 5621",
    region: "山东省 济南市 天桥区",
    street: "名泉广场写字楼 E3-560",
  },
  goods: {
    name: "四君子茶",
    image: "/static/goods-placeholder.jpg",
    price: 4.93,
    quantity: 7,
    actualPrice: 30.0,
  },
  deliveryMethod: "快递运输",
  deliveryFee: 0.0,
  note: "",
};

export default {
  components: {},
  data() {
    return {
      orderData: MOCK_ORDER_DATA,
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
    const drugId = options.id;
    if (drugId) {
      this.orderData.goods = {
        id: drugId,
        name: "四君子茶",
        image: "/static/image/medicine_img.png",
        price: 4.93,
        quantity: 7,
        actualPrice: 30.0,
      };
    }
  },
  onShow() {},
  methods: {
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
    submitOrder() {
      if (!this.orderData.address.street) {
        uni.showToast({
          title: "请选择收货地址",
          icon: "none",
        });
        return;
      }

      uni.showLoading({ title: "提交中..." });

      const payload = {
        goodsId: this.orderData.goods.id, // 假设有ID
        quantity: this.orderData.goods.quantity,
        addressId: this.orderData.address.id, // 假设有ID
        note: this.orderData.note,
        totalAmount: this.finalTotal,
        // ... 其他必要字段
      };

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
}
</style>
