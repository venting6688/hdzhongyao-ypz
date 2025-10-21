<template>
  <view class="custom-tag" :class="{ active: isActive }">
    <text>{{ text }}</text>
  </view>
</template>
<script>
export default {
  name: "customTag",
  props: {
    text: {
      type: String,
      default: "标签",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.custom-tag {
  display: inline-block;
  padding: 10rpx 23rpx;
  border-radius: 30rpx;
  font-size: 30rpx;
  color: #555555;
  background-color: #ffffff;
  margin-right: 15rpx;
  //border: 1rpx solid #ccc;
  white-space: nowrap;
}
.custom-tag.active {
  color: #ffffff;
  background-color: #87653a;
}
</style>
