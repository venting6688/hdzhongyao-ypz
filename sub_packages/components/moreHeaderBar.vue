<!-- <template>
	<view class="head">
		<view class="back" v-if="HeaderBar.state" :style="{paddingTop: menuButtonInfo.top + 'px'}">
			<image src="../static/image/back.png" @click="back" mode=""></image>
		</view>
		<view class="navTop" :style="{paddingTop: menuButtonInfo.top + 'px'}">{{HeaderBar.title?HeaderBar.title:''}}</view>
		
		<view class="text">
			<view class="title"><image class="background" src="../static/image/text.png" mode="widthFix"></image></view>
			<view class="news">
				{{ animatedText.slice(0,39) }}
			</view>
		</view>
		<view class="department">
			<view class="img">
				<image src="../static/image/doc-bg@2x.png" mode=""></image>
			</view>
			<view class="center">
				<view class="doctor">
					<view class="name">
						<text>郭友强</text>
					    <text>主任医师</text>
					</view>
					
					<view class="clinic">
						肾内科门诊
					</view>
				</view>
				<view class="center-img">
					<image src="../static/image/icon-预约@2x.png" mode=""></image>
				</view>
			</view>
			
		</view>
		<view class="anhao">
			<image src="../static/image/安好12 1.png" mode=""></image>
		</view>
	</view>
</template>
<script>
	import HeaderbarApi from '@/api/HeaderbarApi.js'
	import bus from "@/utils/bus.js";
export default {
	props: {
		HeaderBar: Object
	},
	data() {
		return {
			menuButtonInfo:{},
			barList: [],
			headerEmit:{
				visitNumber:'',
				userId:'',
				state:'',
			},
			animatedText: '',
			interval: null,
			nanbers: null,
			getSuggestTimer:null,
			getSuggestText:'',
			departmentList:[],
			userId:'',
			userIdList:[],
		}
	},
	async created() {
		await this.getSuggest()
		this.animateText()
	},
	mounted(){
		this.menuButtonInfo = wx.getMenuButtonBoundingClientRect();
	},
	methods: {
		back(){
			uni.navigateBack()
		},
		//获取建议列表
		async getSuggest() {
			clearTimeout(this.getSuggestTimer)
			// try{
			// 	const res = await HeaderbarApi
			// 	.getSuggest(
			// 		this.headerEmit.visitNumber
			// 	)
			// 	.then((data) => {
			// 		this.getSuggestText = data.data[0]? data.data[0]:''
			// 	})
			// }catch(e){
			// 	//TODO handle the exception
			// }
			this.getSuggestText = '根据您的就诊记录为您推荐挂号'
			
			this.getSuggestTimer = setTimeout(()=>{
				this.getSuggest()
			},20000)
		},
		animateText() {
			if (this.interval) {
				clearInterval(this.interval)
			}
			this.animatedText = ''
			let index = 0
			if(this.getSuggestText){
				this.interval = setInterval(() => {
				this.animatedText += this.getSuggestText[index]
				index++
				if (index === this.getSuggestText.length) {
					clearInterval(this.interval)
				}
			}, 100)
			console.log(this.animatedText)
			}
			
		}
	},
	
}
</script>

