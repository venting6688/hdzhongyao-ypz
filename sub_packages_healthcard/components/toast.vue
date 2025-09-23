<template>
    <view class="toast">
        <view class="mask" v-if="showMask" @click.stop></view> 
        <view class="center">
            <view class="type" :class="{red:type==='fail'}">
                {{message}}
            </view>
            <view class="time">
                <text>{{time}}</text>
                <text>{{tips?tips:'秒后关闭'}}</text>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            second: {
                type: Number,
                default: 4,
            },
            type: {
                type: String,
            },
            message: {
                type: String,
            },
            tips: {
                type: String,
                default:'秒后关闭',
            },
            url: {
                type: String,
            },
        },
        data(){
            return {
                time:0,
				timer:null,
                showMask: false, 
            }
        },
		beforeDestroy() {
			clearInterval(this.timer)
		},
        mounted(){
            this.time = this.second;
            this.showMask = true; 
            this.$nextTick(() => {
                try {
                    this.timer = setInterval(() => {
                        this.time--;
                        if (this.time <= 0) {
                            clearInterval(this.timer);
                            this.$emit('back', false);
                            if(this.url){
                                wx.reLaunch({
                                    url: this.url,
                                })
                            }
                            this.showMask = false; 
                        }
                    }, 1000);
                } catch (toastShowError) {
                    console.error('显示提示时出现错误：', toastShowError);
                }
            });
        }
    }
</script>
<style lang="less" scoped>
.toast {
    width: 100vw;
    height: 100%; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    position: fixed; 
    top: 0; 
    left: 0;
	
 .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5); 
        z-index: 999; 
        pointer-events: auto; 
    }
 .center {
        min-width: 300rpx;
        color: #000000;
        padding:70rpx 40rpx;
        background-color: #ffffff;
        border-radius: 15.27rpx;
        box-shadow: 0rpx 0rpx 19.08rpx 0rpx rgba(0,0,0,0.10);
        z-index: 1000; 
     .type {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #4286ff;
            font-size: 44rpx;
            line-height: 44rpx;
            margin-bottom: 60rpx;
        }
     .red {
            color: red!important;
        }
        >.time{
            font-size: 36rpx;
            line-height: 36rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            >text {
                color: #999999;
                white-space: nowrap;
                &:first-child{
                    color: #ffc03d;
                    margin-right: 8rpx;
                }
                
            }
        }
    }        
}
</style>