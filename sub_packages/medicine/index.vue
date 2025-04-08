<template>
	<view class="medicine">
		<!-- <CustomNavBar :showBack="showBack" :title="title"/> -->
		<view class="content">
			<view class="title">
				<!-- <image @click="affirm" src="@/static/image/Frame 2121@2x.png" mode=""></image> -->
				<image src="../static/image/Frame-1.png" mode=""></image>
				<view class="test">
					<image v-if="stateName==='待取药' || stateName==='已取药'" src="../static/image/Frame-2.png" mode=""></image>
					<text>{{stateName}}</text>
				</view>
			</view>
			<view class="prescription">
				<ul>
					<li v-for="(item,index) in prescriptionList" @click="prescription(item,index)" :key="index">
					  <view :class="{black:index===num}">处方{{index+1}}</view>
						<view class="wire" v-if="index===num"></view>
					</li>
				</ul>
				<view class="pre-middle">
					<view>
						<text>处方单号:</text>
						<text>{{prescriptionObj.prescNo ? prescriptionObj.prescNo : 1001}}</text>
					</view>
					<view>
						<text>取药科室:</text>
						<text>{{prescriptionObj.reclocdesc ? prescriptionObj.reclocdesc : '西药房'}}</text>
					</view>
					<view>
						<text>科室位置:</text>
						<text>{{prescriptionObj.reclocaddress ? prescriptionObj.reclocaddress : '一楼东侧'}}</text>
					</view>
				</view>
				<view class="tips" v-if="prescriptionObj.presctype==='中药' && (!prescriptionObj.mailingStatus || prescriptionObj.mailingStatus == '未申请')">
					<text>注意：请耐心等待,或申请配送到家</text>
					<button class="cu-btn" @click="distribution(prescriptionObj.prescNo)">{{distributionName}}</button>
				</view>
				<view class="tips" v-if="prescriptionObj.presctype==='中药' && prescriptionObj.mailingStatus == '已申请'">
					<text>注意：药品配送中，请注意通讯正常</text>
					<button class="cu-btn" @click="viewLogistics('查看物流')">查看物流</button>
				</view>
				
			</view>
			<view class="drug">
				<view class="drug-inventory">
					<view class="drug-head">药品清单</view>
					<!-- 西药 -->
					<ul v-if="prescriptionObj.presctype==='西药'" class="ul1">
						<li v-for="(item,index) in prescriptionObj.dtlvws" :key="index">
							<view>
								{{item.drugName}}
							</view>
							<view class="unit-price">
								<!-- <text>单价：{{item.costs*1}} * {{item.quantity}}</text> -->
								<text>数量：{{item.quantity}}</text>
								<text>￥{{Math.round(item.costs * 100) / 100}}</text>
							</view>
						</li>
					</ul>
					<!-- 中药 -->
					<ul v-else class="ul2">
						<li v-for="(item,index) in prescriptionObj.dtlvws" :key="index">
							<view class="">
								{{item.drugName}}{{item.dosage}}{{item.unit}}
							</view>
						</li>
					</ul>
					<!-- 西药合计 -->
					<view v-if="prescriptionObj.presctype==='西药'" class="total">
						<text>合计:</text>
						<text>￥{{Math.round(prescriptionObj.payments * 100) / 100}}</text>
					</view>
					<!-- 中药合计 -->
					<view class="total total2" v-else>
						<view class="">
							药剂：{{prescriptionObj.repetition ? prescriptionObj.repetition : 0}}剂
						</view>
						<view class="">
							<text>合计:</text>
							<text>￥{{Math.round(prescriptionObj.payments * 100) / 100}}</text>
						</view>
					</view>
				</view>
				<view class="drug-guidance">
					<view class="drug-head">用药指导</view>
					<ul>
						<li v-for="(item,index) in prescriptionObj.list2" :key="index">
							<image v-if src="@/static/image/Star 5@2x.png" mode=""></image>
							<text>{{item}}</text>
						</li>
					</ul>
				</view>
			</view>
		</view>
		<!-- <foot v-if="showComponent" :footState="footState"/> -->
	</view>
