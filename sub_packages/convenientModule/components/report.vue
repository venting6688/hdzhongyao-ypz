<template>
  <view class="expand-box">
	  <view class="head">
	  	<view class="title">
	  		<view>
	  			查验总数量
	  		</view>
			<view>
				未查验数量
			</view>
			<view>
				已出报告
			</view>
			<view>
				未出报告
			</view>
	  	</view>
		<view class="middle">
			<view>
				5个
			</view>
			<view>
				1个
			</view>
			<view>
				2个
			</view>
			<view>
				3个
			</view>
			
		</view>
	  </view>
    <view
      id="content-box"
      class="content-box"
	  :class="{'pos':!position}"
	  ref="contentBox"
      :style="{
        marginTop: expand ? '0px' : -contentHeight + 'px',
      }"
    >
	    <view class="content-head">
	    	<view>项目名称</view>
	    	<view>检查状态</view>
	    </view>
	    <ul>
	  	    <li v-for="(item,index) in List" :key="index">
				<view>
					{{item.name}}
				</view>
				<view>
					{{item.state}}
				</view>
				<view :class="{blue:item.state==='已报告'}" @click="report(item.state)">
					查看报告
				</view>
	  	    </li>
	    </ul>
    </view>
	<view class="Unfold" @click="handleExpand" :class="{'show-Unfold':expand}">
	  <view class="test">{{!expand?'查看更多':'收起'}}</view>
		<view class="icon">
			<image v-if="!expand" src="@/static/image/Unfold.png" mode=""></image>
			<image v-else src="@/static/image/Unfold2.png" mode=""></image>
		</view>
	</view>
  </view>
</template>

<script>
export default {
	props: {
	    expand: Boolean,
	},
  data() {
    return {
      expandState: false,
	  contentState:false,
      contentHeight:0,
	  position:false,
	  List:[
		  {
			  name:'血常规',
			  state:'已报告',
		  },
		  {
		  	  name:'胃镜',
		  	  state:'已报告',
		  },
		  {
		  	  name:'心脏超声',
		  	  state:'等报告',
		  },
		  {
		  	  name:'肝功能',
		  	  state:'等报告',
		  },
		  {
		  	  name:'前列腺超声',
		  	  state:'预约中',
		  },
	  ],
    };
  },
  created() {
    this.updateContentHeight();
  },
  updated() {
    this.updateContentHeight();
  },
  methods: {
    report(state){
		if(state==='已报告'){
			uni.navigateTo({
				url: `/sub_packages/report/examine`
			})
		}
	},
    updateContentHeight() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('#content-box').boundingClientRect((data) => {
          if (data) {
            this.contentHeight = data.height;
			setTimeout(()=>{
				this.position = true
			},1000)
          }
        }).exec();
      });
    },
    handleExpand() {
		if(!this.position){
			return
		}
	  this.expandState = this.expand
	  this.expandState = !this.expandState;
	  this.$emit('handle',this.expandState)
    },
  },
};
</script>

<style lang="less" scoped>
	.pos {
	 position: absolute;
	 bottom: 0;
	}
.expand-box {
  position: relative;
  overflow: hidden;
  min-height: 164rpx;
  // margin-bottom: 30rpx;
  background: #ffffff;
}

.head {
	z-index: 2;
	width: 750rpx;
	height: 106rpx;
	position: relative;
	background: #ffffff;
	
	.title {
		height: 46rpx;
		background: #f7f8fa;
		font-size: 28rpx;
		line-height: 28rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		view{
			width: 25%;
			height: 46rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-right: 2rpx solid #ededed;
			&:nth-of-type(4){
				border: 0;
			}
			
		}
	}
	.middle {
		height: 60rpx;
		font-size: 32rpx;
		line-height: 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #1A78C6;
		
		view{
			width: 25%;
			height: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-right: 2rpx solid #ededed;
			&:nth-of-type(4){
				border: 0;
			}
		}
	}
}
.content-box {
  transition: margin-top 0.4s;
  margin: 0 auto;
  width: 694rpx;
  
  .content-head{
	  height: 52rpx;
	  background: #f7f8fa;
	  display: flex;
	  view {
		  font-size: 28rpx;
		  line-height: 28rpx;
		  width: 50%;
		  height: 52rpx;
		  display: flex;
		  justify-content: center;
		  align-items: center;
		  border-right: 2rpx solid #ededed;
		  &:nth-of-type(2){
		  	border: 0;
		  }
		  
	  }
  }
  >ul {
	  li {
		  display: flex;
		  justify-content: center;
		  align-items: center;
		  border-bottom: 2rpx solid #ededed;
		  
		  > view {
			  padding: 0 10rpx;
			  min-height: 50rpx;
			  font-size: 28rpx;
			  line-height: 28rpx;
			  display: flex;
			  justify-content: center;
			  align-items: center;
			  border-right: 2rpx solid #ededed;
			  &:nth-of-type(1){
			  	width: 50%;
			  }
			  &:nth-of-type(2){
			  	width: 25%;
			  }
			  &:nth-of-type(3){
				border: 0;
			  	width: 25%;
			  }
		  }
		  .blue {
			  color: #1B98FF;
		  }
	  }
  }
}
.Unfold {
  position: relative;
  background: #ebf5ff;
  color: #0664B1;
  display: flex;
  justify-content: center;
  align-items: center; 
  height: 59rpx;
  .test {
    font-weight: bold;
    font-size: 28rpx;
	margin-right:10rpx;
  }
  .icon {
    width: 40rpx;
    height: 40rpx;
    
    image {
  	  width: 40rpx;
  	  height: 40rpx;
    }
  }
  
}
.show-Unfold{
	
	background: #f3f3f3;
	color: #848484;
	box-shadow: 0rpx 4rpx 8rpx 0rpx #d9d9d9;
}



</style>
