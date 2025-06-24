<template>
	<view class="box">
		<view class="bar">
			<view class="name">
				{{footData.patientName?pixelate(footData.patientName):''}}<text>{{footData.relation?footData.relation:''}}</text>
			</view>
			<view class="cut"  @click="cutPatient">
				<image src="@/static/image/cut.png" mode=""></image>
				<text>切换家庭成员</text>
			</view>
		</view>
		<uni-popup class="cutPatientDialog" @maskClick="cutPatientPopupClick" :safe-area="false"  ref="cutPatientPopup" type="bottom">
		   <popupFamily v-if="cutPatientPopupState" :personageObj="personageObj" @handle="show" />
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import mixin from '@/mixins/mixin.js'
	import popupFamily from '@/components/popupFamily.vue';
	export default {
		mixins: [mixin],
		components:{
			popupFamily
		},
		data(){
			return {
				registerData:{
					archivesList:[]
				},
				personageObj:{
					list:[],
					sole:{},
				},
				timer:null,
				cutPatientPopupState:true,
			}
		},
		computed: { 
			...mapState(['footData']),
				},
		methods: {
			cutPatientPopupClick(){
				this.timer = setTimeout(()=>{
					this.cutPatientPopupState = false
					clearTimeout(this.timer)
					this.timer = null
				},1500)
			},
			show(){
				this.$refs.cutPatientPopup.close()
			},
			cutPatient(){
				if(this.timer){
					clearTimeout(this.timer)
					this.timer = null
					this.cutPatientPopupState = false
				}
				this.$nextTick(() => {
					this.loginData()
					this.cutPatientPopupState = true
					this.$refs.cutPatientPopup.open('bottom')   //弹框
				});
			},
			loginData(){
				let loginValue = uni.getStorageSync("loginData");
				if(loginValue){
					this.registerData = JSON.parse(loginValue)
					this.personageObj.list = this.registerData && this.registerData.archivesList
					this.personageObj.sole = this.footData
				}
			},
		},
		mounted(){
			
		}
	}
</script>

<style lang="less" scoped>
	.box {
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		.bar {
			width: 750rpx;
			height: 84rpx;
			background: #f0f7ff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;
			color: #4286ff;
			
			.name {
				height: 32rpx;
				font-size: 32rpx;
				line-height: 32rpx;
				display: flex;
				align-items: center;
				text {
					width: 66rpx;
					height: 32rpx;
					background: #4286ff;
					border-radius: 8rpx;
					color: #ffffff;
					margin-left: 10rpx;
					font-size: 26rpx;
					line-height: 26rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			.price {
				font-size: 30rpx;
			}
			.cut {
				width: 226rpx;
				height: 54rpx;
				border: 2rpx solid #4286ff;
				border-radius: 38rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 30rpx;
					height: 28rpx;
					margin-right: 5rpx;
				}
			}
		}
		.cutPatientDialog{
			width: 100%;
		}
	}
</style>