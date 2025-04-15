<template>
	<view class="doctors">
		<van-notice-bar text="温馨提示：开放7天号源，每天18：00放出第八天号源" />
		<view class="timeCard">
			<scroll-view 
				:scroll-x="true" 
				:show-scrollbar="true"
				scroll-with-animation
				class="scroll-container"
			>
				<view 
					v-for="(item,index) in timeList" 
					:key="index" 
					class="scroll-item"
					:class="{back:timeObj.date===item.date}"
					@click="getScheduleDetail(item,index)"
				>
					<view>{{item.week}}</view>
					<view>{{item.date.substring(item.date.indexOf("-") + 1)}}</view>
					<view :class="{col:item.status==='无号'}">{{item.status}}</view>
				</view>
			</scroll-view>
		</view>
		<view class="middle">
			<view class="center" v-for="(item,index) in doctorList" :key="index">
				<view class="datum">
					<view class="img">
						<image src="../../static/image/doctor.png" mode=""></image>
					</view>
					<view class="message">
						<view class="name">
							<text>{{item.doctName}}</text>
							<text>{{item.doctTech}}</text>
							<!-- <text class="money">￥{{item.regAmount / 100}}</text> -->
						</view> 
						<view class="synopsis">{{item.doctSpec ? item.doctSpec : '暂无简介'}}</view>
					</view>
				</view>
				<view class="footer">
					<view class="subscribe" v-for="(i,x) in item.Scheduling" :key="x">
						<view class="num">
							<view class="subscribe-time">{{item.medDate}}</view>
							<view class="subscribe-am">{{i.medAmPmName}}</view>
						</view>
						<view>
							<text class="money">￥{{item.regAmount / 100}}</text>
						</view>
						<view>
							<button
								v-if="i.restNum > 0"
								type="primary" 
								size="mini" 
								style="background-color: #007AFF; color: white; margin-right: 10rpx;" 
								@click="today ? doctorReserve(item, i.medAmPm, {}) : doctorDetails(item, i.restNum, i.medAmPm)" 
							>
								剩余{{i.restNum < 0 ? 0 : i.restNum}}
							</button>
							<button
								v-else
								type="primary" 
								size="mini" 
								style="background-color: #ccc; color: white; margin-right: 10rpx;" 
							>
								剩余0
							</button>
						</view>
						
						<!-- <view   v-if="item.restNum > 0" disabled>预约</view> -->
					</view>
				</view>
			</view>
		</view>
		<!-- 选择时间 -->
		<uni-popup class="Dialog" :mask-click="false" ref="popup" type="bottom"  :safeArea="false" >
		  <view class="center">
			  <view class="Dialog-title">
			  	<view class="title-time">
			  		{{timeObj.date}} {{timeObj.week}}
			  	</view>
			  	<view class="title-img" @click="close">
			  		<image src="@/static/image/icon-close.png" mode=""></image>
			  	</view>
			  </view>
			  <!-- <view class="Dialog-m_a">
			  	<text  v-for="(i,x) in optList.Scheduling" :key="x" :class="{colour:doctor.medAmPmName===i.medAmPmName}" @click="doctorDetails(optList,i.restNum,i.medAmPm)">
						{{i.medAmPmName}}
					</text>
			  </view> -->
			<scroll-view class="scroll" :enhanced="true" :scroll-y="true" :show-scrollbar="true">
			<view class="middle">
				<view @click="doctorReserve(doctorInfo, medAmPm, item)" class="list" hover-class="is-hover" hover-stay-time="200" v-for="(item,index) in doctorTimeList" :key="index">
					{{item.medBegTime}} - {{item.medEndTime}}
				</view>
			</view>
			</scroll-view>
			
		  </view>
		  
		</uni-popup>
	</view>
</template>