<style lang="less">
.head {
	overflow: hidden;
	position: relative;
	flex: 0 0 auto;
	width: 100%;
	height: 570rpx;
	background: linear-gradient(303deg,#5fa8ff 0%, #9bc9ff 43%, #f6faff 100%);
	
	.navTop{
	  width: 100%;
	  height: 40px;
	  line-height: 34px;
	  text-align: center;
	  font-weight: 700;
	  font-size: 34rpx;
	  position: fixed;
	  top: 0;
	  left: 0;
	  
	}
	.back{
	  width: 100%;
	  height: 40px;
	  line-height: 34px;
	  font-size: 34rpx;
	  position: fixed;
	  top: 0;
	  left: 0;
	  
	  
	  image {
		  width: 25px;
		  height: 25px;
		 
		  transform: translate(20rpx,10rpx);
		  
		   
	  }
	  
	}

	
	

	.text {
		position: absolute;
		width: 450rpx;
		top: 160rpx;
		color: #333333;
		font-weight: 600;
		margin: 60rpx 0 0 50rpx;

		>.title {
			margin-bottom: 50rpx;
			>image {
				width: 440rpx;
			    height: 40rpx;
			}
			
		}

		.news {
			margin-top: 10rpx;
			font-size: 32rpx;
		}
	}
	.department {
		position: absolute;
		bottom: 60rpx;
		left: 50rpx;
		
		.img{
			image {
				width: 370.23rpx;
				height: 114.5rpx;
			}
		}
		
		.center {
			width: 90%;
			margin: 0 20rpx;
			height: 114.5rpx;
			position: absolute;
			top: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.doctor {
				.name {
					display: flex;
					align-items: center;
					text {
						&:nth-of-type(1){
							font-size: 26.72rpx;
							font-weight: 600;
						}
						&:nth-of-type(2){
							margin-left: 10rpx;
							color: #333333;
							font-size: 19.08rpx;
						}
					}
				}
				
			}
			.center-img {
				image {
					display: inline-block;
					width: 41.98rpx;
					height: 41.98rpx;
				}
			}
		}
		
	}

	.anhao {
			position: absolute;
			bottom: -8rpx;
			right: 0;
			// bottom:0,
			>image {
				width: 400rpx;
				height: 420rpx;
			}
		}

	.icon {
		position: absolute;
		top: 10rpx;
		left: 340rpx;
		width: 100rpx;
		height: 44rpx;
	}
	.dist {
		position:fixed;
		background: #edfeff;
		border: 2rpx solid #499eff;
		box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(73,160,252,0.40);
		border-radius: 38rpx;
		transform: translate(20rpx,232rpx);
		>ul {
			display: flex;
			align-items: center;
			margin:0 6rpx;
			
			li {
				height: 78rpx;
				display: flex;
				align-items: center;
				.test {
					min-width: 160rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					padding: 0 18rpx;
				    height: 71rpx;
				    margin:  0;
				    border-radius: 32rpx;
				    font-size: 28rpx;
					line-height: 28rpx;
				    font-weight: 400;
				  
			    }
				.wire {
					width: 2rpx;
					height: 56rpx;
					margin: 0 6rpx;
					background: #cacaca;
				}
				&:last-child{
					.wire {
						margin: 0;
						width: 0;
					}
					
				}
			}
		}
			
	}
	.bar {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 72rpx;
		background: rgba(255, 255, 255, 0.82);
		box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(31, 104, 135, 0.14);
		// filter: blur(40rpx);
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: #888888;

		.barList {
			display: flex;
			justify-content: center;
			width: 100%;
			&:nth-of-type(even){
				max-width: 60rpx;
				 .bar-name {
					 >view {
						  >text {
							  padding: 0;
							  padding: 0 0 0 15rpx;
				 }
					 }
				 }
				
			}
			.bar-name {
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				width: 70%;
				height: 60rpx;
				
				>view {
					display: flex;
					align-items: center;
					white-space: nowrap;
					justify-content: center;
					height: 52rpx;
					font-size: 32rpx;
					line-height: 32rpx;
					
					>text {
						border-radius: 10rpx;
						padding: 10rpx 20rpx;
						// width: 110rpx;
					}
				}
				
				
				.icons {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 30%;
					background: #222;
					font-size: 28rpx;
					height: 60rpx;
					letter-spacing: -10rpx;
				
					text {
						display: block;
						line-height: 28rpx;
					}
				}
			}
			
		}
	}
	.barColor {
		color: #0f74c8 !important;
	}
	.barBackground {
		background: #1b98ff !important;
		color: #ffffff;
	}
}
</style -->>
