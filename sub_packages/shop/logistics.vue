<template>
  <view>
    <view v-if="true" class="order-logistics">
      <view class="stepper">
        <view v-for="(logistics, index) in logisticsList" :key="index" class="stepper-item">
          <view class="dot"></view>
          <view class="content">
            <view class="logistics-item">
              <text class="logistics-status">{{ logistics.status }}</text>
              <text class="logistics-time">{{ logistics.time }}</text>
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
  </view>
</template>
<script>
import shopApi from '@/api/shopApi.js'
export default {
  data() {
    return {
      logisticsList: [
        {
          status: '订单已发货',
          time: '2024-06-01 10:00',
          desc: '您的订单已由顺丰快递发出，快递单号：SF1234567890'
        },
        {
          status: '订单处理中',
          time: '2024-05-31 15:30',
          desc: '您的订单正在打包中，预计明天发货'
        },
        {
          status: '订单已确认',
          time: '2024-05-30 12:00',
          desc: '您的订单已确认，我们将尽快为您处理'
        }
      ]
    }
  },
  onLoad(options) {
    console.log(options.id)
    uni.setNavigationBarTitle({
      title: '物流信息'
    })
  },
  methods: {
    async getLogisticsList() {
      api.getLogisticsInfo(orderId).then(response => {
        this.logisticsList = response.data;
      });
    }
  }
}
</script>
<style lang="less" scoped>
@theme-color: #f04848;
@price-color: #ff4848;
@dark-text: #333333;
@medium-text: #666666;
@light-text: #999999;
@card-bg: #ffffff;
@border-color: #eeeeee;
@medium-font-size: 26.72rpx;

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

</style>
