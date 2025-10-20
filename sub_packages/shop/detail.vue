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
        <view class="uni-margin-wrap">
          <swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
                  :duration="duration">
            <swiper-item>
              <view class="swiper-item uni-bg-red">A</view>
            </swiper-item>
            <swiper-item>
              <view class="swiper-item uni-bg-green">B</view>
            </swiper-item>
            <swiper-item>
              <view class="swiper-item uni-bg-blue">C</view>
            </swiper-item>
          </swiper>
        </view>
      </view>
      <view class="drug-info">
        <view class="drug-name">{{ drug.name }}</view>
        <view class="drug-price">￥{{ drug.price.toFixed(2) }}</view>
        <view class="drug-description">{{ drug.description }}</view>
      </view>
    </scroll-view>
    <view class="shop-detail-btn">
      <view class="shop-btn" @click="onClickCustomerService">客服</view>
      <view class="shop-btn" @click="onClickCart">购物车</view>
      <view class="shop-btn" @click="onClickAddCart">加入购物车</view>
      <view class="buy-button" @click="onClickBuyDrug">立即购买</view>
    </view>
  </view>
</template>
<script>
import customerNav from "@/components/customerNav.vue";
import { getDrugDetailApi } from "@/api/shopApi.js";
export default {
  components: { customerNav },
  data() {
    return {
      background: ['color1', 'color2', 'color3'],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      drug: {
        id: null,
        name: "",
        price: 0,
        description: "",
        image: "",
      },
    };
  },
  onLoad(options) {
    const drugId = options.id;
    this.fetchDrugDetail(drugId);
  },
  methods: {
    changeIndicatorDots(e) {
      this.indicatorDots = !this.indicatorDots
    },
    changeAutoplay(e) {
      this.autoplay = !this.autoplay
    },
    intervalChange(e) {
      this.interval = e.target.value
    },
    durationChange(e) {
      this.duration = e.target.value
    },
    async fetchDrugDetail(drugId) {
      const response = await getDrugDetailApi(drugId);
      if (response && response.data) {
        this.drug = response.data;
      }
    },
    onClickBuyDrug() {

    },
  },
  mounted() {
    this.fetchDrugDetail();
  },
};
</script>
<style lang="less">
.shop-detail-page {
  //background-color: #f5f5f5;
}

.drug-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;

  .image {
    width: 300rpx;
    height: 300rpx;
    border-radius: 10rpx;
  }
}

.drug-info {
  margin-bottom: 20rpx;

  .drug-name {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }

  .drug-price {
    font-size: 28rpx;
    color: #ff4444;
    margin-bottom: 10rpx;
  }

  .drug-description {
    font-size: 28rpx;
    color: #666666;
  }
}
.buy-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 600rpx;
  height: 80rpx;
  background-color: #ff4444;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 40rpx;
  margin: 0 auto;
}
</style>
<style>
.uni-margin-wrap {
  width: 690rpx;
  width: 100%;
}
.swiper {
  height: 300rpx;
}
.swiper-item {
  display: block;
  height: 300rpx;
  line-height: 300rpx;
  text-align: center;
}
.uni-bg-red {
  background-color: #ff4444;
}
.uni-bg-green {
  background-color: #44ff44;
}
.uni-bg-blue {
  background-color: #4444ff;
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
</style>
