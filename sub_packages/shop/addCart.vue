<template>
  <view class="cart-page">
    <view v-if="cartList.length">
      <!-- 商品列表 -->
      <view
        v-for="(item, index) in cartList"
        :key="item.id"
        class="cart-item"
				@click="onDetail(item.goodsId)"
      >
        <uni-swipe-action ref="swipeActionRefs" :key="item.id">
          <uni-swipe-action-item
            :right-options="swipeOptions"
            @click="onSwipeDelete(item)"
            class="swipe-item"
          >
            <view class="cart-item-main">
              <view class="check-box">
                <uni-data-checkbox
                  :localdata="[{ text: '', value: '1' }]"
                  v-model="item.checkedArr"
                  selected-color="#9A7546"
                  multiple
                  @change="onItemCheckChange(index, $event)"
                />
              </view>

              <image class="item-img" :src="item.image" mode="aspectFill" />

              <view class="item-info">
                <text class="title">{{ item.name }}</text>
                <text class="spec">规格：{{ item.spec }}</text>
                <text class="price">￥{{ item.price }}</text>
              </view>

              <view class="quantity-box">
                <text class="btn" @click="changeQuantity(index, -1)">-</text>
                <text class="num">{{ item.quantity }}</text>
                <text class="btn" @click="changeQuantity(index, 1)">+</text>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>

      <!-- 底部固定区域 -->
      <view class="cart-footer">
        <view class="left">
          <uni-data-checkbox
            v-model="allCheckedArr"
            :localdata="[{ text: '', value: '1' }]"
            selected-color="#9A7546"
						multiple
            @change="toggleAll"
          />
          <text class="total">合计 ￥{{ totalPrice.toFixed(2) }}</text>
        </view>

        <view class="right">
          <view class="delete-btn" @click="deleteSelected">删除</view>
          <view class="checkout-btn" @click="checkout">去结算</view>
        </view>
      </view>
    </view>

    <view v-else class="empty">购物车为空</view>
  </view>
</template>

<script>
import shopApi from "@/api/shopApi.js";

export default {
  data() {
    return {
			userId: '',
      cartList: [],
			productIds: [],
      allCheckedArr: [],
      swipeOptions: [
        { text: '删除', style: { backgroundColor: '#f56c6c', color: '#fff' } }
      ],
    };
  },
  computed: {
    totalPrice() {
      return this.cartList.reduce((sum, i) => i.checkedArr.length ? sum + i.price * i.quantity : sum, 0);
    },
    isAllChecked() {
      return this.cartList.length > 0 && this.cartList.every(i => i.checkedArr.length > 0);
    },
  },
  watch: {
    cartList: {
      deep: true,
      handler() {
        this.allCheckedArr = this.isAllChecked ? ['1'] : [];
      },
    },
  },
	onLoad() {
		let loginValue = uni.getStorageSync("loginData");
		this.userId = loginValue != null ? loginValue.userId : '';
		
		this.getCartList();
	},
  methods: {
		onDetail(goodsId) {
			uni.navigateTo({
			  url: `/sub_packages/shop/detail?id=${goodsId}`,
			});
		},
    onItemCheckChange(index, e) {
      const checked = e.detail.value.length > 0;
      this.cartList[index].checkedArr = checked ? ['1'] : [];
    },
    changeQuantity(index, delta) {
      const qty = Math.max(1, this.cartList[index].quantity + delta);
      this.cartList[index].quantity = qty;
    },
    async onSwipeDelete(item) {
      const res = await new Promise((resolve) => {
        uni.showModal({
          title: '提示',
          content: '确定要删除该商品吗？',
          success: resolve,
        });
      });
    
      if (res.confirm) {
        // 等待异步方法执行完
        await this.getPorductIds([item.goodsId]);
				let deleArr = {
					userId: this.userId,
					productIds: this.productIds,
				}
				shopApi.deleteCart(deleArr).then((res) => {
					if (res.data.errmsg == '执行成功') {
						uni.showToast({ title: '删除成功', icon: 'none' });
						this.getCartList();
					}
				});
      }
    },
    toggleAll(e) {
      const checked = e.detail.value.length > 0;
      this.cartList.forEach(i => i.checkedArr = checked ? ['1'] : []);
    },
    deleteSelected() {
      this.cartList = this.cartList.filter(i => i.checkedArr.length === 0);
      uni.showToast({ title: '删除成功', icon: 'none' });
    },
    checkout() {
      const selected = this.cartList.filter(i => i.checkedArr.length > 0);
      if (!selected.length) {
        return uni.showToast({ title: '请先选择商品', icon: 'none' });
      }
      uni.navigateTo({ url: '/pages/orderConfirm/orderConfirm' });
    },
		getCartList() {
			shopApi.cartList(this.userId).then((res) => {
				this.cartList = [];
				if (res.data.errmsg == '执行成功') {
					let list = res.data.data.cartList;
					list.map(v => {
						this.cartList.push({
							id: v.id, 
							name: v.goodsName, 
							goodsId: v.goodsId,
							spec: v.goodsSpecifitionNameValue, 
							price: v.retailPrice, 
							quantity: v.number, 
							checkedArr: [], 
							image: v.listPicUrl
						})
					})
					
				}
			});
		},
		
		async getPorductIds(ids) {
			let res = await shopApi.getProductById(goodsIds);
			if (res.statusCode == 200 && res.data.length) {
				let productId = [];
				res.data.map(v => {
					productId.push(v.id)
				})
				this.productIds = productId.join(",")
			}
		}
  },
};
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #F5F5F5;
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
  padding: 20rpx;
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
}
.btn {
  width: 40rpx;
  height: 40rpx;
  border: 1rpx solid #ddd;
  text-align: center;
  line-height: 40rpx;
  border-radius: 25rpx;
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
  margin-top: 200rpx;
  font-size: 28rpx;
}
</style>
