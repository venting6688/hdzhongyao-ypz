<template>
  <view class="order-page">
    <!-- 顶部切换 -->
    <view class="segmented-wrapper">
      <uni-segmented-control
        :current="current"
        :values="tabs"
        styleType="text"
        activeColor="#A77D50"
        @clickItem="onTabChange"
      />
    </view>

    <!-- 订单列表 -->
    <scroll-view scroll-y class="order-list">
      <view v-for="(item, index) in filteredOrders" :key="index">
        <order-item :order="item" @getOrderListEmit="getOrderList" />
      </view>

      <view v-if="filteredOrders.length === 0" class="empty">
        暂无订单
        <view class="to-index-btn" @tap="toIndexPage"> 去逛逛 </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import orderItem from "./components/order-item.vue";
import shopApi from "@/api/shopApi.js";
const enumOrderStatus = {
  待付款: "未付款",
  待发货: "等待发货",
  待收货: "待收货",
  已完成: "已完成",
};

export default {
  components: { orderItem },
  data() {
    return {
      current: 0,
      tabs: ["全部", "待付款", "待发货", "待收货", "已完成"],
      orders: [],
      loginData: null,
      page: 1,
      size: 10,
    };
  },
  computed: {
    filteredOrders() {
      const tab = this.tabs[this.current];
      if (tab === "全部") return this.orders;
      return this.orders.filter((order) => order.status === enumOrderStatus[tab]);
    },
  },
  onLoad() {
    this.loginData = uni.getStorageSync("loginData");
    this.getOrderList();
  },
  methods: {
    onTabChange(e) {
      this.current = e.currentIndex;
    },
    // 获取订单列表
    async getOrderList() {
      const res = await shopApi.getOrderListApi({
        userId: this.loginData.userId,
        page: this.page,
        size: this.size,
      });
      if (
        res.errno == 0 &&
        res.data &&
        "orders" in res.data &&
        res.data.orders.length > 0
      ) {
        const newOrders = res.data.orders.map(
          ({
            orderInfo: { id, addTime, goodsPrice, orderStatusText },
            orderGoods,
          }) => ({
            id,
            date: addTime,
            total: goodsPrice,
            status: orderStatusText,
            goods: orderGoods.map(
              ({ id, goodsName, retailPrice, number, listPicUrl }) => ({
                id,
                name: goodsName,
                price: retailPrice,
                quantity: number,
                img: listPicUrl,
              })
            ),
          })
        );
        this.orders = [...newOrders];
      }
    },
    toIndexPage() {
      uni.navigateTo({ url: `/sub_packages/shop/index` });
    },
  },
};
</script>

<style scoped>
::v-deep .segmented-control__text {
  font-size: 30rpx !important;
}
.segmented-wrapper {
  background: #fff;
  /* margin-bottom: 20rpx; */
}
.order-list {
  padding: 20rpx;
  max-height: calc(100vh - 100rpx);
}
.empty {
  text-align: center;
  color: #999;
  margin-top: 100rpx;
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
