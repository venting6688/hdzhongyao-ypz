<template>
  <view class="submit-order-page">
    <visitNotice
      ref="notice"
      :fontMode="fontMode"
      :noticeType="noticeType"
      @confirmed="handleConfirm"
    />
    <view class="address-card" @click="openAddressPopup">
      <uni-icons class="icon-location" size="24" type="location-filled"></uni-icons>
      <view class="address-content">
        <view v-if="JSON.stringify(defaultAddress) != '{}'">
          <view class="address-detail">
            <text class="region">{{ defaultAddress.fullRegion }}</text>
            <view>{{ defaultAddress.detailInfo }}</view>
          </view>
          <view class="user-info">
            <text class="name">{{ defaultAddress.userName }}</text>
            <text class="phone">{{ defaultAddress.telNumber }}</text>
          </view>
        </view>
        <view v-else class="no-address">请选择收货地址</view>
      </view>
      <uni-icons color="#333" size="18" type="arrowright"></uni-icons>
    </view>
    <view class="goods-card">
      <order-item :isShowFooter="false" :order="orderData"></order-item>
      <view class="item-line total-price-line">
        <text class="value actual-price">
          <text class="label shifu-text">实付</text>
          ¥{{ orderData.actualPrice | formatPrice }}
        </text>
      </view>
      <view class="item-line">
        <text class="label">配送:</text>
        <view class="value">快递运输</view>
      </view>

      <view class="item-line" @click="toEditNote">
        <text class="label">备注:</text>
        <view v-show="orderData.note" class="value note-text">
          {{ orderData.note }}
        </view>
        <view v-show="!orderData.note" class="value note-text is-empty">请给我备注</view>
        <uni-icons color="#999" size="18" type="arrowright"></uni-icons>
      </view>
    </view>
    <!-- 处方图片列表 -->
    <view class="prescription-image-list">
      <swiper
        :autoplay="false"
        :duration="500"
        :indicator-dots="true"
        :interval="2000"
        circular
        class="swiper"
      >
        <swiper-item v-for="(item, index) in imageUrlList" :key="index">
          <image :src="item" mode="aspectFit" />
        </swiper-item>
      </swiper>
    </view>

    <view class="footer-bar">
      <view class="price-summary">
        <view class="total">
          合计
          <text class="amount">¥{{ orderData.totalPrice | formatPrice }}</text>
        </view>
        <view class="delivery-fee">配送费 ¥{{ orderData.deliveryFee | formatPrice }}</view>
      </view>
      <button
        v-show="!isPrescriptionCreated"
        :class="{ 'disabled-btn': !canPay }"
        :disabled="!canPay"
        class="pay-button"
        @click="onClickCreatePrescription"
      >
        在线审方
      </button>
      <button v-show="isPrescriptionCreated" class="pay-button" @click="submitOrder">
        提交订单
      </button>
    </view>
    <uni-popup ref="addressPopup" background-color="#fff" type="bottom">
      <view class="address-popup">
        <view class="popup-header">
          <text class="popup-title">地址和配送服务</text>
          <uni-icons color="#666" size="24" type="close" @click="closeAddressPopup"></uni-icons>
        </view>
        <view class="tab-bar">
          <view class="tab-item active">常用地址</view>
          <view class="tab-right">
            <text class="manage-text" @click="goManageAddress">管理</text>
          </view>
        </view>
        <scroll-view class="address-list" scroll-y>
          <view
            v-for="(item, index) in addressList"
            :key="index"
            :class="{ active: item.id === selectedAddress.id }"
            class="address-item"
            @click="selectAddress(item)"
          >
            <view class="address-info">
              <text>{{ item.userName }}</text>
              <text class="phone">{{ item.telNumber }}</text>
              <view class="region">{{ item.fullRegion }} {{ item.detailInfo }}</view>
            </view>
            <view class="user-info"></view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
    <uni-popup ref="notePopup" background-color="#fff" type="bottom">
      <view class="popup-header">
        <text class="popup-title">订单备注</text>
        <uni-icons color="#666" size="24" type="close" @click="closeNotePopup"></uni-icons>
      </view>
      <view class="popup-content">
        <textarea
          v-model="orderData.note"
          class="note-textarea"
          maxLength="100"
          placeholder="请输入您的备注内容"
        ></textarea>
      </view>
      <view class="popup-footer">
        <button class="confirm-btn" @click="confirmNote">确认</button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import shopApi from '@/api/shopApi.js'
import registrationApi from '@/api/registrationApi'
import visitNotice from '@/components/visitNotice.vue'
import addressItem from '../components/addressItem.vue'
import orderItem from '@/sub_packages/shop/components/order-item.vue'
import dayjs from 'dayjs'
import { handleBinaryImage } from '@/utils/system.js'

