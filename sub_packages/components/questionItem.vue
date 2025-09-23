<template>
  <view class="question-box">
    <view class="question-title">{{ index+1 }}. {{ question }}</view>
    <view class="options">
			<uni-data-checkbox 
			:localdata="options"
			:value="innerValue"
			@change="handleChange"
			>
			</uni-data-checkbox>
    </view>
  </view>
</template>

<script>
export default {
  name: 'questionItem',
   props: {
		question: String,
		index: Number,
		options: {
			type: Array,
			default: () => []
		},
		value: {
		  type: [String, Array],
		  default: () => []
		}
	},
	data() {
		return {
			innerValue: this.value
		};
	},
	watch: {
		value(val) {
			this.innerValue = val;
		}
	},
	methods: {
		handleChange(e) {
			this.innerValue = e.detail.value;
			this.$emit('input', this.innerValue);
		}
	}
}
</script>

<style scoped>
	.custom-radio {
	  transform: scale(0.6); 
	  transform-origin: center;
	}
	
	.question-box {
		width: 700rpx;
		margin: 30rpx 0;
		padding: 20rpx 30rpx;
		background: #fff;
		border-radius: 12rpx;
		box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.05);
	}
	.question-title {
		font-size: 32rpx;
		margin-bottom: 20rpx;
	}
	.required {
		color: red;
		margin-right: 8rpx;
	}
	.option-group {
	  display: flex;
	  flex-wrap: wrap;
	  gap: 20rpx; /* 选项之间留白 */
	}
	
	.option-label {
	  display: flex;
	  align-items: center;
	  margin-right: 25rpx;
	  padding: 10rpx 0;
	}
	
	.option-text {
	  font-size: 30rpx;
	  color: #666;
	}
	.input-wrapper {
		margin-top: 20rpx;
	}
	.input-box {
		width: 100%;
		min-height: 100rpx;
		border: 2rpx solid #ccc;
		border-radius: 10rpx;
		padding: 10rpx;
		font-size: 28rpx;
		color: #333;
	}
</style>
