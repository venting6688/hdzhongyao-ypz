<template>
	<view class="check">
		<view class="center" v-for="(item,index) in checkContentList" :key="index">
			<view class="title" v-if="item.callObj.execDept">
				<view class="clinic">
					{{item.callObj.execDept ?item.callObj.execDept :''}}
				</view>
				<view class=" title-calling">
					<view class="left">
					    <view class="no">
						    {{item.callObj.selfNum?item.callObj.selfNum+'号':''}}
					    </view>
					    <view class="text">
						    就诊序号
					    </view>
				    </view>
					<view class="middle">
					    <view class="call">
							{{item.callObj.currentNum?item.callObj.currentNum+'号':''}}
					    </view>
					    <view class="text">
						    正在呼叫
					    </view>
					</view>
				    <view class="right">
					    <view class="time">
				    		{{item.callObj.waitNum?item.callObj.waitNum:''}}
					    </view>
					    <view class="text">
						    等候人数
					    </view>
				    </view>
				</view>
			</view>
			<view class="wire-box " :class="{wireState:!item.callObj.execDept}">
				<view class="wire" v-if="item.callObj.execDept">
					<image src="@/static/image/Group 679.png" mode=""></image>
				    <image src="@/static/image/Group 679.png" mode=""></image>
				</view>
			</view>
			<view class="content">
				<view class="icon">
					<text v-if="shouldShowItem(item)">{{ statusText(item) }}</text>
					<image v-if="shouldShowItem(item)" src="@/static/image/Union.png" mode="widthFix"></image>
					<image v-if="shouldShowItem(item)" src="@/static/image/Union2.png" mode="widthFix"></image>
				</view>
				<ul>
					<li v-if="item.OEORIEnterDeptDesc">
						<view class="attribute">
							查验科室:
						</view>
						<view class="name">
							{{item.OEORIEnterDeptDesc}}
						</view>
					</li>
					<li v-if="item.OEORIARCItmMastDesc">
						<view class="attribute">
							查验项目:
						</view>
						<view class="name">
							{{item.OEORIARCItmMastDesc}}
						</view>
					</li>
					<!-- <li v-if="item.signInStatus=='已签到' && item.callObj.medicalTreatmentNumber">
						<view class="attribute">
							排队序号:
						</view>
						<view class="name">
							{{item.callObj.medicalTreatmentNumber}}号
						</view>
					</li> -->
					<li v-else-if="item.sign">
						<view class="attribute">
							预计等待:
						</view>
						<view class="name">
							{{item.time}}
						</view>
					</li>
					<li  v-if="item.OEORIPrice * item.OEORIOrderQty">
						<view class="attribute">
							查验费用:
						</view>
						<view class="name">
							{{item.OEORIPrice * item.OEORIOrderQty}}元
						</view>
					</li>
					<li  v-if="item.acceptDeptLocation">
						<view class="attribute">
							科室位置:
						</view>
						<view class="name department" @click="navigation">
							{{item.acceptDeptLocation}}
						</view>
						<view class="img">
							<image src="@/static/image/location.png" mode=""></image>
						</view>
					</li>
					<li  v-if="item.notice">
						<view class="attribute">
							注意事项:
						</view>
						<view class="name">
							{{item.notice}}
						</view>
					</li>
				</ul>
				<view class="btn" v-if="shouldShowItem(item)">
					<view>
						<button class="cu-btn" @click="confirm(btnText(item),item,index)" :disabled="item.SigninStatus === '不能线上签到'" :class="{gray:item.SigninStatus === '不能线上签到'}">{{btnText(item)}}</button>
					</view>
					
				</view>
				<!-- <view class="footer" v-else>
					<view>
						<text>检查已经结束，请您移步至检查检验科室继续就诊</text>
					</view>
				</view> -->
			</view>
		</view>
		<view class="img" v-if="!firstContent.queueName&&!subscribeObj.department">
			<image src="../../../static/image/zanwu.png" mode=""></image>
		</view>
		<Toast v-if="toastObj.state" @back="closeToast" :type="toastObj.type" :message="toastObj.message"/>
	</view>
</template>

