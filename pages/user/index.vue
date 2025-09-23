<template>
	<scroll-view scroll-y class="homeLayout pageBg otherPageBg">
		<customerNav title="我的" />
		<view class="first"><patients /></view>
		<view class="ai" @click="onOldClick">
			<image src="https://aiwz.sdtyfy.com:8099/img/laonian.png" mode="aspectFit" />
		</view>
		<view class="content">
			<view class="section" v-for="(block, i) in gridData" :key="i">
				<view class="title">{{ block.title }}</view>
				<view class="grid">
					<view class="item" v-for="(item, j) in block.list" :key="j" @click="onGridClick(item)">
						<image :src="item.icon" class="icon" />
						<text class="label">{{ item.label }}</text>
					</view>
				</view>
			</view>
			<!-- <view class="setting" @click="onSetting">
				<view class="left">
					<image src="../../static/img/icon/setting.png" mode="aspectFit" />
					<text>设置</text>
				</view>
				<view>
					<uni-icons type="right" size="30"></uni-icons>
				</view>
			</view> -->
		</view>
	</scroll-view>
</template>

<script>
	import customerNav from '@/components/customerNav.vue';
	import patients from '@/components/patients.vue';
	
	export default {
	  components: {
	    customerNav,
			patients
	  },
		data() {
			return {
				gridData: [
					{
						title: '健康数据',
						list: [
							{ icon: '../../static/img/icon/shuju.png', label: '健康数据' },
							{ icon: '../../static/img/icon/zhengzhuang.png', label: '症状管理' },
							{ icon: '../../static/img/icon/jiankang.png', label: '健康史' },
							{ icon: '../../static/img/icon/life.png', label: '生活方式' }
						]
					},
					{
						title: '常用功能',
						list: [
							{ icon: '../../static/img/icon/jiuzhen.png', label: '就诊人管理', url: '/sub_packages_healthcard/family/familyManage' },
							{ icon: '../../static/img/icon/manyi.png', label: '满意度调查', url: '/sub_packages/questionnaire/index' },
							{ icon: '../../static/img/icon/tousu.png', label: '投诉与建议', url: '/sub_packages/complaint/index' }
						]
					}
				]
			}
		},
		methods: {
			onGridClick(item) {
				if (item.url) {
					uni.navigateTo({ url: item.url })
				} else {
					uni.showToast({
						title: '暂未开放',
						icon: 'none'
					})
				}
			},
			onAiClick() {
				wx.reLaunch({ url: '/pages/virtualNurse/index' })
			},
			onOldClick() {
				uni.navigateTo({ url: '/sub_packages/olderVersion/index' })
			},
			onSetting() {
				uni.navigateTo({ url: '/sub_packages/setting/index' })
			},
		},
	}
</script>

<style lang="scss" scoped>
	.homeLayout {
		width: 100vw;
		height: 100vh;
		.first {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			::v-deep .stack-container {
			  margin: 25rpx auto;
			}
		}
		.ai {
			width: 100%;
			height: 154rpx;
			margin-top: 15rpx;
			image {
				height: 100%;
				width: 100%;
			}
		}
		.content {
			.section {
			  background: #fff;
			  border-radius: 16rpx;
			  padding: 30rpx 20rpx;
			  margin: 20rpx 0;
			  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
				.title {
				  font-size: 34rpx;
				  color: #333;
				  margin-bottom: 20rpx;
				  font-weight: bold;
				}
				
				.grid {
				  display: flex;
				  flex-wrap: wrap;
				  justify-content: space-between;
				}
				
				.item {
				  width: 25%;
				  display: flex;
				  flex-direction: column;
				  align-items: center;
				  margin-bottom: 20rpx;
				}
				
				.icon {
				  width: 50rpx;
				  height: 50rpx;
				  margin-bottom: 10rpx;
				}
				
				.label {
				  font-size: 30rpx;
				  color: $text-color;
				}
			}
			
			.setting {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #fff;
				padding: 15rpx 10rpx;

				.left {
					display: flex;
					align-items: center;
					
					image {
						width: 48rpx;
						height: 48rpx;
						margin-right: 15rpx;
					}
					text {
						font-size: 34rpx;
						color: $text-color;
					}
				}
			}
		}
	}
</style>