<script>
import registrationApi from '@/api/registrationApi.js'
	import login from '@/utils/login.js'
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				checked: true,
				CLGRPRowId:'',
				timeList:[],
				title:'',
				timeObj:{
					week:'',
					date:'',
				},
				optList:[],
				doctorList:[],
				doctor:{},
				doctorTimeList:[],
				today:true,   //是否是当天的
				nowDate:'',
				siginData: {},
				regMode: 1,
				doctorInfo: {},
				medAmPm: '',
				restNum: '',
			}
		},
		computed: {
			...mapState(['footData']),
		},
		methods: {
			// 获取号源
			getScheduleDates(){
				const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
				for (let i = 0; i < 7; i++) {
					const date = new Date();
					date.setDate(date.getDate() + i);
					const year = date.getFullYear();
					const month = (date.getMonth() + 1).toString().padStart(2, '0');
					const day = date.getDate().toString().padStart(2, '0');
					const weekDay = days[date.getDay()];
					this.timeList.push({
						date: `${year}-${month}-${day}`,
						week: weekDay,
						deptCode: this.deptCode,
						status: "有号"
					});
				}
				this.nowDate = this.timeList[0].date;
				this.getScheduleDetail(this.timeList[0],0)
			},
			
			// 获取医生
			getScheduleDetail(item,index){
				this.timeObj = item
				if(index===0){
					this.today = true
				}else{
					this.today = false
				}
				this.optList = item;
				this.regMode = this.today ? 2 : 1; //1 预约  2  挂号
				registrationApi.getScheduleDetail({
					regMode: this.regMode, 
					regType: '',
					deptCode:this.deptCode,
					startDate: item.date,
					endDate:item.date
				}).then(res => {
					let result = JSON.parse(res.data.msg);
					if (result.success) {
						this.doctorList = this.mergeDoctorSchedules(result.data);
					} else {
						uni.showToast({
							title: result.msg,
							icon: 'none',  
							duration: 2000
						});
					}
					
				})
				.catch(err => {
					console.log('2：', err);
				})
			},
			//格式化医生排班信息
			mergeDoctorSchedules(data) {
			  const mergedDoctors = {};
			  data.forEach(item => {
			    // 如果医生不存在，创建基础信息
			    if (!mergedDoctors[item.doctCode]) {
			      mergedDoctors[item.doctCode] = {
			        deptCode: item.deptCode,
			        deptName: item.deptName,
			        doctCode: item.doctCode,
			        doctName: item.doctName,
			        doctTech: item.doctTech,
			        doctSpec: item.doctSpec,
			        doctIntro: item.doctIntro,
			        medDate: item.medDate,
			        regFee: item.regFee,
			        treatFee: item.treatFee,
			        checkFee: item.checkFee,
							regAmount: item.regAmount,
							scheduleId: item.scheduleId,
							limitNum: item.limitNum,
							hosRegType: item.hosRegType,
							doctPictureUrl: item.doctPictureUrl,
							status: item.status,
							pmOpenStartTime: item.pmOpenStartTime,
							pmOpenEndTime: item.pmOpenEndTime,
			        Scheduling: []
			      };
			    }
					
			    // 添加排班信息（排除已存在的属性）
			    const scheduleItem = {
			      medAmPm: item.medAmPm,
			      medAmPmName: item.medAmPmName,
			      waitNum: item.waitNum,
			      restNum: item.restNum
			    };
					
			    mergedDoctors[item.doctCode].Scheduling.push(scheduleItem);
			  });
			  
			  return Object.values(mergedDoctors);
			},
			
			onChange(detail) {
				this.checked = detail.detail
			},
			//预约挂号
			doctorDetails(item, restNum, medAmPm){
				if (!this.siginData.patientName) {
					login.loginData().catch((error) => {});
				} else {
					//获取医生详细号源
					registrationApi.getNumSource({
						regMode: this.regMode,
						regType: '',
						scheduleId: item.scheduleId,
						medDate: item.medDate,
						medAmPm,
						deptCode: item.deptCode,
						secondDeptCode: '',
						doctCode: item.doctCode,
					}).then(res => {
						let result = JSON.parse(res.data.msg);
						if (result.success) {
							this.doctorTimeList = result.data;
							this.doctorInfo = item;
							this.medAmPm = medAmPm;
						} else {
							uni.showToast({
								title: result.msg,
								icon: 'none',  
								duration: 2000
							});
						}
					}).catch(err => {
						console.log('2：', err);
					})
					this.$refs.popup.open('bottom')
					
				}
			},
			
			doctorReserve(item, medAmPm, reserveItem) {
				console.log(reserveItem);
				if (!this.siginData.patientName) {
					login.loginData().catch((error) => {});
				} else {
					this.doctor = {
						DoctorName: item.doctName,
						DoctorSessType: item.doctTech,
						AdmitAddress: item.address,
						Fee: item.regAmount / 100,
						ServiceDate: item.medDate,
						SessionName: item.medAmPmName,
						clinic:this.title,
						today:this.today,
						scheduleItemCode: item.doctCode,
						medAmPm: medAmPm,
						scheduleId: item.scheduleId,
						StartTime: reserveItem.medBegTime !== undefined ? reserveItem.medBegTime : '',
						EndTime: reserveItem.medEndTime !== undefined ? reserveItem.medEndTime : '',
						appoNo: reserveItem.appoNo !== undefined ? reserveItem.appoNo : '',
					}
					uni.navigateTo({
						url: `/sub_packages/subscribe/doctorDetails?title=${this.title}&doctor=${encodeURIComponent(JSON.stringify(this.doctor))}&detail=${encodeURIComponent(JSON.stringify(item))}&regMode=${this.regMode}`
					})
				}
			},
			
			close(){
				this.$refs.popup.close()
			},
			
		},
		onLoad(e) {
			this.title = e.title
			wx.setNavigationBarTitle({
				title: e.title
			})
			this.deptCode = e.deptCode
		},
		mounted() {
			this.getScheduleDates()
			let data = uni.getStorageSync('loginData');
			this.siginData = data.defaultArchives ? data.defaultArchives : {};
		},
		
	}
