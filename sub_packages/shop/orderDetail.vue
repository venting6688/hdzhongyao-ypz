<template>
  <view class="order-detail">
    <view class="order-detail-header">
      <view class="order-title">{{ orderData.status }}</view>
      <!--      <view class="order-tip"-->
      <!--        >订单将在 6天21小时 后自动收货，请及时关注物流信息</view-->
      <!--      >-->
    </view>

    <view v-if="true" class="order-logistics">
      <view class="stepper">
        <view v-for="(logistics, index) in logisticsList" :key="index" class="stepper-item">
          <view class="dot"></view>
          <view class="content">
            <view class="logistics-item">
              <text class="logistics-status">{{ logistics.status }}</text>
              <text class="logistics-time">{{ logistics.time }}</text>
              <view v-show="index === 0" class="detail-button" @click="onClickLogisticsDetail">
                <text class="logistics-button">物流详情</text>
                <uni-icons v-show="index === 0" class="logistics-icon" color="#999" size="18" type="arrowright"></uni-icons>
              </view>

            </view>
            <view class="logistics-desc">
              {{ logistics.desc }}
            </view>
          </view>
        </view>
        <view class="stepper-item">
          <view class="dot last-step">
            <uni-icons class="icon-location" size="24" type="location-filled"></uni-icons>
          </view>
          <view class="content">
            地址
          </view>
        </view>
      </view>
    </view>
    <!--订单详情-->
    <view class="goods-card">
      <order-item :isShowFooter="false" :order="orderData"></order-item>

      <view class="item-line total-price-line">
        <text class="value actual-price">
          <text class="label shifu-text">实付</text>
          ¥{{ orderData.total | formatPrice }}
        </text>
      </view>

      <view class="item-line">
        <text class="label">下单时间:</text>
        <view class="value">{{ orderData.date }}</view>
      </view>

      <view class="item-line">
        <text class="label">订单编号:</text>
        <view v-show="orderData.orderSn" class="value note-text">
          {{ orderData.orderSn }}
        </view>
        <view class="value note-text copy-btn" @click="onClickCopy">复制</view>
      </view>
    </view>
  </view>
</template>
<script>
  import shop from '@/api/shopApi.js'
  import orderItem from './components/order-item.vue'
  export default {
    components: {
      orderItem
    },
    data() {
      return {
        orderData: {},
        active: 2,
        loginData: null,
        logisticsList: [
          {
            status: '已发货',
            time: '2023-08-10 14:30:00',
            desc: '您的订单已发货，正在前往目的地'
          },
          {
            status: '运输中',
            time: '2023-08-12 09:15:00',
            desc: '您的订单正在运输途中，请耐心等待'
          },
          {
            status: '派送中',
            time: '2023-08-14 16:45:00',
            desc: '您的订单正在派送中，快递员即将送达'
          }
        ]
      }
    },
    onLoad(options) {
      const orderId = options.id
      this.loginData = uni.getStorageSync('loginData')
      this.getOrderDetail(orderId)
    },
    filters: {
      formatPrice(value) {
        if (typeof value !== 'number') return '0.00'
        return (value / 100).toFixed(2)
      }
    },
    methods: {
      getOrderDetail(orderId) {
        shop.getOrderDetailApi({
          orderId,
          userId: this.loginData.userId
        }).then(res => {
          if (!res.data) return
          const {
            orderInfo,
            orderGoods
          } = res.data
          const newOrders = {
            id: orderInfo.id,
            date: orderInfo.addTime,
            // total: orderInfo.goodsPrice,
            total: orderInfo.actualPrice,
            status: orderInfo.orderStatusText,
            orderSn: orderInfo.orderSn,
            goods: orderGoods.map(({
              id,
              goodsName,
              retailPrice,
              number,
              listPicUrl
            }) => ({
              id,
              name: goodsName,
              price: retailPrice,
              quantity: number,
              img: listPicUrl
            }))
          }
          this.orderData = newOrders
        })
      },
      onClickCopy() {
        uni.setClipboardData({
          data: this.orderData.orderSn,
          success: () => {
            uni.showToast({
              title: '复制成功',
              icon: 'success'
            })
          }
        })
      },
      onClickLogisticsDetail() {
        uni.navigateTo({
          url: '/sub_packages/shop/logistics?id=' + this.orderData.id
        })
      },
    }
  }
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
  @medium-font-size: 26.72rpx;

  .order-detail {
    .order-detail-header {
      margin: 10rpx 20rpx 0;
      padding: 20rpx 20rpx 10rpx;

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
        content: '';
        position: absolute;
        left: 0;
        /* 对齐 dot */
        top: 10px;
        /* 从 dot 底部开始 */
        width: 2px;
        height: calc(100% + 20rpx);
        background-color: #e0e0e0;
      }

      .logistics-item {
        display: flex;
        justify-content: space-between;
        //padding-bottom: 20rpx;
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
          margin-right: 150rpx;
        }
        .detail-button {
          float: right;
          .logistics-button {
            font-size: @medium-font-size;
            color: @dark-text;
            width: 200rpx;
            //text-align: right;
          }

          .logistics-icon {
            width: 50rpx;
          }
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
