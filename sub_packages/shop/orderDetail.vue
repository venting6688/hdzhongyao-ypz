<template>
  <view class="order-detail">
    <view class="order-detail-header">
      <view class="order-title">{{ orderData.status }}</view>
      <!--      <view class="order-tip"-->
      <!--        >订单将在 6天21小时 后自动收货，请及时关注物流信息</view-->
      <!--      >-->
    </view>

    <view class="order-logistics" v-if="false">
      <view class="stepper">
        <view class="stepper-item">
          <view class="dot"></view>
          <view class="content">
            <view class="logistics-item">
              <text class="logistics-status">已签收</text>
              <text class="logistics-time">2023-08-15 10:00:00</text>
              <text class="logistics-button"> 物流详情 </text>
              <uni-icons
                class="logistics-icon"
                type="arrowright"
                size="18"
                color="#999"
              ></uni-icons>
            </view>
            <view class="logistics-desc">
              【代收点】您的快件已签收,签收人在:浙富科技园2号楼-1楼电梯厅丰巢柜(浙富科技园2号楼-1楼电梯
            </view></view
          >
        </view>
        <view class="stepper-item">
          <view class="dot last-step">
            <uni-icons
              type="location-filled"
              size="24"
              class="icon-location"
            ></uni-icons
          ></view>
          <view class="content">
            <view class="address-card" @click="toSelectAddress">
              <view class="address-content">
                <template v-if="orderData.address.street">
                  <view class="address-detail">
                    <!--              <text class="region">{{ orderData.address.region }}</text>-->
                    <view>
                      {{ orderData.address.region + orderData.address.street }}
                    </view>
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
            </view>
          </view>
        </view>
      </view>
    </view>
    <!--订单详情-->
    <view class="goods-card">
      <order-item :order="orderData" :isShowFooter="false"></order-item>
      <!--      <view class="goods-item">-->
      <!--        <image-->
      <!--          :src="orderData.goods.image"-->
      <!--          mode="aspectFill"-->
      <!--          class="goods-image"-->
      <!--        ></image>-->
      <!--        <view class="goods-info">-->
      <!--          <view class="goods-name">{{ orderData.goods.name }}</view>-->
      <!--          <view class="goods-price">¥{{ orderData.goods.price }}</view>-->
      <!--        </view>-->
      <!--        <view class="goods-quantity">-->
      <!--          ×-->
      <!--          {{ orderData.goods.quantity }}</view-->
      <!--        >-->
      <!--      </view>-->

      <view class="item-line total-price-line">
        <text class="value actual-price">
          <text class="label shifu-text">实付</text>¥{{ orderData.total }}</text
        >
      </view>
      <!--    </view>-->

      <!--    <view class="extra-info-card">-->
      <view class="item-line">
        <text class="label">下单时间:</text>
        <view class="value">{{ orderData.date }}</view>
      </view>

      <view class="item-line">
        <text class="label">订单编号:</text>
        <view class="value note-text" v-show="orderData.orderSn">
          {{ orderData.orderSn }}
        </view>
        <view class="value note-text copy-btn" @click="onClickCopy">
          复制
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import shop from "@/api/shopApi.js";
import orderItem from "./components/order-item.vue";
export default {
  components: { orderItem },
  data() {
    return {
      orderData: {
        date: "2023-08-15",
        status: "待收货",
        goods: {
          image: "/static/image/test.png",
          name: "四君子茶",
          price: 4.93,
          quantity: 7,
          actualPrice: 30,
        },
        address: {
          region: "广东省 广州市",
          street: "广州市海珠区",
          name: "张三",
          phone: "13800000000",
        },
        deliveryMethod: "快递",
        note: "请在配送时带上身份证",
        orderId: "P73641843423425556",
      },
      list2: [
        {
          title: "买家下单",
          desc: "2018-11-11",
        },
        {
          title: "卖家发货",
          desc: "2018-11-12",
        },
      ],
      active: 2,
      loginData: null,
    };
  },
  onLoad(options) {
    const orderId = options.id;
    this.loginData = uni.getStorageSync("loginData");
    console.log("订单详情", orderId);
    this.getOrderDetail(orderId);
  },
  methods: {
    getOrderDetail(orderId) {
      shop
        .getOrderDetailApi({ orderId, userId: this.loginData.userId })
        .then((res) => {
          if (!res.data) return;
          const { orderInfo, orderGoods } = res.data;
          const newOrders = {
            id: orderInfo.id,
            date: orderInfo.addTime,
            // total: orderInfo.goodsPrice,
            total: orderInfo.actualPrice,
            status: orderInfo.orderStatusText,
            orderSn: orderInfo.orderSn,
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
    onClickCopy() {
      uni.setClipboardData({
        data: this.orderData.orderSn,
        success: () => {
          uni.showToast({
            title: "复制成功",
            icon: "success",
          });
        },
      });
    },
  },
};
</script>
<style scoped lang="less">
/* 变量 */
@theme-color: #f04848;
@price-color: #ff4848;
@dark-text: #333333;
@medium-text: #666666;
@light-text: #999999;
@card-bg: #ffffff;
@border-color: #eeeeee;
@medium-font-size: 26.72rpx;

.order-detail {
  .order-detail-header {
    padding: 20rpx;

    .order-title {
      font-size: 30.53rpx;
      margin-bottom: 10rpx;
    }
    .order-tip {
      font-size: @medium-font-size;
      color: @medium-text;
    }
  }

  .order-logistics {
    margin: 20rpx;
    background-color: @card-bg;
    border-radius: 0 0 16rpx 16rpx;
    padding: 30rpx 0 10rpx;

    .stepper {
      position: relative;
      margin: 0 10rpx 0 50rpx;
      padding-left: 0rpx;
      //border-left: 2px solid #e0e0e0; /* 纵向主线 */
    }

    .stepper-item {
      position: relative;
      margin-bottom: 10px;

      .dot {
        position: absolute;
        left: -6rpx;
        top: 15rpx;
        width: 15rpx;
        height: 15rpx;
        background-color: #e0e0e0;
        border-radius: 50%;
        transition: background-color 0.3s;
      }
      .dot.last-step {
        background-color: #fff;
        left: -21rpx;
        top: 5rpx;
      }
      .content {
        margin-left: 20px;
      }
    }

    .stepper-item:not(:last-child)::after {
      content: "";
      position: absolute;
      left: 0; /* 对齐 dot */
      top: 10px; /* 从 dot 底部开始 */
      width: 2px;
      height: calc(100% + 20rpx);
      background-color: #e0e0e0;
    }

    .logistics-item {
      display: flex;
      justify-content: space-between;
      padding-bottom: 20rpx;
      margin-bottom: 20rpx;
      //border-bottom: 1rpx solid @border-color;

      .logistics-status {
        font-size: @medium-font-size;
        color: @dark-text;
        margin-right: 20rpx;
      }
      .logistics-time {
        font-size: @medium-font-size;
        color: @light-text;
        margin-right: 20rpx;
      }
      .logistics-button {
        font-size: @medium-font-size;
        color: @dark-text;
        width: 200rpx;
        text-align: right;
      }
      .logistics-icon {
        width: 50rpx;
      }
    }

    .logistics-desc {
      font-size: 24.81rpx;
      color: @medium-text;
    }
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
}

/* 商品卡片区域 */
.goods-card {
  padding: 20rpx 20rpx 0;
  margin: 20rpx;
  padding: 20rpx;
  background-color: @card-bg;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

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
  .copy-btn {
    color: #87653a;
    border-left: 1rpx solid #dadada;
    width: 66rpx;
    flex: none;
  }

  .is-empty {
    color: #d9d9d9;
  }
}
</style>