</script>

<style lang="less" scoped>
	.col{
		color: #999999 !important;
	}
	.colour{
		color: #4286FF !important;
	}
	.back{
		background: #4286FF !important;
		view {
			color: #ffffff !important;
		}
	}
    .doctors {
	    width: 100vw;
	    height: 100%; 
	    background-color: #f5f5f5;
	    display: flex;
		// align-items: center;
	    flex-direction: column;
		
		/deep/.van-notice-bar{
			background: #f0f7ff;
			height: 58rpx;
			font-size: 25rpx;
			line-height: 25rpx;
			.van-notice-bar__wrap {
				display: flex;
				justify-content: center;
				align-items: center;
				color: #4286ff;
			}
		}
		.timeCard{
			.scroll-container {
			  width: 100%;
			  white-space: nowrap; /* 防止子元素换行 */
			}
			.scroll-item {
				display: inline-block;
				margin:18rpx 10rpx;
				width: 130rpx;
				height: 123rpx;
				background: #ffffff;
				border-radius: 11.45rpx;
				text-align: center;
				view {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 33.33%;
					
					&:nth-of-type(1){
						font-size: 23rpx;
						line-height: 23rpx;
						color: #666666;
					}
					&:nth-of-type(2){
						font-size: 27rpx;
						line-height: 26rpx;
					}
					&:nth-of-type(3){
						font-size: 23rpx;
						line-height: 23rpx;
						color: #4286ff;
					}
				}
			}
		}
		
		.head {
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 27rpx;
			height: 40rpx;
			line-height: 5rpx;
			margin:10rpx 34rpx;
			
			.left {
				.time {
					margin-right: 15rpx;
				}
			}
			.right {
				display: flex;
				align-items: center;
				
				>text {
					display: inline-block;
					margin-right: 15rpx;
				}
			}
		}
		
		.middle {
			overflow: auto;
			margin: 15rpx  0 50rpx 0;
			
			.center {
				width: 680rpx;
				// height: 350rpx;
				background: #ffffff;
				border-radius: 11.45rpx;
				margin: 25rpx auto;
				padding: 20rpx 0;
				
				&:nth-of-type(1){
					margin-top: 5rpx;
				}
				&:last-of-type{
					margin-bottom: 20rpx;
				}
				
				.datum{
					margin:0 10rpx;
					padding: 17rpx 0;
					display: flex;
					
					.img{
						width: 122.14rpx;
						height: 152.67rpx;
						border-radius: 9.54rpx;
						image{
							width: 122.14rpx;
							height: 152.67rpx;
							border-radius: 9.54rpx;
						}
					}
					.message {
						margin-left:24rpx;
						padding-top: 20rpx;
						.name {
							display: flex;
							align-items: center;
							position: relative;
							text {
								
								&:nth-of-type(1){
									font-size: 36rpx;
									line-height: 27rpx;
									margin-right: 20rpx;
								}
								&:nth-of-type(2){
									font-size: 30rpx;
									line-height: 23rpx;
									color: #999999;
									margin-right: 20rpx;
								}
								
							}
							.expert{
								display: inline-block;
								width: 95.42rpx;
								height: 30.53rpx;
								background: #f3fffc;
								border: 0.95rpx solid #3cd0aa;
								border-radius: 7.63rpx;
								font-size: 19.08rpx;
								line-height: 19.08rpx;
								color: #3cd0aa;
								display: flex;
								justify-content: center;
								align-items: center;
							}
							
							
						}
						.synopsis {
							width: 508rpx;
							height: 99rpx;
							margin-top: 18rpx;
							font-size: 23rpx;
							line-height: 26rpx;
							color: #999999;
							overflow: hidden;
							display: -webkit-box; //将元素设为盒子伸缩模型显示
							-webkit-box-orient: vertical; //伸缩方向设为垂直方向
							-webkit-line-clamp: 4;  //超出3行隐藏，并显示省略号
							
						}
					}
				}
				
				.footer {
					.subscribe{
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 57.25rpx;
						margin: 20rpx;
						.money {
							font-size: 32rpx;
							color: #FAAA03;
						}
						.num {
							display: flex;
							align-items: center;
							
							.subscribe-time{
								margin-right: 80rpx;
							}
							.subscribe-number{
								text {
									&:last-of-type{
										color: #4286FF;
									}
								}
							}
						}
						.subscribe-btn {
							width: 137.4rpx;
							height: 57.25rpx;
							background: rgba(66,134,255,0.08);
							border-radius: 38.17rpx;
							color: #4286FF;
							font-size: 26.72rpx;
							line-height: 26.72rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							margin-right: 20rpx;
						}
					}
				}
			}
		}
		.Dialog {
						width: 750rpx;
						
						.center {
							width: 750rpx;
							background-color: #ffffff;
							border-radius: 30rpx 30rpx 0 0;
							height: 720rpx;
							overflow: hidden;
							
							.Dialog-title {
								margin: 10rpx 30rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								
								.title-time {
									letter-spacing: 2rpx;
								}
								.title-img {
									width: 63rpx;
									height: 63rpx;
									display: flex;
									justify-content: center;
									align-items: center;
									image {
										width: 45.8rpx;
										height: 45.8rpx;
									}
								}
							}
							.Dialog-m_a{
								margin: 20rpx 30rpx 10rpx 30rpx;
								color: #666666;
								> text {
									display: inline-block;
									margin: 0 30rpx;
									padding: 10rpx;
									
									&:first-of-type{
										margin: 0 30rpx 0 0;
									}
								}
							}
							
						.scroll {
								height: 72%;
								
								.middle {
									    margin: 0 20rpx 0 20rpx;
										display: flex;
										flex-wrap: wrap;
										> .list {
											border-radius: 4px;
											flex-grow: 1;
											display: flex;
											justify-content: center;
											align-items: center;
											padding: 12rpx 30rpx;
											margin: 16rpx;
											color: #4286FF;
											font-size: 27rpx;
											background: #F3F8FF;
											border-radius: 40rpx;
											
										}
										.is-hover {
											background: #4286FF;
											color: #fff;
										}
										
									}
								}
								
							}
					}
					
	}
</style>
