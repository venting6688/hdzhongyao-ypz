<template>
  <view class="cart-page">
    <view v-if="cartList.length">
      <!-- 商品列表 -->
      <view v-for="(item, index) in cartList" :key="item.id" class="cart-item">
        <uni-swipe-action ref="swipeActionRefs" :key="item.id">
          <uni-swipe-action-item :right-options="swipeOptions" @click="onSwipeDelete(item)" class="swipe-item">
            <view class="cart-item-main">
              <view class="check-box">
                <uni-data-checkbox :localdata="[{ text: '', value: '1' }]" v-model="item.checkedArr"
                  selected-color="#9A7546" multiple @change="onItemCheckChange(index, $event)" />
              </view>

              <image class="item-img" :src="item.image" mode="aspectFill" />

              <view class="item-info" @click="onDetail(item.goodsId)">
                <text class="title">{{ item.name }}</text>
                <text class="spec">规格：{{ item.spec ? item.spec : '' }}</text>
                <text class="price">￥{{ item.price | formatPrice }}</text>
              </view>

              <view class="quantity-box">
                <text class="btn" :class="{'disabled-btn': item.quantity <= 7}" @click="changeQuantity(item, 'dele')">-</text>
                <text class="num">{{ item.quantity }}</text>
                <text class="btn" :class="{'disabled-btn': item.quantity >= 28}" @click="changeQuantity(item, 'add')">+</text>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>

      <!-- 底部固定区域 -->
      <view class="cart-footer">
        <view class="left">
          <uni-data-checkbox v-model="allCheckedArr" :localdata="[{ text: '', value: '1' }]" selected-color="#9A7546"
            multiple @change="toggleAll" />
          <text class="total">合计 ￥{{ totalPrice | formatPrice }}</text>
        </view>

        <view class="right">
          <view class="delete-btn" @click="onSwipeDelete(null)">删除</view>
          <view class="checkout-btn" @click="checkout">去结算</view>
        </view>
      </view>
    </view>

    <view v-else>
      <view class="empty">购物车空空如也～</view>
      <view class="to-index-btn" @tap="toIndexPage">去逛逛</view>
    </view>
  </view>
</template>

