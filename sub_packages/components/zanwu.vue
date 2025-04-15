<template>
	<view class="box">
		<view class="without">
			<image src="../static/image/zanwu.png" mode="widthFix" style="width: 300rpx;"></image>
			<text>暂无数据</text>
		</view>
	</view>
</template>

<style lang="less" scoped>
	.box {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		.without {
			font-size: 40rpx;
			width: 681.3rpx;
			padding-bottom: 35rpx;
			background: #ffffff;
			margin: 0 auto;
			border-radius: 15.27rpx;
			display: grid;
			justify-content: center;
			align-items: center;
			text {
				color: #797979;
				font-size: 32rpx;
				text-align: center;
			}
		}
	}
</style>