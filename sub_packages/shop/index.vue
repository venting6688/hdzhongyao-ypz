<template>
  <scroll-view class="shop-layout pageBg shopPageBg" scroll-y>
    <customerNav title=" " />
    <view :style="{ top: barHeight + 'px' }" class="goBack" @click="goBack">
      <uni-icons color="#fff" size="15" type="back"></uni-icons>
    </view>
    <view class="shop-header">
      <image
        class="header-image"
        mode="aspectFit"
        src="../../static/image/shop-slogan.png"
      />
      <view class="search-bar">
        <uni-search-bar
          v-model="searchValue"
          :focus="true"
          :radius="100"
          cancelButton="none"
          @confirm="onConfirmSearch"
        ></uni-search-bar>
      </view>
    </view>
    <view class="shop-content">
      <view class="shop-filter">
        <customTag
          class="filter-tag"
          v-for="item in tagList"
          :key="item.text"
          :isActive="item.isActive"
          :text="item.text"
          @click.native="onClickTag(item)"
        ></customTag>
      </view>
      <view class="shop-title">
        <text class="shop-title-text-left"> 协定方配药 </text>
        <text class="shop-title-text-right"> 共100个药品 </text>
      </view>
      <view
        v-for="item in drugList"
        :key="item.id"
        @click="goDetail(item)"
      >
        <view class="drug-item">
          <view class="image-box">
            <image :src="item.image" class="drug-image" mode="aspectFill" />
          </view>

          <view class="drug-info">
            <view class="drug-name">{{ item.name }}</view>
            <view class="drug-desc">{{ item.desc }}</view>
            <view class="drug-price">
              <text class="price-value"> ¥{{ item.price }} </text>
              /付
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>
<script>
import { getDrugListApi } from "@/api/shopApi.js";
import customerNav from "@/components/customerNav.vue";
import { getStatusBarHeight } from "@/utils/system.js";
import customTag from "@/components/customTag.vue";

export default {
  components: { customerNav, customTag },
  data() {
    return {
      searchValue: "",
      drugList: [],
      tagList: [
        {
          text: "全部",
          isActive: true,
        },
        {
          text: "夏季养生",
          isActive: false,
        },
        {
          text: "秋季养生",
          isActive: false,
        },
        {
          text: "消化调理",
          isActive: false,
        },
        {
          text: "价格最高",
          isActive: false,
        },
        {
          text: "价格最低",
          isActive: false,
        },
      ],
    };
  },
  onLoad() {
    this.getList();
  },
  computed: {
    barHeight() {
      return getStatusBarHeight() + 5;
    },
  },
  methods: {
    onClickTag(tag) {
      this.tagList.forEach((item) => {
        item === tag ? (item.isActive = true) : (item.isActive = false);
      });
    },
    async getList() {
      this.drugList = [
        {
          id: 1,
          name: "清心去火方",
          price: 10.0,
          image:
            "../../static/image/shop_medicine_img.png",
          desc: "描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述",
        },
        {
          id: 2,
          name: "健脾消积方",
          price: 20.99,
          image:
            "../../static/image/shop_medicine_img.png",
          desc: "描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述",
        },
        {
          id: 3,
          name: "通便方",
          price: 30.66,
          image:
            "../../static/image/shop_medicine_img.png",
          desc: "描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述",
        },
        {
          id: 4,
          name: "祛湿方",
          price: 30.88,
          image:
            "../../static/image/shop_medicine_img.png",
          desc: "描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述",
        },
        // {
        //   id: 5,
        //   name: "止咳药",
        //   price: 30.44,
        //   image:
        //     "../../static/image/shop_medicine_img.png",
        //   desc: "用于治疗咳嗽、咳嗽等症状",
        // },
      ];
      return;
      const res = await getDrugListApi({
        ownerUserId: "",
        search: this.searchValue,
        filter: this.tagList.find((item) => item.isActive)?.text || "",
      });
      if (res.code === 200) {
        this.drugList = res.data;
      } else {
        uni.showToast({
          title: res.message || "获取药品列表失败",
          icon: "none",
        });
      }
    },
    goDetail(item) {
      uni.navigateTo({
        url: `/sub_packages/shop/detail?id=${item.id}`,
      });
    },
    onConfirmSearch() {
      console.log(this.searchValue);
      this.getList();
    },
    goBack() {
      uni.navigateBack({
        success: () => {},
        fail: (err) => {
          uni.reLaunch({
            url: "/pages/home/index",
          });
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.shop-layout {
  padding: 0;
  justify-content: flex-start;
  //background-color: #f5f5f5;

  .shop-header {
    //height: 300rpx;
    //padding: 0 20rpx;
    background-image: url("../../static/image/shop-bg.png");
    background-repeat: no-repeat;
    .header-image {
      padding: 0 40rpx;
      width: 100%;
      height: 150rpx;
    }
    .search-bar {
      padding: 20rpx 0;
    }
  }

  .shop-content {
    .shop-filter {
      width: 100%;
      margin: 20rpx 0;
      height: 60rpx;
      //  实现左右滑动
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      .filter-tag {
        margin: 0 6rpx;
      }
    }
    // 隐藏滚动条
    .shop-filter::-webkit-scrollbar {
      display: none;
    }

    .shop-title {
      padding: 0 20rpx;
      .shop-title-text-left {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 30rpx;
      }

      .shop-title-text-right {
        font-size: 28rpx;
        //font-weight: bold;
        margin-bottom: 30rpx;
        float: right;
        color: #666666;
      }
    }

    .drug-item {
      //padding: 0 20rpx;
      display: flex;

      //display: grid;
      //grid-template-columns: 150rpx 3fr 2fr;
      //grid-template-rows: 100px 200px;

      padding: 10rpx;
      background-color: #fff;
      border-radius: 10rpx;
      margin: 35rpx 20rpx;

      .image-box {
        display: flex;
        align-items: center; // 垂直居中
        .drug-image {
          width: 180rpx;
          height: 200rpx;
          margin: 12rpx;
          border-radius: 10rpx;
          flex: none;
        }
      }

      .drug-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        //flex: 1;
        margin: 10rpx;

        .drug-name {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 10rpx;
        }

        .drug-desc {
          font-size: 28rpx;
          color: #666666;
          margin-bottom: 15rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; /* 显示两行 */
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .drug-price {
          font-size: 24rpx;

          .price-value {
            color: #faaa03;
            font-size: 36rpx;
            font-weight: 500;
            margin-right: 5rpx;
          }
        }
      }
    }
  }
}
</style>
