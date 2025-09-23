<template>
  <uni-popup ref="popup" type="center">
    <view class="popup-box" :class="fontMode">
      <view class="popup-title">就诊须知</view>
      <scroll-view 
				scroll-y="true"
			  class="popup-content"
			  @scrolltolower="handleScrollToLower"
			>
        <text class="popup-text">
          1.如果您是首次来我院就诊，请持身份证或电子健康卡到自助机或人工窗口挂号；或登陆“山东第一医科大学第二附属医院”小程序进行预约挂号。（如您未携带身份证或电子健康卡，请先到收费处建卡、挂号）
					2.如果您是复诊病人，请您提前登陆“山东第一医科大学第二附属医院”小程序进行预约挂号，并于就诊当日点击“确认取号”进行报到，或来院后持身份证或电子健康卡到自助机或人工窗口预约报到，然后到相应的诊区候诊，等待叫号。
					3.如果您不能确定要看的专业，请到门诊大厅“一站式服务中心”，导医会引导您就诊。
					4.为使您就诊更方便，医院在门诊一到四楼均设有自助机，一楼大厅设有人工窗口，您可以就近进行挂号、缴费、充值、查询、打印等业务。如果您需退费及打印当日发票，请到一楼收费处办理。
					5.门诊大厅设“一站式服务中心”，为您提供预约诊疗、就医服务、便民服务、证件复印、证明盖章、健康咨询等服务；便民服务项目包括：轮椅、雨伞等服务，如您需要帮助，可与“一站式服务中心”联系。
					6.在诊间、自助机及官网小程序可进行医保结算，特殊情况可到一楼收费窗口结算。
					7.我院实行“365无假日门诊”，节假日照常上班，午、夜间请直接到急诊科就诊。
					正常工作时间：
					夏季 上午8:00-12:00  下午14:00-18:00
					冬季 上午8:00-12:00  下午13:30-17:30
					急诊科24小时值班，电话：(0538)6237120
        </text>
      </scroll-view>
      <view class="popup-footer">
        <button class="popup-btn" :disabled="!canConfirm" @click="confirm">我已知晓</button>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  props: {
    fontMode: {
      type: String,
      default: 'normal',
    }
  },
	data() {
		return {
			canConfirm: false,
			scrollTop: 0,
			scrollHeight: 0,
			contentHeight: 0,
		}
	},
  methods: {
    open() {
			this.canConfirm = false
			this.$refs.popup.open()
		},
	  confirm() {
			this.$refs.popup.close();
			uni.setStorageSync('popupConfirmed', true);
			this.$emit('confirmed');
		},
		handleScrollToLower() {
			this.canConfirm = true;
		},
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
  height: 60vh;
	overflow: auto;
	padding: 0 30rpx;
}

.popup-text {
  font-size: 28rpx;
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