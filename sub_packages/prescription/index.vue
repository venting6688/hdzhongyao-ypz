<template>
	<view class="user">
		<!-- <CustomNavBar
		    :showBack="showBack"
		    :title="title"
		/> -->
		<view class="content">
			<ul>
				<li v-for="(item, index) in prescriptionList" :key="index">
					<view class="head">
						<view class="time">
							就诊时间: {{item.prescDate}}
						</view>
						<!-- <view class="medicine">
							<text>查看详情</text>
							<image src="../static/image/Vector@3x.png" mode=""></image>
						</view> -->
					</view>
					<view class="middle">
						<view>
							<text>就诊人:</text>
							<text>{{item.patientName}}</text>
						</view>
						<view>
							<text>就诊科室:</text>
							<text>{{item.orderedByName}}</text>
						</view>
						<view>
							<text>就诊医生:</text>
							<text>{{item.prescribedBy}}</text>
							<!-- <text>主任医师</text> -->
						</view>
						<view>
							<text>处方单号:</text>
							<text>{{item.prescNo}}</text>
						</view>
					</view>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin'
	// import CustomNavBar from '@/components/CustomNavBar.vue';
	import prescriptionApi from '@/api/prescriptionApi.js'
	export default {
		mixins: [mixin],
		// components:{
		// 	CustomNavBar,
		// },
		data(){
			return {
				state:false,
				informationObj:{
					name:'',
					phone:'',
					region:['山东省','青岛市','黄岛区'],
					address:'',
				},
				prescriptionList: []
			}
		},
		methods: {
			save(item){
				this.informationObj.address = this.informationObj.region.join('')+this.informationObj.address
				const pages = getCurrentPages();
				const prevPage = pages[pages.length - 2]; 
				prevPage.$vm.getValue(this.informationObj); 
				uni.navigateBack();
			},
			distribution(){
				const pages = getCurrentPages();
				const prevPage = pages[pages.length - 3]; 
				prevPage.$vm.getValue('确认配送');
				uni.navigateBack({
				    delta: 2 
				})
			},
			chooseregion(event){
					this.informationObj.region = event.detail.value.toString()
			},
			deleteBtn(){
				this.informationObj = {
					name:'',
					phone:'',
					region:['山东省','青岛市','黄岛区'],
					address:'',
				}
			},
			//获取处方
			getPrescription(){
				let loginValue = uni.getStorageSync("loginData");
				let idCardNum = loginValue.idNo != null ? loginValue.idNo : loginValue.patientCard
				try {
					prescriptionApi.getPrescription(idCardNum).then(res => {
						if(res.data.code===200){
							let arr = res.data.data ? res.data.data.mstvws || [] : [];
							this.prescriptionList = arr
						}else {
							this.prescriptionList = []
						}
					})
				} catch (error) {
					console.log(error)
					//TODO handle the exception
				}
			}
		},
		onShow() {
			const options = this.$mp.query;
			if (options && options.informationObj) {
				this.informationObj = JSON.parse(decodeURIComponent(options.informationObj))
			    console.log('informationObj',this.informationObj);
				this.title = '物流配送';
			}else{
				this.title = '更多处方';
			}
			
			this.showBack = true;
			this.getPrescription();
		}
	}
</script>

<style>
</style>
<style lang="less" scoped>
	.user {
		width: 100vw;
		height: 100%; 
		display: flex;
		flex-direction: column;
		
		.content {
			overflow: auto;
			flex: auto;
			ul {
				li {
					width: 710rpx;
					padding: 20rpx;
					margin: 20rpx auto;
					background: #ffffff;
					border-radius: 16rpx;
					.head {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.medicine{
							color: #4286ff;
							image {
								margin-left: 20rpx;
								width: 14rpx;
								height: 20rpx;
							}
						}
					}
					.middle {
						margin-top: 30rpx;
						view {
							margin: 10rpx 0;
							text {
								display: inline-block;
								&:first-child{
									min-width: 140rpx;
									color: #888888;
								}
								&:nth-child(3){
									margin-left: 15rpx;
									color: #888888;
									font-size: 24rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>