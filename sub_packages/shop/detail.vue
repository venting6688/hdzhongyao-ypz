<template>
  <view class="shop-detail-page">
    <!--    <customer-nav :title="'商品详情'" />-->
    <scroll-view
      class="shop-detail-content"
      scroll-y
      :style="{
        'margin-top': barHeight + 'px',
        'margin-bottom': footData.isShow ? footData.height + 'px' : '0px',
      }"
    >
      <view class="drug-image">
        <swiper
          class="swiper"
          circular
          :indicator-dots="false"
          :autoplay="false"
          :interval="interval"
          :duration="duration"
        >
          <swiper-item>
            <image :src="drug.image" class="detail-swiper-item"></image>
          </swiper-item>
          <swiper-item>
            <image :src="drug.image" class="detail-swiper-item"></image>
          </swiper-item>
          <swiper-item>
            <image :src="drug.image" class="detail-swiper-item"></image>
          </swiper-item>
        </swiper>
      </view>
      <view class="drug-info">
        <view class="drug-price">
          ￥{{ Number(drug.price).toFixed(2) }}
          <text class="drug-stock">库存&nbsp;{{ drug.stock }}</text>
          <text class="drug-monthly-sales"
            >已售出&nbsp;{{ drug.salesVolume }}</text
          >
        </view>
        <view class="drug-name">{{ drug.name }}</view>
        <view class="drug-desc">{{ drug.desc }}</view>
        <!--                <view class="divider"></view>-->
        <!--        <view class="delivery-info"-->
        <!--          ><text class="info-label">送达</text>京东物流配送·不包邮</view-->
        <!--        >-->
        <view class="delivery-info">
          <text class="info-label">服务</text>
          <text class="info-value">{{ serviceText }}</text>
        </view>
      </view>
      <view class="drug-detail">
        <view class="detail-title">-药品详情-</view>
        <view class="detail-item" v-if="drug.effect">
          <text class="detail-label">·功效作用：</text>
          <text class="detail-content">{{ drug.effect }}</text>
        </view>
        <view class="detail-item" v-if="drug.ingredients">
          <text class="detail-label">·主要成分：</text>
          <text class="detail-content">{{ drug.ingredients }}</text>
        </view>
        <view class="detail-item" v-if="drug.usage">
          <text class="detail-label">·用法用量：</text>
          <text class="detail-content">{{ drug.usage }}</text>
        </view>
        <view class="detail-item" v-if="drug.notice">
          <text class="detail-label">·注意事项：</text>
          <text class="detail-content">{{ drug.notice }}</text>
        </view>
      </view>
    </scroll-view>
    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="left">
        <view class="action-item" @click="onClickCustomerService">
          <view class="icon-box">
            <image
              src="@/static/image/service.png"
              mode="aspectFit"
              class="icon-btn"
            />
          </view>
          <view class="cart-text">客服</view>
        </view>
        <view class="action-item cart-tab" @click="onClickCart">
          <view class="icon-box">
            <image
              class="cart-icon"
              src="@/static/image/shopping.png"
              mode="aspectFit"
            />
            <view v-if="cartCount > 0" class="badge">{{ cartCount }}</view>
          </view>
          <text class="cart-text">购物车</text>
          <view class="underline"></view>
        </view>
      </view>

      <view class="right">
        <button class="add-cart" @click="onClickAddCart">加购物车</button>
        <button class="buy-now" @click="onClickBuyDrug">在线开方</button>
      </view>
    </view>
    <uni-popup ref="popup" type="bottom" background-color="#fff">
      <view class="popup-content"> 客服电话：0532 88191639 </view>
    </uni-popup>
  </view>
</template>
<script>
import customerNav from "@/components/customerNav.vue";
import shop from "@/api/shopApi.js";

