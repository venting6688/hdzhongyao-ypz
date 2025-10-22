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
          :radius="100"
          cancelButton="none"
          @confirm="onConfirmSearch"
        ></uni-search-bar>
      </view>
    </view>
    <view class="medicine-page">
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
			<view class="category-title">
				<text class="title">协定方配药</text>
				<text class="total">共{{ total }}个药品</text>
			</view>
			<scroll-view scroll-y class="list-scroll" @scrolltolower="loadMore">
				<view
					class="list-item"
					v-for="(item, index) in displayedList"
					:key="index"
				>
					<image class="item-img" :src="item.image" mode="aspectFill" />
					<view class="item-info">
						<view class="item-name">{{ item.name }}</view>
						<view class="item-desc">发的索拉卡发快递撒娇浪费我if</view>
						<view class="item-price">￥{{ item.price }}</view>
					</view>
				</view>
	
				<!-- 加载状态 -->
				<view v-if="loading" class="load-text">加载中...</view>
				<view v-else-if="noMore" class="load-text">没有更多了</view>
			</scroll-view>
		</view>
  </scroll-view>
</template>
<script>
import shopApi from "@/api/shopApi.js";
import customerNav from "@/components/customerNav.vue";
import { getStatusBarHeight } from "@/utils/system.js";
import customTag from "@/components/customTag.vue";

export default {
  components: { 
		customerNav, 
		customTag 
	},
  data() {
    return {
      searchValue: "",
			categories: ['全部'],
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
  },
  computed: {
    barHeight() {
      return getStatusBarHeight() + 5;
    },
  },
  methods: {
    goDetail(item) {
      uni.navigateTo({
        url: `/sub_packages/shop/detail?id=${item.id}`,
      });
    },
    onConfirmSearch() {
      this.initList();
    },
		initList() {
			shopApi.getTypes().then((res) => {
				if (res.statusCode === 200 && res.data.data) {
					const data = res.data.data
					const categoryList = data.categoryList || []

					this.categories = ['全部'] // 重置分类
					this.list = [] // 重置总数据

					categoryList.forEach((val) => {
						if (val.subCategoryList && val.subCategoryList.length > 0) {
							val.subCategoryList.forEach((sub) => {
								// 添加分类名
								this.categories.push(sub.name)

								if (sub.goodsVosList && sub.goodsVosList.length > 0) {
									sub.goodsVosList.forEach((goods) => {
										this.list.push({
											id: goods.id,
											name: goods.name,
											desc: goods.goodsDesc,
											price: goods.retailPrice,
											image: goods.primaryPicUrl,
											category: sub.name,
										})
									})
								}
							})
						}
					})

					// 初始化过滤与加载
					this.filterList()
				}
			})
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
		
		// 分类切换
		changeCategory(index) {
			this.currentCategory = index
			this.page = 1
			this.noMore = false
			this.displayedList = []
			this.filterList()
		},

		// 根据分类过滤
		filterList() {
			const current = this.categories[this.currentCategory]
			this.filteredList =
				current === '全部'
					? this.list
					: this.list.filter((item) => item.category === current)
			this.total = this.filteredList.length
			this.loadMore()
		},
		
		 // 触底加载更多
		loadMore() {
			if (this.loading || this.noMore) return
			this.loading = true

			setTimeout(() => {
				const start = (this.page - 1) * this.pageSize
				const end = start + this.pageSize
				const newData = this.filteredList.slice(start, end)

				if (newData.length) {
					this.displayedList = this.displayedList.concat(newData)
					this.page++
				} else {
					this.noMore = true
				}

				this.loading = false
			}, 500)
		},
	}
}
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
      ::v-deep .uni-searchbar__box {
        border: 1px solid #666;
      }
    }
  }

	.medicine-page {
	  background-color: #f8f8f8;
	  height: 100vh;
	  display: flex;
	  flex-direction: column;
	}
	
	/* 分类滑块 */
	.category-scroll {
	  display: flex;
	  white-space: nowrap;
	  background: #fff;
	  padding: 16rpx 0;
	  border-bottom: 1rpx solid #f1f1f1;
	}
	
	.category-item {
	  display: inline-block;
	  margin: 0 20rpx;
	  padding: 12rpx 28rpx;
	  font-size: 28rpx;
	  border-radius: 30rpx;
	  background-color: #f6f6f6;
	  color: #555;
	}
	
	.category-item.active {
	  background-color: #b1803d;
	  color: #fff;
	}
	
	/* 标题 */
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
	
	/* 列表 */
	.list-scroll {
	  flex: 1;
	  padding: 0 20rpx;
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