</template>
<script>
	// import foot from '@/components/footer.vue'
	// import CustomNavBar from '@/components/CustomNavBar.vue';
	import mixin from '@/mixins/mixin'
	import login from '@/utils/login.js'
	import prescriptionApi from '@/api/prescriptionApi.js'
	export default {
		mixins: [mixin],
		data(){
			return {
				distributionName:'申请配送',
				num:0,
				footState:1,
				showComponent: true,
				stateName:'待取药',
				prescriptionObj:{
					presctype: '',
					status: ''
				},
				prescriptionList:[],
				timer: null
			}
		},
		components:{
			// foot,
			// CustomNavBar,
		},
		methods: {
			getValue(str){
				this.distributionName = '查看物流'
				this.stateName = '正在配送'
			},
			prescription(item,index){
				this.num = index
				this.prescriptionObj = item
				this.stateName = item.status;
			},
			distribution(prescNo){
				if(this.distributionName==='申请配送'){
					uni.navigateTo({
						url:`/sub_packages/addressBook/index?num=${prescNo}&type=logistics`
					})
				}else{
					uni.showToast({
					    title: '暂未开放',
					    icon: 'none',   
					    duration: 2000 
					})  
				}
			},
			viewLogistics(){
				uni.showToast({
						title: '暂未开放',
						icon: 'none',
						duration: 2000 
				})  
			},
			// 登录成功后重新渲染foot
			updateData(){
				this.showComponent = false
				this.$nextTick(()=>{
					this.showComponent = true
				})
			},
			//获取处方
			getPrescription(){
				try {
					let loginValue = uni.getStorageSync("loginData");
					let idCardNum = loginValue.idNo != null ? loginValue.idNo : loginValue.patientCard
					
					prescriptionApi.getPrescription(idCardNum).then(res => {
						if(res.data.code===200){
							let arr = res.data.data ? res.data.data.mstvws || [] : [];
							if (arr.length) {
								this.prescriptionList = arr
								this.prescriptionObj = {
									prescNo: arr[this.num].prescNo,
									reclocdesc: arr[this.num].reclocdesc,
									reclocaddress: arr[this.num].reclocaddress,
									presctype: arr[this.num].presctype,
									payments: arr[this.num].payments,
									mailingStatus: arr[this.num].mailingStatus,
								}
								this.prescriptionObj.dtlvws = arr[this.num].dtlvws;
								this.stateName = arr[this.num].status
							}
						}else {
							this.prescriptionList = []
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			},
			//设置定时器
			startTimer() {
				this.timer = setInterval(() => {
					this.getPrescription();
				}, 10 * 60 * 1000); //每隔 10 分钟请求一次
			},
			// 清除定时器
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
		},
		onShow() {
			let loginValue = uni.getStorageSync("loginData");
			loginValue = loginValue.defaultArchives ? loginValue.defaultArchives : false;
			if (!loginValue.patientName) {
				login.loginData()
			} else {
				this.getPrescription()
			}
		},
		onLoad() {
			this.startTimer();
		},
		onUnload() {
			this.clearTimer();
		},
	}
</script>

<style lang="less" scoped>
	.black {
		color: black !important;
	}
	.medicine {
		width: 100vw;
		height: 100%; 
		display: flex;
		flex-direction: column;
		
		.content {
			width: 750rpx;
			flex: auto;
			overflow: auto;
			
			.title {
				height: 100rpx;
				margin-top: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				>image {
					position: absolute;
					width: 488rpx;
					height: 100rpx;
				}
				.test{
					display: flex;
					justify-content: center;
					align-items: center;
					>image {
						width: 48rpx;
						height: 48rpx;
						margin-right: 25rpx;
					}
					text {
						font-size: 48rpx;
						font-weight: 500;
						text-align: center;
						color: #4286ff;
						line-height: 48rpx;
					}
				}
				
			}
			.prescription {
				width: 710rpx;
				background: #ffffff;
				border-radius: 16rpx;
				margin: 30rpx auto 20rpx auto;
				ul {
					padding:20rpx 0;
					margin: 0 20rpx;
					display: flex;
					height: 90rpx;
					overflow: auto;
					white-space: nowrap;
					border-bottom: 2px solid #f5f5f5;
					li {
						margin-right: 60rpx;
						color: #999999;
						
						.wire {
							margin-top: 10rpx;
							width: 68rpx;
							height: 8rpx;
							background: #4286ff;
							border-radius: 12rpx;
						}
					}
				}
				.pre-middle {
					padding:20rpx;
					view {
						margin-top:12rpx;
						&:first-child {
							margin:0;
						}
						text {
							&:first-child {
								color: #707070;
								margin-right:14rpx;
							}
							
						}
					}
				}
				.tips {
					padding:20rpx 20rpx 30rpx 20rpx;
					color: #2674FF;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					button {
						width: 192rpx;
						height: 56rpx;
						border: 2rpx solid #4286ff;
						color: #2674FF;
						background: #fff;
						border-radius: 12rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
			.drug {
				width: 712rpx;
				background: #ffffff;
				border-radius: 16rpx;
				margin: 0 auto;
				.drug-head{
					font-size: 28rpx;
					color: #000000;
					font-weight: 600;
					margin-bottom: 20rpx;
				}
				.drug-inventory{
					padding: 20rpx;
					.ul1 {
						padding-bottom: 30rpx;
						border-bottom: 2rpx solid #eeeeee;
						>li {
							margin-top: 28rpx;
							.unit-price {
								margin-top: 6rpx;
								display: flex;
								justify-content: space-between;
								text {
									&:first-child{
										color: #aaaaaa;
									}
								}
							}
						}
					}
					.ul2 {
						display: flex;
						flex-wrap: wrap;
						
						>li {
							width: 33.33%;
							display: flex;
							justify-content: center;
							align-items: center;
							flex-wrap: wrap;
							border-bottom: 2rpx solid #dcdfe5;
							border-right: 2rpx solid #dcdfe5;
							&:nth-child(-n+3){
								border-top: 2rpx solid #dcdfe5;
							}
							&:nth-child(3n + 1){
								border-left: 2rpx solid #dcdfe5;
							}
							// &:nth-child(3n){
							// 	border-right:0;
							// }
							view {
								padding: 10rpx 0;
							}
						}
					}
					.total {
						text-align: right;
						margin: 20rpx 0 10rpx 0;
						text {
							&:last-child {
								color: red;
							}
						}
					}
					.total2 {
						padding-bottom: 30rpx;
						border-bottom: 2rpx solid #eeeeee;
						display: flex;
						justify-content: space-between;
					}
				}
				.drug-guidance{
					padding: 20rpx;
					
					ul {
						li {
							padding: 10rpx 0;
							display: flex;
							image {
								width: 24rpx;
								height: 24rpx;
								margin-right: 20rpx;
							}
							text {
								display: inline-block;
								color: #707070;
								line-height: 28rpx;
							}
						}
					}
				}
			}
		}
	}
</style>




