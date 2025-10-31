<template>
	<view class="user">
		<view class="content">
			<form>
				<view class="cu-form-group">
					<view class="x">*</view>
					<view class="title">收件人</view>
					<input v-model="informationObj.userName" name="input" placeholder="请输入姓名"  />
				</view>
				<view class="cu-form-group">
					<view class="x">*</view>
					<view class="title">手机号</view>
					<input type="number" maxlength="11" v-model="informationObj.telNumber" name="input" placeholder="请输入手机号" />
				</view>
				<view class="cu-form-group">
					<view class="x">*</view>
					<view class="title">省市区</view>
					<picker mode="region" @change="chooseregion" :value="provincesAndMunicipalities">
						<view class="picker">
							<text>{{ regionText }}</text>
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="x">*</view>
					<view class="title">详细地址</view>
					<input v-model="informationObj.detailInfo" name="input" placeholder="请输入详细地址"  />
				</view>
			</form>
			<view class="bottom">
				<view class="confirm delete" @click="deleteBtn">清空</view>
				<view class="confirm" @click="type == 'add' ? save() : editAddress(informationObj)">确认保存</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mixin from '@/mixins/mixin'
	import shopApi from '@/api/shopApi.js'
	import {mapState} from 'vuex'
	export default {
		mixins: [mixin],
		data(){
			return {
				type: '',
				state:false,
				informationObj: {},
				userId: '',
				provincesAndMunicipalities: ['山东省','济南市','历下区'],
				regionText: '山东省济南市历下区'
			}
		},
		computed: {
			...mapState(['footData']),
		},
		onLoad(e) {
			this.type = e.type;
			let loginValue = uni.getStorageSync("loginData");
			this.userId = loginValue.userId;
			if (this.type != 'add') {
				this.informationObj = JSON.parse(decodeURIComponent(e.informationObj));
				this.provincesAndMunicipalities = this.informationObj.fullRegion.split(',');
				this.regionText = this.informationObj.fullRegion;
			}
		},
		methods: {
			//新增地址
			save() {
				this.informationObj.userId = this.userId;
				if (!this.informationObj.userName || !this.informationObj.telNumber || !this.informationObj.detailInfo) {
					uni.showToast({
						title: '请填写必要信息',
						icon: 'error',
						duration: 3000
					});
				} else {
					this.informationObj.provinceName = this.provincesAndMunicipalities[0];
					this.informationObj.cityName = this.provincesAndMunicipalities[1];
					this.informationObj.countyName = this.provincesAndMunicipalities[2];
					shopApi.saveAddress(this.informationObj).then(res => {
						if(res.statusCode == 200) {
							uni.showToast({
								title: '添加成功',
								duration: 3000
							});
							setTimeout(()=>{
								uni.navigateBack();
							},3000)
						} else {
							uni.showToast({
								title: '保存失败',
								icon: 'error',
								duration: 3000
							});
						}
					}).catch(err => {
						console.log('2：', err);
					})
				}
			},
			//编辑地址
			editAddress(item) {
				if (!this.informationObj.userName || !this.informationObj.telNumber || !this.informationObj.detailInfo) {
					uni.showToast({
						title: '请填写必要信息',
						icon: 'error',
						duration: 3000
					});
				} else {
					this.informationObj.fullRegion = this.informationObj.provinceName+this.informationObj.cityName+this.informationObj.countyName
					shopApi.saveAddress(item).then(res => {
						if(res.statusCode == 200) {
							uni.showToast({
								title: '修改成功',
								duration: 3000
							});
							setTimeout(()=>{
								uni.navigateBack();
							},3000)
						} else {
							uni.showToast({
								title: '修改失败',
								icon: 'error',
								duration: 3000
							});
						}
					})
					.catch(err => {
						console.log('2：', err);
					})
				}
			},
			//省市change function
			chooseregion(event){
				let address = event.detail.value.toString();
				this.regionText = address
				address = address.split(',');
				this.informationObj.provinceName = address[0];
				this.informationObj.cityName = address[1];
				this.informationObj.countyName = address[2];
				this.provincesAndMunicipalities = address
			},
			deleteBtn(){
				this.informationObj = {
					userName:'',
					telNumber:'',
					provinceName: '',
					cityName: '',
					countyName: '',
					detailInfo:'',
				}
				this.provincesAndMunicipalities = ['山东省','济南市','历下区'];
				this.regionText = '山东省济南市历下区'
			},
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
					padding: 0 !important;
					&:last-child{
						border-bottom: 2rpx solid #eeeeee;
					}
					.x {
						color: red;
						margin-right: 10rpx;
					}
				}
			}
			.bottom {
				width: 60%;
				display: flex;
				margin: 30rpx auto 0;
				align-items: center;
				justify-content: space-between;
				.confirm {
					display: flex;
					padding: 20rpx;
					height: 64rpx;
					background: #9A7546;
					border-radius: 20rpx;
					justify-content: center;
					align-items: center;
					font-size: 32rpx;
					color: #ffffff;
				}
				.delete {
					color: #fff;
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