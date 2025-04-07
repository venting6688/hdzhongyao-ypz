<template>
	<view class="user">
		<!-- <CustomNavBar
		    :showBack="showBack"
		    :title="title"
		/> -->
		<!-- 新增地址 -->
		<view class="content" v-if="title==='新增地址' || title=='编辑地址'">
			<view class="head">
				<image src="../static/image/Group 907@2x.png" mode=""></image>
				<text>收件人</text>
			</view>
			<form>
				<view class="cu-form-group">
					<view class="title">姓名</view>
					<input v-model="informationObj.contactName" name="input" />
					<view class="title">电话</view>
					<input type="number" maxlength="11" v-model="informationObj.contactNumbre" name="input" />
				</view>
				
				<view class="cu-form-group">
					<view class="title">省市区</view>
					<picker mode="region" @change="chooseregion" :value="informationObj.provincesAndMunicipalities">
						<view class="picker">
							<text>{{ informationObj.provincesAndMunicipalities }}</text>
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">详细地址</view>
					<input v-model="informationObj.detailedAddress" name="input" />
				</view>
			</form>
			<view class="bottom">
				<view class="confirm" @click="save" v-if="title==='新增地址'">
					确认保存
				</view>
				<view class="confirm" @click="editAddress(informationObj)" v-else>
					确认保存
				</view>
				<view class="delete" @click="deleteBtn">
					清空
				</view>
			</view>
		</view>
		<!-- 物流配送 --> 
		<view class="content" v-else>
			<form>
				<view class="cu-form-group">
					<view class="title">姓名</view>
					<text>{{informationObj.contactName}}</text>
					<view class="title">电话</view>
					<text>{{informationObj.contactNumbre}}</text>
				</view>
				<view class="cu-form-group">
					<view class="title">配送地址</view>
					<text>{{informationObj.provincesAndMunicipalities}} - {{informationObj.detailedAddress}}</text>
				</view>
			</form>
			<view class="bottom">
				<view class="confirm" @click="distribution(informationObj.id)" v-if="title=='物流配送'">
					物流配送
				</view>
				
			</view>
			<view class="tips">
				<image src="../static/image/Star 5@2x.png" mode=""></image>
				<text>注意:物流配送采用到付的方式寄出</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin'
	// import CustomNavBar from '@/components/CustomNavBar.vue';
	import addressApi from '@/api/addressApi.js'
	import {mapState} from 'vuex'
	export default {
		mixins: [mixin],
		// components:{
		// 	CustomNavBar,
		// },
		data(){
			return {
				state:false,
				informationObj:{
					contactName:'',
					contactNumbre:'',
					provincesAndMunicipalities:['山东省','济南市','历下区'],
					detailedAddress:'',
				},
				prescNo: '', //处方编号
			}
		},
		computed: {
			...mapState(['footData']),
		},
		methods: {
			//新增地址
			save(){
				let loginValue = uni.getStorageSync("loginData");
				loginValue = JSON.parse(loginValue);
				
				let isArray = Array.isArray(this.informationObj.provincesAndMunicipalities);
				let regionStr = isArray ? this.informationObj.provincesAndMunicipalities.join('') : this.informationObj.provincesAndMunicipalities;
				this.informationObj.detailedAddress = this.informationObj.detailedAddress
				this.informationObj.accountPhoneNumber = loginValue.phoneNum;
				
				addressApi.addAddresInfo(this.informationObj).then(res => {
					if(res.data.code===200){
						uni.showToast({
							title: '添加成功',
							duration: 3000
						});
						setTimeout(()=>{
							uni.navigateBack();
						},3000)
					}else{
						uni.showToast({
							title: res.data.msg,
							icon: 'error',
							duration: 3000
						});
					}
				})
				.catch(err => {
					console.log('2：', err);
				})
			},
			//编辑地址
			editAddress(item){
				addressApi.editAddresInfo(item).then(res => {
					if(res.data.code===200){
						uni.showToast({
							title: '修改成功',
							duration: 3000
						});
						setTimeout(()=>{
							uni.navigateBack();
						},3000)
					}else{
						uni.showToast({
							title: res.data.msg,
							icon: 'error',
							duration: 3000
						});
					}
				})
				.catch(err => {
					console.log('2：', err);
				})
			},
			//物流配送
			distribution(wlId){
				let detail = {
					prescriptionNumber: this.prescNo,
					deliveryAddressId: wlId
				}
				addressApi.confirmDelivery(detail).then(res => {
					if(res.data.code===200){
						uni.navigateBack({
						    delta: 2 
						})
					}else{
						uni.showToast({
							title: res.data.msg,
							icon: 'error',
							duration: 3000
						});
					}
					
				})
				.catch(err => {
					console.log('2：', err);
				})
				
				// const pages = getCurrentPages();
				// const prevPage = pages[pages.length - 3]; 
				// prevPage.$vm.getValue('确认配送');
				// uni.navigateBack({
				//     delta: 2 
				// })
			},
			//省市change function
			chooseregion(event){
				this.informationObj.provincesAndMunicipalities = event.detail.value.toString()
			},
			deleteBtn(){
				this.informationObj = {
					contactName:'',
					contactNumbre:'',
					provincesAndMunicipalities:['山东省','济南市','历下区'],
					detailedAddress:'',
				}
			},
		},
		onShow() {
			const options = this.$mp.query;
			if (options && options.informationObj && options.type == 'logistics') {
				this.informationObj = JSON.parse(decodeURIComponent(options.informationObj));
				this.prescNo = options.prescNo
				this.title = '物流配送';
			} else if(options && options.informationObj && options.type == 'edit') {
				this.informationObj = JSON.parse(decodeURIComponent(options.informationObj));
				this.title = '编辑地址';
			} else {
				this.title = '新增地址';
			}
			this.showBack = true;
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
			
			margin:10rpx auto;
			width: 714rpx;
			background: #ffffff;
			border-radius: 16rpx;
			padding: 20rpx;
			
			.head {
				display: flex;
				align-items: center;
				image {
					width: 44rpx;
					height: 44rpx;
					margin-right: 15rpx;
				}
			}
			form {
				.title {
					color: #888888;
				}
				.cu-form-group {
					&:last-child{
						border-bottom: 2rpx solid #eeeeee;
					}
				}
			}
			.bottom {
				margin-top: 60rpx;
				display: flex;
				align-items: center;
				.confirm {
					width: 322rpx;
					height: 64rpx;
					background: #4286ff;
					border-radius: 46rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 32rpx;
					color: #ffffff;
					margin:0 auto ;
				}
				.delete {
					color: #999999;
				}
			}
			.tips{
				display: flex;
				align-items: center;
				margin-top: 30rpx;
				image{
					width: 24rpx;
					height: 24rpx;
					margin-right: 20rpx;
				}
				color: #2674ff;
			}
			
		}
	}
</style>