export default {
  components: { customerNav },
  data() {
    return {
      userId: "",
      isLogin: false,
      productIds: "",
      cartCount: 0,
      background: ["color1", "color2", "color3"],
      interval: 2000,
      duration: 500,
      drug: {
        id: null,
        name: "",
        price: 0,
        desc: "",
      },
      serviceText:
        "药品配送业务由第三方快递公司承接，由不可预知的缘故导致的药品配送延误，由患者本人与ム江递公司协商解决。药品离柜进入配送环节之后，无特殊原因，不予退换。",
    };
  },
  onLoad(options) {
    let loginValue = uni.getStorageSync("loginData");
    this.userId = loginValue != null ? loginValue.userId : "";
    this.isLogin = this.userId ? true : false;
    const drugId = options.id;
    this.fetchDrugDetail(drugId);
    this.getPorductId([drugId]);
    this.getCartList();
  },
  onShow() {
    let loginValue = uni.getStorageSync("loginData");
    this.userId = loginValue != null ? loginValue.userId : "";
    this.isLogin = this.userId ? true : false;
  },
  methods: {
    async getPorductId(goodsid) {
      let res = await shop.getProductById(goodsid);
      if (res.statusCode == 200 && res.data.length) {
        let productId = [];
        res.data.map((v) => {
          productId.push(v.id);
        });
        this.productIds = productId.join(",");
      }
    },
    getCartList() {
      shop.cartList(this.userId).then((res) => {
        if (res.data.errmsg == "执行成功") {
          this.cartCount = res.data.data.cartTotal.goodsCount;
        }
      });
    },
    async fetchDrugDetail(drugId) {
      const res = await shop.getDrugDetailApi({ drugId, userId: 23 });
      if (res && res.data) {
        const { info, specificationList } = res.data || {};
        let detailData = {};
        if (
          specificationList &&
          specificationList.length > 0 &&
          "valueList" in specificationList[0]
        ) {
          detailData = specificationList?.[0]?.valueList?.[0];
        }
        this.drug = {
          id: info.id || null,
          name: info.name || "",
          price: info.retailPrice || 0,
          desc: info.goodsDesc || "",
          salesVolume: detailData.salesVolume || 0,
          stock: info.goodsNumber || 0,
          // delivery: INFO.delivery,
          // service: INFO.service,
          effect: detailData.efficacy || "",
          ingredients: detailData.mainIngredients || "",
          usage: detailData.usageDosage || "",
          notice: detailData.thingsToNote || "",
          image: info.listPicUrl,
        };
      } else {
        uni.showToast({
          title: "获取商品详情失败",
          icon: "none",
        });
      }
    },
    onClickCustomerService() {
      this.$refs.popup.open("bottom");
    },
    onClickCart() {
      this.loginCheck();
      if (this.isLogin) {
        uni.navigateTo({
          url: "/sub_packages/shop/addCart",
        });
      }
    },
    onClickAddCart() {
      this.loginCheck();
      if (this.isLogin) {
        let data = {
          number: 1,
          goodsId: this.drug.id,
          userId: this.userId,
          productId: this.productIds,
        };
        shop.addCart(data).then((res) => {
          if (res.data.errno != 400) {
            uni.showToast({
              title: "已加入购物车",
              icon: "none",
            });
            this.getCartList();
          } else {
            uni.showToast({
              title: res.data.errmsg,
              icon: "none",
            });
          }
        });
      }
    },
    onClickBuyDrug() {
      this.loginCheck();
      if (this.isLogin) {
        const goodsData = [{
          ...this.drug,
          quantity: 1,
        }];
        uni.navigateTo({
          url: `/sub_packages/shop/submitOrder?goodsData=${encodeURIComponent(JSON.stringify(goodsData))}`,
        });
      }
    },
    //   登陆判断
    loginCheck() {
      const loginData = uni.getStorageSync("loginData");
      if (!loginData) {
        // 未登录，跳转登录页
        uni.navigateTo({
          url: "/sub_packages/login/index?title=青岛西海岸新区第二中医医院&isBackLastPage=true",
        });
      } else {
        this.isLogin = true;
      }
    },
  },
};
</script>
<style scoped lang="less">
.popup-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #fff;
  margin-bottom: 20rpx;
}
.shop-detail-page {
  //background-color: #f5f5f5;
}

.drug-image {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 0 32rpx 20rpx;
  .image {
    width: 300rpx;
    height: 300rpx;
    border-radius: 10rpx;
  }
}

