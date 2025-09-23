<template>
	<view class="layout">
		<view class="navbar">
			<view class="statusBar" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="titleBar" :style="{ height: titleBarHeight + 'px' }">
			  <view class="title">{{title}}</view>
			</view>
		</view>
		<view class="fill" :style="{ height: navBarHeight + 'px' }"></view>
	</view>
</template>

<script>
	import { getStatusBarHeight, getTitleBarHeight, getNavBarHeight } from '@/utils/system.js'

	export default {
		props: {
			title: String,
		},
		computed: {
			statusBarHeight() {
				return getStatusBarHeight()
			},
			titleBarHeight() {
				return getTitleBarHeight()
			},
			navBarHeight() {
				return getNavBarHeight()
			}
		}
	}
</script>

<style lang="less">
.layout {
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
	  background: linear-gradient(to right, #f1ede8, #e2dacd, #d3c7b2);
		/* .statusBar {} */
		.titleBar {
			display: flex;
			padding: 0 30rpx;
			align-items: center;
			.title {
				font-size: 18px;
				color: #333;
			}
			.search {
				width: 220rpx;
				height: 50rpx;
				border-radius: 60rpx;
				background: rgba(255,255,255,0.4);
				border:1px solid #fff;
				margin-left:30rpx;
				color:#999;
				font-size: 28rpx;
				display: flex;
				align-items: center;
				.icon {
					margin-left: 5rpx;
				}
				.text {
					padding-left: 10rpx;
				}
			}
		}
	}
}
</style>