<script>
  import shopApi from '@/api/shopApi.js'

  export default {
    data() {
      return {
        userId: '',
        cartList: [],
        productIds: [],
        allCheckedArr: [],
        swipeOptions: [{
          text: '删除',
          style: {
            backgroundColor: '#f56c6c',
            color: '#fff'
          }
        }]
      }
    },
    computed: {
      totalPrice() {
        return this.cartList.reduce(
          (sum, i) => (i.checkedArr.length ? sum + i.price * i.quantity : sum),
          0
        )
      },
      isAllChecked() {
        return this.cartList.length > 0 && this.cartList.every(i => i.checkedArr.length > 0)
      }
    },
    watch: {
      cartList: {
        deep: true,
        handler() {
          this.allCheckedArr = this.isAllChecked ? ['1'] : []
        }
      }
    },
    filters: {
      formatPrice(value) {
        if (typeof value !== 'number') return '0.00'
        return (value / 100).toFixed(2)
      }
    },
    onLoad() {
      let loginValue = uni.getStorageSync('loginData')
      this.userId = loginValue != null ? loginValue.userId : ''

      this.getCartList()
    },
    methods: {
      onDetail(goodsId) {
        uni.navigateTo({
          url: `/sub_packages/shop/detail?id=${goodsId}`
        })
      },
      onItemCheckChange(index, e) {
        const checked = e.detail.value.length > 0
        this.cartList[index].checkedArr = checked ? ['1'] : []
      },
      toIndexPage() {
        uni.navigateTo({
          url: `/sub_packages/shop/index`
        })
      },
      changeQuantity(item, type) {
        if (type == 'add' && item.quantity >= 28) {
          uni.showToast({
            title: '最多购买28付',
            icon: 'none'
          })
          return
        }
        if (type == 'dele' && item.quantity <= 7) {
          uni.showToast({
            title: '最少购买7付',
            icon: 'none'
          })
          return
        }
        let goodsId = item.goodsId
        let productId = item.productId
        let data = {
          number: 7,
          goodsId,
          userId: this.userId,
          productId
        }
        if (type == 'add') {
          shopApi.addCart(data).then(res => {
            if (res.data.errno != 400) {
              this.getCartList()
            } else {
              uni.showToast({
                title: res.data.errmsg,
                icon: 'none'
              })
            }
          })
        } else {
          shopApi.minus(data).then(res => {
            if (res.data.errmsg == '执行成功') {
              this.getCartList()
            } else {
              uni.showToast({
                title: res.data.errmsg,
                icon: 'none'
              })
            }
          })
        }
      },
      async onSwipeDelete(item) {
        const res = await new Promise(resolve => {
          uni.showModal({
            title: '提示',
            content: '确定要删除该商品吗？',
            success: resolve
          })
        })

        if (res.confirm) {
          let productIds = []
          if (item == null) {
            productIds = this.cartList.filter(i => i.checkedArr.length > 0).map(v => v.productId)
          } else {
            productIds.push(item.productId)
          }
          productIds = productIds.join(',')
          let deleArr = {
            userId: this.userId,
            productIds
          }
          shopApi.deleteCart(deleArr).then(res => {
            if (res.data.errmsg == '执行成功') {
              uni.showToast({
                title: '删除成功',
                icon: 'none'
              })
              this.getCartList()
            }
          })
        }
      },
      toggleAll(e) {
        const checked = e.detail.value.length > 0
        this.cartList.forEach(i => (i.checkedArr = checked ? ['1'] : []))
      },
      checkout() {
        const selected = this.cartList.filter(i => i.checkedArr.length > 0)
        if (!selected.length) {
          return uni.showToast({
            title: '请先选择商品',
            icon: 'none'
          })
        }
        uni.navigateTo({
          url: `/sub_packages/shop/submitOrder?goodsData=${encodeURIComponent(
          JSON.stringify(selected)
        )}&buyType=cart`
        })
      },
      getCartList() {
        shopApi.cartList(this.userId).then(res => {
          this.cartList = []
          if (res.data.errmsg == '执行成功') {
            let list = res.data.data.cartList
            list.map(v => {
              this.cartList.push({
                id: v.id,
                name: v.goodsName,
                goodsId: v.goodsId,
                productId: v.productId,
                spec: v.goodsSpecifitionNameValue,
                price: v.retailPrice,
                quantity: v.number,
                checkedArr: [],
                image: v.listPicUrl
              })
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .cart-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding-bottom: 180rpx;
    padding: 25rpx;
  }

  /* 商品列表 */
  .cart-item {
    margin-bottom: 20rpx;
  }

  .swipe-item {
    width: 100%;
  }

  .cart-item-main {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 12rpx;
    padding: 40rpx 30rpx;
    box-sizing: border-box;
  }

  .check-box {
    width: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 8rpx;
  }

  .spec {
    font-size: 24rpx;
    color: #888;
    margin-bottom: 8rpx;
  }

  .price {
    font-size: 28rpx;
    color: #f60;
    font-weight: 600;
  }

  .quantity-box {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 20rpx;

    .disabled-btn {
      color: #ccc;
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  .btn {
    width: 40rpx;
    height: 40rpx;
    border: 1rpx solid #ddd;
    text-align: center;
    line-height: 37rpx;
    border-radius: 15rpx;
  }

  .num {
    width: 50rpx;
    text-align: center;
  }

  /* 底部区域 */
  .cart-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx 50rpx;
    box-sizing: border-box;
  }

  .cart-footer .left {
    display: flex;
    align-items: center;
  }

  .total {
    margin-left: 20rpx;
    font-size: 28rpx;
    color: #f60;
  }

  .right {
    display: flex;
    align-items: center;
  }

  .delete-btn {
    background: #f56c6c;
    color: #fff;
    border-radius: 50rpx;
    padding: 20rpx 35rpx;
    margin-right: 25rpx;
  }

  .checkout-btn {
    background-color: #d7b074;
    color: #fff;
    border-radius: 50rpx;
    padding: 20rpx 40rpx;
  }

  /* 空购物车 */
  .empty {
    text-align: center;
    color: #999;
    margin-top: 50%;
    font-size: 28rpx;
  }

  .to-index-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #9a7546;
    padding: 20rpx;
    border-radius: 20rpx;
    width: 50%;
    margin: auto;
    color: #fff;
    font-size: 34rpx;
    margin-top: 30rpx;
  }
</style>