export default {
  components: {
    visitNotice,
    orderItem,
    addressItem
  },
  data() {
    return {
      userId: '',
      showMain: false,
      canPay: false,
      fontMode: 'normal',
      noticeType: 'order',
      orderData: {},
      loginData: {},
      productId: null,
      defaultAddress: {},
      addressList: [],
      selectedAddress: {},
      buyType: 'buy',
      isPrescriptionCreated: false, // 是否已创建处方
      loading: false, // 加载状态
      imageUrlList: [] // 处方图片路径列表
    }
  },
  // 过滤器用于金额格式化
  filters: {
    formatPrice(value) {
      if (typeof value !== 'number') return '0.00'
      return (value / 100).toFixed(2)
    }
  },
  async onLoad(options) {
    this.showMain = false
    this.canPay = false
    this.$nextTick(() => {
      this.$refs.notice.open()
    })
    this.loginData = uni.getStorageSync('loginData') || {}
    this.userId = this.loginData ? this.loginData.userId : ''
    this.buyType = options.buyType ? options.buyType : this.buyType
    this.getDefaultAddress()

    if (options.goodsData) {
      const goods = JSON.parse(decodeURIComponent(options.goodsData))
      const newGoods = goods.map(({ id, image, goodsId, ...rest }) => ({
        id,
        img: image,
        goodsId: goodsId ? goodsId : id,
        ...rest
      }))
      this.orderData.goods = [...newGoods]
    }
    this.orderData.totalPrice = this.orderData.goods.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )
    this.orderData.actualPrice = this.orderData.totalPrice + (this.orderData.deliveryFee || 0)

    if (this.orderData.goods.length > 0) {
      if (this.buyType == 'buy') await this.getProductById(this.orderData.goods[0].id)
    }
  },
  methods: {
    async getAddressList() {
      let res = await shopApi.getAddressList(this.userId)
      if (res.statusCode == 200) {
        this.addressList = res.data.data.sort((a, b) => {
          return b.isDefault - a.isDefault
        })
      }
    },
    async openAddressPopup() {
      await this.getAddressList()
      this.$refs.addressPopup.open()
    },
    closeAddressPopup() {
      this.$refs.addressPopup.close()
    },
    selectAddress(item) {
      this.selectedAddress = item
      this.defaultAddress = item
      this.closeAddressPopup()
    },
    goManageAddress() {
      uni.navigateTo({
        url: '/sub_packages/address/index'
      })
    },
    async getDefaultAddress() {
      let res = await shopApi.defaultAddress(this.userId)
      if (res.data.errmsg == '执行成功' && res.data.data.length) {
        this.defaultAddress = res.data.data[0]
        this.selectedAddress = this.defaultAddress
      }
    },
    async getProductById(drugId) {
      const res = await shopApi.getProductById([drugId])
      if (res.length === 0) return
      if (res.data[0]) {
        this.productId = res.data[0]?.id
      }
    },
    handleConfirm() {
      this.showMain = true
      this.canPay = true
    },
    // 点击添加备注，多行输入框，最多输入100个字符
    toEditNote() {
      this.$refs.notePopup.open()
    },
    closeNotePopup() {
      this.$refs.notePopup.close()
    },
    confirmNote() {
      this.closeNotePopup()
    },

    /** 提交订单并支付 */
    async submitOrder() {
      let goodsId = this.orderData.goods.map(v => v.goodsId)
      goodsId = goodsId.join(',')
      if (!this.defaultAddress.id) {
        uni.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
      } else {
        let data = {
          number: 1,
          goodsId,
          userId: this.loginData.userId,
          productId: this.productId
        }
        if (this.buyType == 'buy') {
          const addCartRes = await shopApi.addCart(data)
          if (addCartRes.data.errno != 400) {
          } else {
            uni.showToast({
              title: addCartRes.data.errmsg,
              icon: 'none'
            })
          }
        }

        const payload = {
          goodsId,
          addressId: this.defaultAddress.id,
          userId: this.loginData.userId,
          postscript: this.orderData.note,
          type: 'cart'
        }
        const res = await shopApi.submitOrderApi(payload)
        if (res.data && res.errno == 0) {
          uni.hideLoading()
          const { orderInfo } = res.data
          const datas = {
            lockId: '',
            patientId: this.loginData.defaultArchives?.idNum,
            patientName: this.loginData.defaultArchives?.patientName,
            subOpenId: this.loginData?.xcxOpenId,
            totalAmount: String(orderInfo?.actualPrice),
            merOrderId: orderInfo?.orderSn,
            uploadData: {},
            payType: 'shopPay',
            expireTime: dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
          }
          const resRegister = await registrationApi.registerOrder(datas)
          this.startPayment(resRegister, orderInfo)
        } else {
          uni.hideLoading()
          uni.showToast({
            title: '提交订单失败',
            icon: 'none'
          })
        }
      }
    },

    /** 启动支付流程 */
    startPayment({ data }, { id, orderSn }) {
      if (!data?.miniPayRequest || !orderSn) throw new Error('缺少支付参数')
      // 这里调用 uni.requestPayment 发起微信/支付宝支付
      uni.requestPayment({
        provider: 'wxpay', // 服务提提供商
        timeStamp: data.miniPayRequest.timeStamp, // 时间戳
        nonceStr: data.miniPayRequest.nonceStr, // 随机字符串
        package: data.miniPayRequest.package,
        signType: data.miniPayRequest.signType, // 签名算法
        paySign: data.miniPayRequest.paySign, // 签名
        // expireTime: ,
        success: async result => {
          uni.showToast({
            title: '支付成功',
            icon: 'success'
          })
          const res = await shopApi.updateSuccessApi({
            orderId: id,
            orderSn: orderSn,
            userId: this.loginData.userId
          })
          if (res.errno === 0) {
            uni.navigateTo({ url: '/sub_packages/shop/orderDetail?id=' + id })
          } else {
            uni.showToast({
              title: res.errmsg || '支付失败',
              icon: 'error'
            })
          }
        },
        fail: result => {
          uni.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
      })
    },
    // 开处方
    async onClickCreatePrescription() {
      uni.showLoading({
        title: '加载中'
      })

      const localImageUrlList = []
      await Promise.all(
        this.orderData.goods.map(async ({ quantity, effect, ingredients, usage }) => {
          const newIngredients = ingredients?.toString()
            .split('、')
            .map(item => ({
              name: item
            })) || []
          const res = await shopApi.createPrescription({
            params: {
              hospitalName: '青岛市黄岛区第二中医医院',
              prescriptionNo: '025120900212',
              prescriptionType: '普通',
              department: '中医内科',
              feeType: '自费',
              date: dayjs().format('YYYY-MM-DD'),
              patientName: this.loginData.defaultArchives?.patientName,
              gender: this.loginData.defaultArchives?.gender,
              age: (this.loginData.defaultArchives?.age).toString(),
              registerNo: '12345678',
              diagnosis: effect,
              usage: usage,
              takeWay: '温服',
              doseCount: `${quantity}剂`,
              doctorName: '马强',
              dispenser: '崔璀',
              amount: (this.orderData.totalPrice / 100).toFixed(2)
            },
            medicines: newIngredients
          })
          localImageUrlList.push(handleBinaryImage(res))
        })
      )

      setTimeout(() => {
        uni.hideLoading()
        this.imageUrlList = [...localImageUrlList]
        this.isPrescriptionCreated = true
        if (this.imageUrlList.length === this.orderData.goods.length) {
          uni.showToast({
            title: '开处方成功',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: res.errmsg || '开处方失败',
            icon: 'error'
          })
        }
      }, 1000)
    }
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

.submit-order-page {
  padding-bottom: 150rpx;
  background-color: #f5f5f5;
  min-height: 100vh;

  .address-popup {
    display: flex;
    flex-direction: column;
    height: 60vh;
    background: #fff;
    border-top-left-radius: 30rpx;
    border-top-right-radius: 30rpx;
    /* 不要 overflow:hidden，这会阻止子级滚动 */
    overflow: visible;
  }

  /* 顶部标题栏 */
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

  .note-textarea {
    width: 95%;
    height: 350rpx;
    padding: 20rpx;
    margin: 20rpx auto;
    font-size: 28rpx;
    border: 1rpx solid #ccc;
    border-radius: 12rpx;
    resize: none;
    background-color: #f5f5f5;
  }

  .popup-content {
    height: 770rpx;
  }

  .confirm-btn {
    background-color: #9a7546;
    color: @card-bg;
    border: none;
    border-radius: 50rpx;
    font-size: 32rpx;
    width: 95%;
    margin-bottom: 20rpx;
  }

  /* 标签栏 */
  .tab-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
  }

  .tab-item {
    font-size: 34rpx;
    font-weight: bold;
    color: #333;
  }

  .tab-right {
    display: flex;
    gap: 30rpx;
  }

  .manage-text {
    color: #333;
  }

  .add-text {
    color: #ff6600;
  }

  /* 地址列表 */
  .address-list {
    flex: 1;
    overflow-y: auto;
    /* 兼容非小程序端 */
    max-height: 100%;
    /* 保证 scroll-view 可滚动 */
  }

  .address-item {
    background: #fff;
    padding: 25rpx;
    border-radius: 16rpx;
    margin-bottom: 15rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    border-bottom: 1px solid #f5f5f5;
  }

  .address-item.active {
    background: #fff8f2;
    /* 选中时背景色 */
    // border: 1rpx solid #ff6600;
  }

  .address-info {
    flex: 1;
    font-size: 28rpx;
    color: #333;

    .phone {
      margin-left: 30rpx;
    }
  }

  .region {
    color: #999;
    font-size: 24rpx;
  }

  .user-info {
    display: flex;
    gap: 10rpx;
    font-size: 24rpx;
    color: #666;
  }

  .default-tag {
    color: #ff6600;
  }

  .more-address {
    text-align: center;
    color: #666;
    padding: 20rpx 0;
  }

  .prescription-image-list {
    margin-bottom: 20rpx;
    .swiper {
      height: 900rpx;
      image {
        height: 900rpx;
        display: block;
        margin: 0 auto;
      }
    }
  }
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
