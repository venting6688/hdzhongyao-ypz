<template>
  <uni-popup ref="popup" type="center">
    <view class="popup-box" :class="[fontMode, noticeType]">
      <view class="popup-title">{{noticeType == 'index' ? '就诊须知' : '购药须知'}}</view>
      <scroll-view 
				scroll-y="true"
			  class="popup-content"
			  @scrolltolower="handleScrollToLower"
			>
        <text class="popup-text" v-if="noticeType == 'index'">
           一、挂号预约
						预约渠道：医院微信公众号、“健康青岛”平台、门诊现场自助机。
						核心要求：全程实行实名制挂号，需准确提供就诊人真实身份信息及有效证件（身份证、医保卡等）。
						预约规则：可预约未来6日内号源，每日7:00开放新号源。
					二、就诊流程
						1.挂号/取号：1号楼门诊一楼设有人工挂号窗口及自助机，可直接挂号；预约患者需持有效证件，按预约时间段提前30分钟到自助机或人工窗口取号，超时未取号，号源将自动取消。
						2.科室选择：根据病情选择对应科室，若有疑问，可咨询导医台预检分诊工作人员。
						3.就诊秩序：按报到顺序叫号就诊，严格实行“一医一患”制度；行动不便者可由1名家属陪同进入诊室。
						4.费用缴纳：医生开具检查单或处方后，可通过以下方式缴费：
						线上渠道（医院公众号/小程序）、各楼层自助机、一楼人工窗口或自助服务区
					三、检查与结果查询
						检查安排：磁共振等需预约的检查项目，到对应检查区域预约；无需预约的项目，直接按申请单提示前往指定区域检查。
						结果获取：检查检验报告可通过医院小程序、公众号或自助打印机查询、打印；放射类检查影像（如CT、DR），请通过医院提供的“云胶片”系统查询。
          四、其他注意事项
						1.必带物品：就诊时请携带身份证、医保卡、既往病历本及相关检查报告，便于医生全面了解病情。
						2.秩序与安全：办理挂号、缴费等手续时，请自觉排队；妥善保管个人财物，避免丢失。
						3.候诊要求：候诊期间请勿大声喧哗，全程禁止吸烟，共同保持诊疗环境整洁卫生。
						4.便民服务：门诊导医台备有糖块、花镜、雨伞、针线、纸杯等便民物品，有需要可直接前往取用。
						5.咨询与监督：
							就诊中遇困难，可直接联系导医台寻求帮助。
							服务热线（工作时间）：55539999
							监督电话（工作时间）：88192856
							24小时咨询电话：88192806
							我们将及时处理您的诉求并持续改进工作。
        </text>
				<text class="popup-text" v-if="noticeType == 'order'">
					一、互联网医疗服务协议
						1.本平台是黄岛第二中医医院官方互联网医疗服务平台
						2.所有药品均经专业药师审核，
						3.患者需如实填写个人信息和健康状况评估，医生不提供诊疗咨询，慢性病复诊服务。若评估后不适合，请线下到院就诊咨询。
						4.此药饮不可代替正常药物使用。
						5.急重症患者请及时就医，不适合使用本服务
				  二、用药安全须知
						1.请按包装说明或者医嘱使用，不可擅自增减剂量
						2.不同中药的储存要求及保存时间不同(常规放在阴凉干燥处保存)，拿到中药后请及时使用，发现有异常情况请勿使用，若出现数量不对、药品质量问题请拨打电话-0532-88191639
						3.孕妇、儿童、哺乳期妇女、肝肾功能异常者及过敏体质者在医师指导下服用。
						4.此药饮不可代替正常药物使用，如遇冲突请线下咨询医生
				  三、代茶饮使用问题解答
						1.下单信息填写错误，可扫码入群，联系群内工作人员或者拨打0532-88191639进行信息更改。
						2.代茶饮一天一付，7付为一疗程，适量沸水冲泡或煮服。颜色变淡可停止服用。
						3.不建议同时服用2种代茶饮，在医师指导下更换其他种类代茶饮。
						4.开封的代茶饮请及时封口，通风干燥处存放。
						5.代茶饮期间避免过量摄入寒凉腥辣食物。
				  四、配送服务说明
						1.可在中药窗口凭单自取，也可快递到家(需承担快递费当天下单后统一次日发货，发出的药品除质量问题概不退换。
				</text>
      </scroll-view>
      <view class="popup-footer">
        <button class="popup-btn" :disabled="!canConfirm" @click="confirm">{{noticeType == 'index' ? '我已知晓' : '我同意'}}</button>
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
    },
    noticeType: {
      type: String,
      default: 'index', // index -> 首页，order -> 订单页
    }
  },
  data() {
    return {
      canConfirm: false,
    }
  },
  methods: {
    open() {
      this.canConfirm = false;

      // 首页逻辑：只提示一次（除非重新进入小程序）
      if (this.noticeType === 'index') {
        const hasConfirmed = uni.getStorageSync('popupConfirmed');
        if (!hasConfirmed) {
          this.$refs.popup.open();
        }
      }

      // 订单页逻辑：每次进入都弹出
      else if (this.noticeType === 'order') {
        this.$refs.popup.open();
      }
    },

    confirm() {
      this.$refs.popup.close();

      // 首页需要记住“我已知晓”
      if (this.noticeType === 'index') {
        uni.setStorageSync('popupConfirmed', true);
      }

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
	margin-top: 100rpx;
}

.order {
  margin-top: -120rpx !important;
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