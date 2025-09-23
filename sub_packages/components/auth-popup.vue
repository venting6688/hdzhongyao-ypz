<!-- components/auth-popup/auth-popup.vue -->
<template>
  <!-- 主弹窗 -->
  <uni-popup ref="popup" type="center" :mask-click="false">
    <view class="auth-popup">
      <view class="auth-header">电子健康卡</view>
      <view class="auth-content">
        <view>即将使用电子健康卡服务，<span style="color: #1B98FF;">开启授权，就医一卡通行</span></view>
      </view>
      <health-card-login
        v-if="showAuth"
        wechatcode=true
        @authSuccess="onAuthSuccess"
        @authFail="onAuthFail"
        @authCancel="onAuthCancel"
      >
				<view class="healCard">
					<button class="auth-button" @click="handleAuthClick">前往授权</button>
				</view>
      </health-card-login>
      
      <button type="default" class="cancel-button" @click="returnHome">返回</button>
    </view>
  </uni-popup>
</template>

<script>
export default {
  data() {
    return {
      showAuth: false
    }
  },
  methods: {
    open() {
      this.$refs.popup.open()
      this.showAuth = true
    },
    
    // 关闭弹窗
    close() {
      this.$refs.popup.close()
      this.showAuth = false
      this.$emit('cancel')
    },
    
    // 处理授权按钮点击
    handleAuthClick() {
      // 这里会触发 health-card-login 组件自己的授权逻辑
      console.log('触发插件授权流程')
    },
		
		returnHome() {
			uni.navigateTo({url: '/sub_packages_healthcard/family/familyManage'});
		},
    
    // 授权成功
    onAuthSuccess(e) {
      this.close()
      this.$emit('success', e)
    },
    
    // 授权失败
    onAuthFail(e) {
      this.close()
      this.$emit('fail', e)
    },
    
    // 授权取消
    onAuthCancel() {
      this.close()
      this.$emit('cancel')
    }
  }
}
</script>

<style>
.auth-popup {
  width: 80vw;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-sizing: border-box;
}

.auth-header {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.auth-content {
  margin-bottom: 40rpx;
  text-align: center;
  font-size: 30rpx;
  color: #666;
}

.auth-tip {
  font-size: 26rpx;
  color: #999;
  margin-top: 15rpx;
}

.healCard {
	/* display: flex; */
	justify-content: space-between;
	align-items: center;
}
.auth-button {
  color: white;
  background: #1B98FF;
	font-size: 14px;
}

.cancel-button {
	font-size: 14px;
	margin-top: 30rpx;
}
</style>