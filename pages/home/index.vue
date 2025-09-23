<template>
	<scroll-view scroll-y class="homeLayout pageBg homePageBg">
		<visitNotice 
		ref="notice" 
		:fontMode="fontMode" 
		@confirmed="handleConfirm" 
		/>
		
		<customerNav title="青岛西海岸新区第二中医医院" />
		<view class="first">
			<image
				v-for="(item, index) in list"
				:key="index"
				:src="item.img"
				class="icon-card"
				mode="aspectFit"
				@click="onJumpClick(item)"
			/>
			<patients />
		</view>
		<view class="video">
			<image src="../../static/image/wenzhen.png" mode="aspectFit" @click="inquiry"></image>
			<image src="../../static/image/kaiyao.png" mode="aspectFit" @click="inquiry"></image>
		</view>
		<view class="ai" @click="onAiClick">
			<image src="../../static/img/ai-banner.png" mode="aspectFit"></image>
		</view>
		
		<view class="content">
			<uni-segmented-control 
			:current="current" 
			:values="items" 
			@clickItem="onClickItem" 
			styleType="text" 
			activeColor="#87653A"
			class="custom-tabs"
			>
			</uni-segmented-control>
			
			<view class="tabContent">
				<van-grid :column-num="4" clickable :border="false">
					<van-grid-item
						use-slot
						link-type="navigateTo"
						v-for="(item, index) in gridList[current]"
						:key="index"
						@click="onGridClick(item)"
					>
						<view class="img"><image :src="item.img" mode="" /></view>
						<view class="name">{{item.name}}</view>
					</van-grid-item>
				</van-grid>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import { mapState } from 'vuex'
	import customerNav from '@/components/customerNav.vue';
	import visitNotice from '@/components/visitNotice.vue';
	import patients from '@/components/patients.vue';
	
	export default {
	  components: {
	    customerNav,
			visitNotice,
			patients,
	  },
		computed: {
			...mapState(['footData']),
		},
		data() {
			return {
				showMain: false,
				fontMode: 'normal',
				current: 0,
				list: [
					{ img: '../../static/img/yuyue.png', url: "/sub_packages/subscribe/departments" },
					{ img: '../../static/img/menzhen.png', url: "/sub_packages/report/index" },
					{ img: '../../static/img/jiaofei.png', url: "/sub_packages/outpatientExpenditure/index" },
				],
				items: ['门诊服务', '住院服务', '综合服务'],
				gridList: [
					[
						{ img: '../../static/img/navigation/yuyue.png', name: '预约挂号', url: '/sub_packages/subscribe/departments' },
						{ img: '../../static/img/navigation/pay.png', name: '门诊缴费', url: '/sub_packages/outpatientExpenditure/index' },
						{ img: '../../static/img/navigation/report.png', name: '门诊报告', url: '/sub_packages/report/index' },
						{ img: '../../static/img/navigation/jiuzhen.png', name: '就诊记录', url: '/sub_packages/record/index' },
					],
					[
						{ img: '../../static/img/navigation/dengji.png', name: '入院登记'}, //, url: '/sub_packages/beHospitalizedRegister/index'
						{ img: '../../static/img/navigation/yujiaojin.png', name: '住院预交金', url: '/sub_packages/deposit/index' },
						{ img: '../../static/img/navigation/feiyong.png', name: '住院费用', url: '/sub_packages/convenientModule/index' },
						{ img: '../../static/img/navigation/zy-report.png', name: '住院报告'}, //, url: '/sub_packages/report/hospitalization' 
					],
					[
						{ img: '../../static/img/navigation/info.png', name: '就诊人管理', url: '/sub_packages_healthcard/family/familyManage' },
						{ img: '../../static/img/navigation/tousu.png', name: '投诉与建议', url: '/sub_packages/complaint/index' },
						{ img: '../../static/img/navigation/manyidu.png', name: '满意度调查', url: '/sub_packages/questionnaire/index'  },
					]
				]
			}
		},
	  onLoad() {
		  const confirmed = uni.getStorageSync('popupConfirmed');
			if (!confirmed) {
				this.$nextTick(() => {
					this.$refs.notice.open();
				});
			} else {
				this.showMain = true;
			}
		},
		methods: {
			handleConfirm() {
				this.showMain = true;
			},
			onClickItem(e) {
				this.current = e.currentIndex
			},
			onGridClick(item) {
				if (item.url) {
					uni.navigateTo({ url: item.url })
				} else if (item.appid) {
					wx.navigateToMiniProgram({
					  appId: item.appid,
					  path: item.targetUrl,
					  envVersion: 'release',
					  success: function(res) {
					  },
					  fail: function(err) {
					    console.log('跳转失败', err);
					  }
					});
				} else {
					uni.showToast({
						title: '暂未开放，敬请期待',
						icon: 'none'
					})
				}
			},
			onAiClick() {
				wx.reLaunch({ url: '/pages/virtualNurse/index' })
			},
			inquiry() {
				uni.showToast({
					title: '暂未开放，敬请期待',
					icon: 'none'
				})
			},
			onJumpClick(item) {
				if (item.url) {
					uni.navigateTo({ url: item.url })
				}
			}
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
			gap: 12rpx;
			justify-content: space-around;
			.icon-card {
			  width: 230rpx;
				height: 220rpx;
			}
		}
		.video {
			width: 100%;
			height: 180rpx;
			display: flex;
			justify-content: space-between;
			gap: 20rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.ai {
			width: 100%;
			height: 220rpx;
			margin-top: 15rpx;
			image {
				height: 100%;
				width: 100%;
			}
		}
		.content {
			background: #fff;
			border-radius: 15rpx;
			padding: 15rpx;
			margin-top: 20rpx;
			.tabContent {
				.van-grid-item__content {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-evenly;
					padding: 0;
					
					>.img {
						width: 80rpx;
						height: 80rpx;
						// margin-top: 10rpx;
						background: #F1EDE9;
						border-radius: 50%;
						padding: 15rpx 13rpx;
						image {
							width: 60rpx;
							height: 55rpx;
						}
					}
					>.name {
						font-size: 28rpx;
						margin: 10rpx 0;
						color: $text-color;
					}
				}
				
				.grid-item-content {
				  display: flex;
				  flex-direction: column;
				  align-items: center;
				  justify-content: center;
				  padding: 10rpx;
				}
				
				.grid-image {
				  width: 60rpx;
				  height: 60rpx;
				  margin-bottom: 10rpx;
				}
				
				.grid-text {
				  font-size: 24rpx;
				  color: $text-color;
				}
			}
		}
		.custom-tabs ::v-deep .segmented-control__text {
			font-size: 34rpx;
		}
		::v-deep .van-grid-item__text {
			font-size: 26rpx;
			color: $text-color;
		}
		::v-deep .van-grid-item__content {
			padding: 10rpx 0;
		}
		::v-deep .segmented-control {
			margin-bottom: 30rpx;
		}
		
	}
</style>
