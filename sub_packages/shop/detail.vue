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
            >月售&nbsp;{{ drug.monthlySales }}</text
          >
        </view>
        <view class="drug-name">{{ drug.name }}</view>
        <view class="drug-desc">{{ drug.desc }}</view>
        <view class="divider"></view>
        <view class="delivery-info"><text class="info-label">送达</text>京东物流配送·不包邮</view>
        <view class="delivery-info">
          <text class="info-label">服务</text>
          院内药房当天<text style="color: #faaa03">16:00</text>发货·不支持退换货
        </view>
      </view>
      <view class="drug-detail">
        <view class="detail-title">-药品详情-</view>
        <view class="detail-item" v-show="drug.effect">
          <text class="detail-label">·功效作用：</text>
          <text class="detail-content">{{ drug.effect }}</text>
        </view>
        <view class="detail-item" v-show="drug.ingredients">
          <text class="detail-label">·主要成分：</text>
          <text class="detail-content">{{ drug.ingredients }}</text>

        </view>
        <view class="detail-item" v-show="drug.usage">
          <text class="detail-label">·用法用量：</text>
          <text class="detail-content">{{ drug.usage }}</text>
        </view>
        <view class="detail-item" v-show="drug.notice">
          <text class="detail-label">·注意事项：</text>
          <text class="detail-content">{{ drug.notice }}</text>
        </view>
      </view>
    </scroll-view>
    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="left">
        <view class="action-item" @click="onClickCustomerService">
          <image
            src="@/static/image/service.png"
            mode="aspectFit"
            class="icon-btn"
          ></image>
          <view>客服</view>
        </view>
        <view class="action-item" @click="onClickCart">
          <image
            src="@/static/image/shopping.png"
            mode="aspectFit"
            class="icon-btn"
          ></image>
          <view>购物车</view>
        </view>
      </view>

      <view class="right">
        <button class="add-cart" @click="onClickAddCart">加购物车</button>
        <button class="buy-now" @click="onClickBuyDrug">立即购买</button>
      </view>
    </view>
    <!--    <view class="shop-detail-btn">-->
    <!--      <view class="shop-btn" @click="onClickCustomerService">客服</view>-->
    <!--      <view class="shop-btn" @click="onClickCart">购物车</view>-->
    <!--      <view class="shop-btn" @click="onClickAddCart">加入购物车</view>-->
    <!--      <view class="buy-button" @click="onClickBuyDrug">立即购买</view>-->
    <!--    </view>-->
  </view>
</template>
<script>
import customerNav from "@/components/customerNav.vue";
import { getDrugDetailApi } from "@/api/shopApi.js";
export default {
  components: { customerNav },
  data() {
    return {
      background: ["color1", "color2", "color3"],
      interval: 2000,
      duration: 500,
      drug: {
        id: null,
        name: "",
        price: 0,
        desc: "",
      },
    };
  },
  onLoad(options) {
    const drugId = options.id;
    this.fetchDrugDetail(drugId);
  },
  methods: {
    async fetchDrugDetail(drugId) {
      this.drug = {
        id: 1,
        name: "四君子茶",
        price: 5.0,
        desc: "益气强身，健脾养胃益气强身，健脾养胃益气强身，健脾养胃益气强身，健脾养胃益气强身，健脾养胃益气强身，健脾养胃益气强身，健脾养胃益气强身，健脾养胃益气强身，健脾养胃益气强身，健脾养胃益气强身，健脾养胃",
        monthlySales: 100,
        stock: 1000,
        delivery: "京东物流配送 · 免包邮",
        service: "院内药房当天16:00发货 · 不支持退换货",
        effect: "益气强身，健脾养胃",
        ingredients: "人参6g 白术6g 茯苓6g 炙甘草3g",
        usage: "每日一剂，代茶频服。",
        notice:
          "1. 请在规定时间内到医院药房取药。2. 不支持在线支付。",
        image: "/static/image/medicine_img.png",
      };
      console.log(typeof this.drug.price);
      return;
      const response = await getDrugDetailApi(drugId);
      if (response && response.data) {
        this.drug = response.data;
      }
    },
    onClickCustomerService() {
      uni.showToast({
        title: "客服已联系",
        icon: "none",
      });
    },
    onClickCart() {
      uni.navigateTo({
        url: "/sub_packages/shop/addCart",
      });
    },
    onClickAddCart() {
      uni.showToast({
        title: "已加入购物车",
        icon: "none",
      });
    },
    onClickBuyDrug() {
      uni.navigateTo({
        url: "/sub_packages/shop/submitOrder?id=" + this.drug.id,
      });
    },
  },
  mounted() {
    this.fetchDrugDetail();
  },
};
</script>
<style scoped lang="less">
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
  .drug-name {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
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
      padding-right: 7rpx;
    }
    .drug-stock {
      border-left: solid 1px #87653a;
      padding-left: 8rpx;
      float: right;
      font-size: 24rpx;
      margin-left: 5rpx;
      color: #87653a;
    }
  }

  .drug-desc {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 15rpx;
    //display: -webkit-box;
    //-webkit-box-orient: vertical;
    //-webkit-line-clamp: 2; /* 显示两行 */
    //overflow: hidden;
    //text-overflow: ellipsis;
  }

  .divider {
    height: 1rpx;
    background-color: #F5F5F5;
    margin: 20rpx 0;
  }
  .delivery-info {
    margin: 10rpx 0;
  }

  .info-label {
    font-size: 24rpx;
    color: #999999;
    margin: 0 15rpx;
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
    .action-item {
      width: 120rpx;
      text-align: center;
      font-size: 26.92rpx;
      color: #333;
      .icon-btn {
        width: 36rpx;
        height: 36rpx;
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
      color: #87653A;
    }
    .buy-now {
      width: 200rpx;
      border-radius: 50rpx;
      background-color: #9a7546;
      color: #fff;
      font-size: 28rpx;
    }
  }
}
</style>
