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
        <view v-if="order.status === '待收货'" class="btn" @click="viewLogistics(order)">
          查看物流
        </view>

        <view v-if="order.status === '等待发货'" class="btn" @click="onClickApplyRefund(order)">
          申请退款
        </view>

        <view v-if="order.status === '待收货'" class="btn primary" @click="confirmOrder(order)">
          确认收货
        </view>

        <view v-if="order.status === '未付款'" class="btn" @click="cancelOrder(order)">
          取消订单
        </view>

        <view
          v-if="order.status === '未付款' && !isExpired(order)"
          class="btn primary"
          @click="payNow(order)"
        >
          继续支付
        </view>

        <view v-if="order.status === '已完成'" class="btn primary" @click="buyAgain(order)">
          再次购买
        </view>
      </view>
    </view>
    <uni-popup ref="refundPopup" type="bottom" background-color="#fff">
      <view class="popup-header">
        <text class="popup-title">确认退款信息</text>
        <uni-icons type="close" size="24" color="#666" @click="closeNotePopup"></uni-icons>
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
        <view class="refund-amount-container">
          退款金额：
          <text class="refund-amount">￥{{ order.total | formatPrice }}</text>
        </view>
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
        <button class="confirm-btn" @click="onClickConfirm">确认</button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import shopApi from '@/api/shopApi.js'
import dayjs from 'dayjs'

export default {
  props: {
    order: Object,
    isShowFooter: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loginData: null,
      productIds: []
    }
  },
  filters: {
    formatPrice(value) {
      if (typeof value !== 'number') return '0.00'
      return (value / 100).toFixed(2)
    }
  },
  mounted() {
    this.loginData = uni.getStorageSync('loginData')
  },
  methods: {
    viewLogistics(order) {
      console.log(order)
      uni.navigateTo({
        url: '/sub_packages/shop/logistics?orderSn=' + order.orderSn
      })
    },
    async confirmOrder(order) {
      const res = await shopApi.confirmOrderApi({
        orderId: order.id,
        userId: this.loginData.userId
      })
      if (res.errno === 0) {
        uni.showToast({
          title: '确认收货成功',
          icon: 'success'
        })
        this.$emit('getOrderListEmit')
      }
    },
    async cancelOrder(order) {
      const res = await shopApi.cancelOrderApi({
        orderId: order.id,
        userId: this.loginData.userId
      })
      if (res.errno === 0) {
        uni.showToast({
          title: '取消成功',
          icon: 'success'
        })
        this.$emit('getOrderListEmit')
      }
    },
    // 判断订单是否过期，订单创建超过1小时则认为过期，不可继续支付
    isExpired(order) {
      return dayjs().isAfter(dayjs(order.date).add(1, 'hour'))
    },
    async payNow(orderInfo) {
      const res = await shopApi.getRowDataApi({
        merOrderId: orderInfo?.orderSn,
        userId: this.loginData.userId
      })
      if (res.code == 200) {
        const payParams = JSON.parse(res.data.rowData)
        if (payParams && 'miniPayRequest' in payParams) {
          this.startPayment(payParams.miniPayRequest, orderInfo)
        }
      } else {
        uni.showToast({
          title: '获取支付参数失败',
          icon: 'none'
        })
      }
    },
    /** 启动支付流程 */
    startPayment(payParams, { id, orderSn }) {
      if (!payParams || !orderSn) throw new Error('缺少支付参数')
      uni.requestPayment({
        provider: 'wxpay', // 服务提提供商
        timeStamp: payParams.timeStamp, // 时间戳
        nonceStr: payParams.nonceStr, // 随机字符串
        package: payParams.package,
        signType: payParams.signType, // 签名算法
        paySign: payParams.paySign, // 签名
        success: result => {
          uni.showToast({
            title: '支付成功',
            icon: 'success'
          })
          shopApi
            .updateSuccessApi({
              orderId: id,
              orderSn: orderSn,
              userId: this.loginData.userId
            })
            .then(res => {
              if (res.errno === 0) {
                this.$emit('getOrderListEmit')
              }
            })
        },
        fail: result => {
          uni.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
      })
    },
    async getPorductId(goodsid) {
      let res = await shopApi.getProductById(goodsid)
      if (res.statusCode == 200 && res.data.length) {
        let productId = []
        res.data.map(v => {
          productId.push(v.id)
        })
        this.productIds = productId.join(',')
      }
    },
    async addCart(goods) {
      let data = {
        number: goods.quantity,
        goodsId: goods.goodsId,
        userId: this.loginData.userId,
        productId: goods.productId
      }

      const res = await shopApi.addCart(data)
      if (res.data.errno == 400) {
        uni.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    },
    async buyAgain(order) {
      const goods = order.goods.map(v => ({
        goodsId: v.goodsId,
        productId: v.productId,
        quantity: v.quantity
      }))
      await Promise.all(goods.map(v => this.addCart(v)))
      uni.navigateTo({
        url: `/sub_packages/shop/submitOrder?goodsData=${encodeURIComponent(
          JSON.stringify(order.goods)
        )}&buyType=cart`
      })
    },
    onClickOrderDetail(order) {
      uni.navigateTo({
        url: '/sub_packages/shop/orderDetail?id=' + order.id
      })
    },
    async onClickApplyRefund(order) {
      this.$refs.refundPopup.open()
    },
    closeNotePopup() {
      this.$refs.refundPopup.close()
    },
    async onClickConfirm() {
      const res = await shopApi.cancelOrderApi({
        orderId: this.order.id,
        userId: this.loginData.userId,
        // note: this.orderData.note
      })
      if (res.errno === 0) {
        uni.showToast({
          title: '申请退款成功，将在24小时内到账',
          icon: 'success'
        })
        this.$emit('getOrderListEmit')
        this.closeNotePopup()
      } else {
        uni.showToast({
          title: res.errmsg || '申请退款失败',
          icon: 'error'
        })
      }
    }
  }
}
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
  justify-content: center;
  /* 居中标题 */
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
  color: #333;
}

.popup-content {
  height: 770rpx;
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

.popup-footer {
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
</style>
