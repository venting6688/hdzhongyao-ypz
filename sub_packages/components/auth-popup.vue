<!-- components/auth-popup/auth-popup.vue -->
<template>
  <!-- 主弹窗 -->
  <uni-popup ref="popup" type="center" :mask-click="false">
    <view class="auth-popup">
      <view class="auth-header">微信授权</view>
      <view class="auth-content">
        <view>需要您授权电子健康卡信息</view>
        <!-- <view class="auth-tip">请点击下方按钮完成授权</view> -->
      </view>
      
      <!-- 这里封装了 health-card-login 组件 -->
      <health-card-login
        v-if="showAuth"
        wechatcode=true
        @authSuccess="onAuthSuccess"
        @authFail="onAuthFail"
        @authCancel="onAuthCancel"
      >
        <!-- 自定义授权按钮 -->
        <button class="auth-button" @click="handleAuthClick">确认授权</button>
      </health-card-login>
      
      <!-- <button class="cancel-button" @click="close">取消</button> -->
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
    // 打开弹窗
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

.auth-button {
  background: #07C160;
  color: white;
  margin-bottom: 20rpx;
	width: 50%;
}

.cancel-button {
  background: #f5f5f5;
  color: #333;
	width: 50%;
}
</style>