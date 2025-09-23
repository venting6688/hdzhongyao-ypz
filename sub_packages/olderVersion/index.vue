<template>
	<scroll-view class="homeLayout pageBg otherPageBg">
		<customerNav title="关爱老人 — 老年版" />
		<view class="content">
			<patients :fontMode="'elder'" />
			<image
				v-for="(item, index) in list"
				:key="index"
				:src="item.img"
				class="icon-card"
				mode="aspectFit"
				@click="onJumpClick(item)"
			/> 
		</view>
		<view class="btn" @click="goBack">退出长辈版</view>
	</scroll-view>
</template>

<script>
	import { mapState } from 'vuex'
	import customerNav from '@/components/customerNav.vue';
	import patients from '@/components/patients.vue';
	
	export default {
	  components: {
	    customerNav,
			patients
	  },
		computed: {
			...mapState(['footData']),
		},
		data() {
			return {
				list: [
					{ img: 'https://aiwz.sdtyfy.com:8099/img/ln_yuyue.png', url: "/sub_packages/subscribe/departments" },
					{ img: 'https://aiwz.sdtyfy.com:8099/img/ln_menzhen.png', url: "/sub_packages/report/index" },
					{ img: 'https://aiwz.sdtyfy.com:8099/img/ln_jiaofei.png', url: "/sub_packages/outpatientExpenditure/index" },
					{ img: 'https://aiwz.sdtyfy.com:8099/img/ln_jiuzhen.png', url: "/sub_packages/record/index" },
				],
			}
		},
		methods: {
			onJumpClick(item) {
				if (item.url) {
					uni.navigateTo({ url: item.url })
				} else {
					uni.showToast({
						title: '暂未开放，敬请期待',
						icon: 'none'
					})
				}
			},
			goBack() {
				uni.switchTab({
				  url: '/pages/home/index'
				});
			}
		},
	  mounted() {
	  }
	}
</script>

<style lang="scss" scoped>
	.homeLayout {
		width: 100vw;
		height: 100vh;
		background-color: #fff;
		.content {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			.icon-card {
			  width: 332rpx;
				height: 332rpx;
			}
		}
		.btn {
			position: fixed;
			bottom: 50rpx;
			left: 50%;
			transform: translateX(-50%);
			z-index: 10;
			color: #fff;
		  width: 90%;
			background: $global-color;
			padding: 15px 30px;
			border-radius: 50rpx;
			font-size: 34rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