<script>
	import guideApi from '@/api/guideApi.js'
	import { mapState } from 'vuex'
	import Toast from '../../../components/toast.vue'
	import bus from '@/utils/bus.js'
	export default {
		props: {
		    headerEmit: Object,
		},
		components:{
			Toast,
		},
		data() {
			return {
				checkContentList:[],
				toastObj:{
					state:false,
				},
				timer:null,
			}
		},
		computed: {
			...mapState(['footData']),
		},
		created() {
			// 缴费完成回来刷新数据
			bus.$on('refreshGetcheckVisit',()=>{
				this.getExaminationOrTest(true)
			})
		},
		mounted(){
			this.getExaminationOrTest(true)
			this.timer = setInterval(()=>{
				this.getExaminationOrTest()
			},20000)
		},
		destroyed(){
			clearInterval(this.timer)
			this.timer = null
			bus.$off('refreshGetcheckVisit')
		},
		methods: {
			closeToast(state){
				this.toastObj.state = state
			},
			shouldShowItem(item) {
			    return (item.SigninStatus==='-99'&& item.OEORIBillStatusCode!=='P') || item.SigninStatus!=='-99';
			},
			statusText(item) {
			    if (item.OEORIBillStatusCode!=='P') {
			        return '未缴费';
			    } else if (item.SigninStatus === '已签到') {
			        return '已签到';
			    } else {
			        return '未签到';
			    }
			},
			btnText(item) {
				if (item.OEORIBillStatusCode!=='P') {
				    return '立即缴费';
				} else if (item.SigninStatus === '已签到') {
				    return '刷新信息';
				} else if(item.SigninStatus === '未签到' || !item.SigninStatus){
				    return '立即签到';
				}else{
					return '不支持线上签到';
				}
			},
			navigation(){
				// let latitude = 36.183242794928994
				// let longitude = 117.07709640617486
				// wx.openLocation({
				//           latitude: latitude,//目的地的纬度
				//           longitude: longitude,//目的地的经度
				//           name: '青岛西海岸新区第二中医医院', 
				//})
			},
			async confirm(name,item,index){
				console.log('item',item)
				if(name==='立即缴费'){
					uni.navigateTo({
						url: `/sub_packages/outpatientExpenditure/index?checkState=true`
					})
				}else if(name==='立即签到'){
					this.medicalTechnologySignIn(item)
				}else if(name==='刷新信息'){
					this.medicalTechnologyReportQueue(item,index)
				}
			},
			//签到
			async medicalTechnologySignIn(item){
				try{
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						itemName:item.OEORIARCItmMastDesc,
						itemCode:item.OEORIARCItmMastCode,
						doctorOrderNumber:item.OEORIOrderItemID,
						PatType:'0',
						manufacturers:item.manufacturers,
					}
					const res= await guideApi.medicalTechnologySignIn(data).then((res) => {
						if(res.data.code===200){
							this.toastObj = {
								state:true,
								message:'签到成功',
							}
							this.getExaminationOrTest()
						}else {
							this.toastObj = {
								state:true,
								type:'fail',
								message:'签到失败',
							}
							this.getExaminationOrTest()
						}
					})
				}catch(e){
					this.toastObj = {
						state:true,
						type:'fail',
						message:e.toString(),
					}
					console.log(e)
				}
			},
			// 刷新信息
			async medicalTechnologyReportQueue(item,index,List){
				try{
					let checkList
					if(List){
						checkList = List
					}
					let data = {
						patientID:this.footData.patientUniquelyIdentifies,
						doctorOrderNumber:item.OEORIOrderItemID,
						PatType:'0',
						manufacturers:item.manufacturers,
					}
					const res= await guideApi.medicalTechnologyReportQueue(data).then((res) => {
						if(res.data.code===200){
							if(List){
								this.$set(checkList[index], 'callObj', res.data.data.data[0])
								this.checkContentList = checkList?checkList:[]
							}else {
								this.$set(this.checkContentList[index], 'callObj', res.data.data.data[0])
							}
						}
					})
				}catch(e){
					console.log(e)
					this.toastObj = {
						state:true,
						type:'fail',
						message:e.toString(),
					}
				}
			},
			//获取查验数据
			async getExaminationOrTest(state) {
				try{
					const res= await guideApi.getExaminationOrTest(this.headerEmit.visitNumber).then((res) => {
						if(res.data.code===200){
							if(state){
								// 创建组件时加渐入组件效果
								this.$emit('handle')
							}
							let flag = false
							if(res.data.data.length){
								for (let i = 0; i < res.data.data.length; i++) {
									if(res.data.data[i].SigninStatus!=='-99' && res.data.data[i].OEORIBillStatusCode==='P'){
										this.medicalTechnologyReportQueue(res.data.data[i],i,res.data.data)
										flag = true
									}
									
								}
							}
							if(!flag){
								console.log('没进')
								this.checkContentList = res.data.data?res.data.data:[]
							}
						}else {
							this.toastObj = {
								state:true,
								type:'fail',
								message:'未查询到您的挂号信息',
							}
						}
						
					})
				}catch(e){
					console.log(e)
					this.toastObj = {
						state:true,
						type:'fail',
						message:e.toString(),
					}
				}
						
			},
		}
	}
