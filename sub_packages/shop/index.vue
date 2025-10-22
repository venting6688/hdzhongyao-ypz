<template>
  <view class="shop-layout pageBg shopPageBg">
    <!-- 顶部导航 -->
    <customerNav title=" " />
    <view :style="{ top: barHeight + 'px' }" class="goBack" @click="goBack">
      <uni-icons color="#fff" size="15" type="back"></uni-icons>
    </view>

    <!-- 头部区域：图片 + 搜索框 -->
    <view class="shop-header">
      <image
        class="header-image"
        mode="aspectFit"
        src="../../static/image/shop-slogan.png"
      />
      <view class="search-bar">
        <uni-search-bar
          v-model="searchValue"
          :radius="100"
          cancelButton="none"
          @confirm="onConfirmSearch"
          @clear="onClearSearch"
        ></uni-search-bar>
      </view>
    </view>

    <!-- 分类和列表区域 -->
    <view class="medicine-page">
      <!-- 分类横向滚动 -->
      <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
        <view
          v-for="(item, index) in categories"
          :key="index"
          class="category-item"
          :class="{ active: currentCategory === index }"
          @tap="changeCategory(index)"
        >
          {{ item }}
        </view>
      </scroll-view>

      <!-- 分类标题 -->
      <view class="category-title">
        <text class="title">协定方配药</text>
        <text class="total">共{{ total }}个药品</text>
      </view>

      <!-- 商品列表 -->
      <scroll-view scroll-y class="list-scroll" :style="{ height: listHeight + 'px' }" @scrolltolower="loadMore">
        <view
          class="list-item"
          v-for="(item, index) in displayedList"
          :key="index"
        >
          <image class="item-img" :src="item.image" mode="aspectFill" />
          <view class="item-info">
            <view class="item-name">{{ item.name }}</view>
            <view class="item-desc">{{ item.desc }}</view>
            <view class="item-desc">{{ item.category }}</view>
            <view class="item-price">￥{{ item.price }}</view>
          </view>
        </view>

        <!-- 加载状态 -->
        <view v-if="loading" class="load-text">加载中...</view>
        <view v-else-if="noMore" class="load-text">没有更多了</view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import shopApi from "@/api/shopApi.js";
import customerNav from "@/components/customerNav.vue";
import { getStatusBarHeight } from "@/utils/system.js";
import customTag from "@/components/customTag.vue";

export default {
  components: { customerNav, customTag },
  data() {
    return {
			listHeight: 0,
      searchValue: "",
      categories: ["全部"],
      currentCategory: 0,
      list: [],
      filteredList: [],
      displayedList: [],
      total: 0,
      page: 1,
      pageSize: 6,
      loading: false,
      noMore: false,
    };
  },
  onLoad() {
    this.initList();
		uni.getSystemInfo({
			success: (res) => {
				// 总屏幕高度 - 顶部 header - 分类 - 分类标题 - 状态栏
				const topHeight = 150 + 20 + 50; // header图片+搜索+分类+标题大约高度
				this.listHeight = res.windowHeight - topHeight - this.barHeight;
			}
		});
  },
  computed: {
    barHeight() {
      return getStatusBarHeight() + 5;
    },
  },
  methods: {
    goBack() {
      uni.navigateBack({
        success: () => {},
        fail: () => {
          uni.reLaunch({ url: "/pages/home/index" });
        },
      });
    },

    goDetail(item) {
      uni.navigateTo({
        url: `/sub_packages/shop/detail?id=${item.id}`,
      });
    },

    initList() {
      shopApi.getTypes().then((res) => {
        if (res.statusCode === 200 && res.data.data) {
          const data = res.data.data;
          const categoryList = data.categoryList || [];

          this.categories = ["全部"];
          this.list = [];

          categoryList.forEach((val) => {
            if (val.subCategoryList && val.subCategoryList.length > 0) {
              val.subCategoryList.forEach((sub) => {
                this.categories.push(sub.name);

                if (sub.goodsVosList && sub.goodsVosList.length > 0) {
                  sub.goodsVosList.forEach((goods) => {
                    this.list.push({
                      id: goods.id,
                      name: goods.name,
                      desc: goods.goodsDesc,
                      price: goods.retailPrice,
                      image: goods.primaryPicUrl,
                      category: sub.name,
                    });
                  });
                }
              });
            }
          });

          this.filterList();
        }
      });
    },

    // 分类切换
    changeCategory(index) {
      this.currentCategory = index;
      this.page = 1;
      this.noMore = false;
      this.displayedList = [];
      this.filterList();
    },

    // 点击搜索确认
    onConfirmSearch() {
      this.page = 1;
      this.noMore = false;
      this.displayedList = [];
      this.filterList();
    },

    // 点击搜索框叉号清空
    onClearSearch() {
      this.searchValue = "";
      this.page = 1;
      this.noMore = false;
      this.displayedList = [];
      this.filterList();
    },

    // 根据分类和搜索关键字过滤
    filterList() {
      const current = this.categories[this.currentCategory];
      this.filteredList = this.list.filter((item) => {
        const matchCategory = current === "全部" || item.category === current;
        const matchSearch =
          !this.searchValue || item.name.includes(this.searchValue);
        return matchCategory && matchSearch;
      });
      this.total = this.filteredList.length;
      this.loadMore();
    },

    // 触底加载更多
    loadMore() {
      if (this.loading || this.noMore) return;
      this.loading = true;

      setTimeout(() => {
        const start = (this.page - 1) * this.pageSize;
        const end = start + this.pageSize;
        const newData = this.filteredList.slice(start, end);

        if (newData.length) {
          this.displayedList = this.displayedList.concat(newData);
          this.page++;
        } else {
          this.noMore = true;
        }

        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style scoped lang="scss">
.shop-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; // 结合方法3自适应屏幕高度
  padding: 0;

  .shop-header {
    background-image: url("@/static/image/shop-bg.png");
    background-repeat: no-repeat;
		z-index: 99;

    .header-image {
      padding: 0 40rpx;
      width: 100%;
      height: 150rpx;
    }

    .search-bar {
      padding: 20rpx 0;
      ::v-deep .uni-searchbar__box {
        border: 1px solid #666;
      }
    }
  }

  .medicine-page {
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: #f8f8f8;
  }
  
  .list-scroll {
    flex: 1;
    min-height: 100px; /* 防止内容过少无法触发scrolltolower */
  }

  .category-scroll {
    display: flex;
    white-space: nowrap;
    padding: 16rpx 0;
  }

  .category-item {
    display: inline-block;
    margin: 0 20rpx;
    padding: 12rpx 28rpx;
    font-size: 28rpx;
    border-radius: 30rpx;
    background-color: #fff;
    color: #555;
  }

  .category-item.active {
    background-color: #b1803d;
    color: #fff;
  }

  .category-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 28rpx;
    font-size: 28rpx;
    color: #333;

    .title {
      font-size: 30rpx;
      font-weight: bold;
    }
    .total {
      font-size: 28rpx;
      color: #666;
    }
  }

  .list-item {
    display: flex;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    align-items: flex-start;
  }

  .item-img {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
  }

  .item-info {
    flex: 1;
    margin-left: 20rpx;
  }

  .item-name {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 8rpx;
  }

  .item-desc {
    font-size: 26rpx;
    color: #777;
    line-height: 1.4;
    margin-bottom: 12rpx;
  }

  .item-price {
    color: #e67e22;
    font-size: 30rpx;
    font-weight: 600;
  }

  .load-text {
    text-align: center;
    color: #999;
    padding: 20rpx 0;
    font-size: 26rpx;
  }
}
</style>
