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
        <order-item :order="item" />
      </view>

      <view v-if="filteredOrders.length === 0" class="empty">
        暂无订单
      </view>
    </scroll-view>
  </view>
</template>

<script>
import orderItem from './components/order-item.vue'

export default {
  components: { orderItem },
  data() {
    return {
      current: 0,
      tabs: ['全部', '待付款', '待发货', '待收货', '已完成'],
      orders: [
        {
          id: 1,
          date: '2025-05-06 11:34:26',
          name: '四君子茶',
          price: 4.93,
          quantity: 7,
          total: 30,
          status: '待收货',
          img: '/static/image/test.png'
        },
        {
          id: 2,
          date: '2025-05-06 11:34:26',
          name: '四君子茶',
          price: 4.93,
          quantity: 7,
          total: 30,
          status: '待付款',
          img: '/static/image/test.png'
        },
        {
          id: 1,
          date: '2025-05-06 11:34:26',
          name: '四君子茶',
          price: 4.93,
          quantity: 7,
          total: 30,
          status: '待发货',
          img: '/static/image/test.png'
        },
        {
          id: 3,
          date: '2025-05-06 11:34:26',
          name: '四君子茶',
          price: 4.93,
          quantity: 7,
          total: 30,
          status: '已完成',
          img: '/static/image/test.png'
        }
      ]
    }
  },
  computed: {
    filteredOrders() {
      const tab = this.tabs[this.current]
      if (tab === '全部') return this.orders
      return this.orders.filter(order => order.status === tab)
    }
  },
  methods: {
    onTabChange(e) {
      this.current = e.currentIndex
    }
  }
}
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
		max-height: calc(100vh - 200rpx);
	}
	.empty {
		text-align: center;
		color: #999;
		margin-top: 100rpx;
	}
</style>