</script>

<style lang="less">
	.gray{
		background: #777777 !important;
	}
	.check{
		// background: fuchsia;
		
		.center {
			margin:28rpx 33rpx 0 33rpx;
			width: 684rpx;
			background: #ffffff;
			border-radius: 12rpx;
			
			&:last-of-type{
				margin:28rpx 33rpx 28rpx 33rpx;
			}
			
			.title {
				.clinic{
					width: 646rpx;
					height: 56rpx;
					line-height: 36rpx;
					background: #5cb5ff;
					border-radius: 12rpx;
					margin:  22rpx auto;
					transform: translate(0,20rpx);
					font-size: 36rpx;
					color: #ffffff;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				
				
				.title-calling{
					height: 95rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					font-size: 30rpx;
					.left {
					width: 33.33%;
					
					
					.no{
						font-weight: 600;
					}
					.text {
						color: #aaaaaa;
						font-size: 22rpx;
					}
				}
				.middle {
					width: 33.33%;
					border-left: 4rpx solid #DDDDDD;
					border-right:  4rpx solid #DDDDDD;
					.call{
						font-weight: 600;
					}
					.text {
						color: #aaaaaa;
						font-size: 22rpx;
					}
				}
				.right {
					width: 33.33%;
					
					.time {
						font-weight: 600;
					}
					.text {
						font-size: 22rpx;
						color: #aaaaaa;
					}
				}
				}
				
			}
			.wire-box{
				height: 10rpx;
				>.wire {
					display: flex;
					align-items: center;
					justify-content: space-between;
				    height: 0rpx;
				    border: 4rpx solid #eeeeee;
				
				    image{
					    width: 10rpx;
					    height: 36rpx;
					    margin: 0 10rpx;
				    }
			    }
			    .wireState {
			    	border: 2rpx solid #ffffff;
			    }
			}
			
			.content {
				margin-top: 3%;
				padding-bottom: 2.4%;
				position: relative;
				
				.icon {
					position: absolute;
					width: 110rpx;
					height: 52rpx;
					line-height: 52rpx;
					right: -12rpx;
					display: flex;
					flex-direction: column;
					text {
						display: inline-block;
						z-index: 1;
						color: #ffffff;
						font-size: 25rpx;
						
					}
					image {
						position: absolute;
						top: -10rpx;
						width: 110rpx;
						height: 52rpx;
						
						
					}
				}
				
				ul {
					li {
						margin:0 6% 0 4%;
						width: 90%;
						display: flex;
						
						&:first-of-type{
							// margin:3% 6% 0 4%;
						}
						.attribute{
							min-height: 36rpx;
							line-height: 36rpx;
							color: #888888;
							width: 22%;
							display: flex;
							margin-bottom:2%;
							justify-content: left;
						}
						
						.name {
							min-height: 36rpx;
							line-height: 36rpx;
							display: flex;
							align-items: center;
							flex-wrap: wrap;
							text-align: left;
							margin-bottom:2%;
							width: 70%;
						}
						
						.department {
							color: #076AFF;
						}
						.img {
							image {
								width: 34rpx;
								height: 34rpx;
							}
						}
					}
				}
				
				.btn {
					view {
						display: flex;
						justify-content: center;
						
						button {
							
							min-width: 270rpx;
							margin: 24rpx 30rpx;
							height: 72rpx;
							line-height: 72rpx;
							background: linear-gradient(350deg,#479cff 0%, rgba(71,216,251,0.80) 100%);
							border-radius: 70rpx;
							font-size: 35rpx;
							color: #ffffff;
							font-family: Source Han Sans CN, Source Han Sans CN-500;
							font-weight: 500;
						}
					}
				}
				.footer {
					border-top: 2rpx solid #eeeeee;
					width: 94%;
					margin: 0 3%;
					height: 80rpx;
					font-size: 26rpx;
					line-height: 26rpx;
					color: #777777;
					display: flex;
					align-items: center;
					justify-content: center;
					view{
						text{
							
						}
					}
				}
			}
		}
	}
</style>