.drug-info {
  padding: 0 32rpx 25rpx;
  background-color: #fff;
  border-top: 1px solid #fff;
  .drug-name {
    font-size: 32rpx;
    font-weight: bold;
    margin: 15rpx 0 20rpx;
  }

  .drug-price {
    color: #faaa03;
    font-size: 38.17rpx;
    font-weight: 600;
    margin: 3rpx 5rpx 5rpx 0;
    .drug-monthly-sales {
      float: right;
      font-size: 24rpx;
      color: #87653a;
      font-weight: 500;
      padding-right: 70rpx;
    }
    .drug-stock {
      //border-left: solid 1px #87653a;
      padding-left: 8rpx;
      float: right;
      font-size: 24rpx;
      margin-left: 5rpx;
      color: #87653a;
      font-weight: 500;
    }
  }

  .drug-desc {
    font-size: 28rpx;
    color: #666666;
    padding-bottom: 20rpx;
    border-bottom: 1px solid #f5f5f5;
    //display: -webkit-box;
    //-webkit-box-orient: vertical;
    //-webkit-line-clamp: 2; /* 显示两行 */
    //overflow: hidden;
    //text-overflow: ellipsis;
  }

  .divider {
    height: 1rpx;
    background-color: #f5f5f5;
    margin: 20rpx 0;
  }
  .delivery-info {
    margin: 15rpx 0 10rpx;
    font-size: 24rpx;
    display: flex;

    .info-label {
      color: #999999;
      margin: 0 15rpx 0 0;
      width: 150rpx;
    }
  }
}

.drug-detail {
  margin: 27rpx 17rpx;
  padding: 24rpx;
  border: 1px solid #eee;
  border-radius: 12rpx;
  background-color: #fff;
  //background-origin: content-box;

  .detail-title {
    text-align: center;
    font-weight: bold;
    margin-bottom: 30rpx;
    font-size: 31rpx;
  }
  .detail-item {
    display: flex;
    margin-bottom: 35rpx;
    font-size: 26rpx;
    .detail-label {
      flex: none;
      color: #666666;
      //margin: 0 10rpx;
      width: 150rpx;
    }
    .detail-content {
    }
  }
}

.swiper {
  box-sizing: border-box;
  margin: 10rpx auto;
  width: 100%;
  height: 350rpx;
  * {
    box-sizing: border-box;
  }
}
.detail-swiper-item {
  display: block;
  height: 100%;
  width: 100%;
  border-radius: 25rpx;
}

.swiper-list {
  margin-top: 40rpx;
  margin-bottom: 0;
}
.uni-common-mt {
  margin-top: 60rpx;
  position: relative;
}
.info {
  position: absolute;
  right: 20rpx;
}
.uni-padding-wrap {
  width: 550rpx;
  padding: 0 100rpx;
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 160rpx;
  background: #fff;
  border-top: 1px solid #eee;
  justify-content: space-between;
  z-index: 99;
  padding: 24rpx 20rpx 50rpx;
  .left {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 20rpx;
    flex: 1;
    .icon-box {
      position: relative;
      width: 50rpx;
      height: 50rpx;
    }
    .cart-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .cart-icon {
        width: 50rpx;
        height: 50rpx;
      }
      .badge {
        position: absolute;
        top: 0rpx;
        right: -10rpx;
        background-color: #ffb400;
        color: #fff;
        font-size: 20rpx;
        border-radius: 50%;
        min-width: 28rpx;
        height: 28rpx;
        line-height: 28rpx;
        text-align: center;
      }
    }
    .cart-text {
      margin-top: 6rpx;
      font-size: 24rpx;
      color: #333;
    }
    .action-item {
      text-align: center;
      font-size: 24rpx;
      color: #333;
      .icon-btn {
        width: 50rpx;
        height: 50rpx;
        margin-right: 10rpx;
      }
    }
  }

  .right {
    width: 450rpx;
    display: flex;
    justify-content: space-around;
    height: 73rpx;
    .add-cart {
      width: 200rpx;
      border-radius: 50rpx;
      border: #9a7546 1px solid;
      font-size: 28rpx;
      color: #87653a;
      line-height: 73rpx;
    }
    .buy-now {
      width: 200rpx;
      border-radius: 50rpx;
      background-color: #9a7546;
      color: #fff;
      font-size: 28rpx;
      line-height: 73rpx;
    }
  }
}
</style>
