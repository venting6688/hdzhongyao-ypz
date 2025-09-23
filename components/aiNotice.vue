<template>
  <uni-popup ref="popup" type="center" :mask-click="false">
    <view class="popup-box" :class="tipMsg">
      <view class="popup-title">温馨提示</view>
      <scroll-view 
				scroll-y="true"
			  class="popup-content"
			>
        <text class="popup-text">您当前获取的医疗建议由AI生成，仅供参考，具体诊疗请遵循专业医生指导</text>
      </scroll-view>
      <view class="popup-footer">
        <button class="popup-btn" :disabled="!canConfirm" @click="confirm"> 
					{{ canConfirm ? '已阅读并理解' : `已阅读并理解 (${countdown}s)` }}
				</button>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  props: {
    tipMsg: {
      type: String,
      default: 'normal',
    }
  },
	data() {
		return {
			canConfirm: false, // 是否可点击
			countdown: 5,      // 倒计时秒数
			timer: null
		}
	},
  methods: {
		 open() {
			this.canConfirm = false;
			this.countdown = 5;
			this.$refs.popup.open();

			if (this.timer) clearInterval(this.timer);

			this.timer = setInterval(() => {
				this.countdown -= 1;
				if (this.countdown <= 0) {
					this.canConfirm = true;
					clearInterval(this.timer);
					this.timer = null;
				}
			}, 1000);
		},

		confirm() {
			if (!this.canConfirm) return;
			this.$refs.popup.close();
			this.$emit('confirmed'); 
		},
  },
	
	beforeDestroy() {
		if (this.timer) clearInterval(this.timer);
	}
}
</script>

<style scoped>
.popup-box {
  width: 90vw;
  max-height: 80vh;
  background: #fff;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  padding: 30rpx;
  color: #333;
}

.popup-content {
	overflow: auto;
	padding: 0 30rpx;
}

.popup-text {
  color: #666;
  font-size: 34rpx;
  color: #666;
  line-height: 1.8;
}

.popup-footer {
  padding: 30rpx;
}

.popup-btn {
  background-color: #4286FF;
  color: #fff;
  border: none;
  border-radius: 50rpx;
  font-size: 32rpx;
  width: 100%;
}

/* 老年模式样式 */
.elder .popup-text {
  font-size: 36rpx;
  line-height: 2;
}
.elder .popup-title {
  font-size: 40rpx;
}
.elder .popup-btn {
  font-size: 36rpx;
}
</style>