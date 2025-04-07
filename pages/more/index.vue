<template>
	<view class="box" :animation="animationData">
		<HeaderBar @handle="show" :footState="footState" />
		<view class="scroll-Y">
			<van-grid column-num="4" :border="false" v-for="(i,x) in moduleList" :key="x">
				<view class="title">
					{{i.title}}
				</view>
			  <van-grid-item use-slot @click="toast(item.num,urlList[item.num-1])" link-type="navigateTo" :url="urlList[item.num-1]" v-for="(item,index) in i.list" :key="index">
			    <view class="img" >
			    	<image :src="item.img" mode=""></image>
			    </view>
			    <view class="name">
			    	{{item.name}}
			    </view>
			  </van-grid-item>
			</van-grid>
		</view>
		<foot :footState="footState" />
		</view>
</template>
<script>
	import foot from '@/components/footer.vue'
	import bus from "@/utils/bus";
	import HeaderBar from '@/components/HeaderBar.vue';
	export default {
		components:{
			foot,
			HeaderBar
		},
		data() {
			return {
				animationData: {},
				footState:3,
				moduleList:[
					{
						title:'门诊服务',
						list: uni.getStorageSync("loginData") ? [
							{
								img:'https://aiwz.sdtyfy.com:8099/img/outpatient.png',
								name:'智能导诊',
								num:1,
							},
							{
								img:'https://aiwz.sdtyfy.com:8099/img/outpatient1.png',
								name:'预约挂号',
								num:2,
							},
							{
							    img:'https://aiwz.sdtyfy.com:8099/img/outpatient3.png',
							    name:'门诊缴费',
								num:3,
							},
							{
							    img:'https://aiwz.sdtyfy.com:8099/img/outpatient7.png',
							    name:'就诊记录',
									num:5,
							},
							{
							    img:'https://aiwz.sdtyfy.com:8099/img/outpatient4.png',
							    name:'门诊报告',
									num:6,
							},
						] : [
							{
								img:'https://aiwz.sdtyfy.com:8099/img/outpatient1.png',
								name:'预约挂号',
								num:2,
							},
							{
							    img:'https://aiwz.sdtyfy.com:8099/img/outpatient3.png',
							    name:'门诊缴费',
								num:3,
							},
							{
							    img:'https://aiwz.sdtyfy.com:8099/img/outpatient7.png',
							    name:'就诊记录',
									num:5,
							},
							{
							    img:'https://aiwz.sdtyfy.com:8099/img/outpatient4.png',
							    name:'门诊报告',
									num:6,
							},
						],
					},
					{
						title: '住院服务',
						list: []
					},
					{
						title: '智慧取药',
						list: [
							{
								img:'../../static/image/quyaofy.png',
								name:'智慧取药',
								num:40,
							},
						]
					},
					// {
					// 	title:'便民服务',
					// 	list: uni.getStorageSync("loginData") ?  [
					// 		{
					// 			img:'https://aiwz.sdtyfy.com:8099/img/person3.png',
					// 			name:'疾病百科',
					// 			num:10,
					// 		},
					// 	   {
					// 	    	img:'https://aiwz.sdtyfy.com:8099/img/person2.png',
					// 	    	name:'药品查询',
					// 	    	num:11,
					// 	    },
					// 	    {
					// 	    	img:'https://aiwz.sdtyfy.com:8099/img/electronicBills.png',
					// 	    	name:'电子票据',
					// 	    	num:12,
					// 	    },
					// 			{
					// 				img:'https://aiwz.sdtyfy.com:8099/img/health.png',
					// 				name:'医保凭证',
					// 				num:13,
					// 			},
					// 			{
					// 				img:'https://aiwz.sdtyfy.com:8099/img/medicalRecord.png',
					// 				name:'病案通',
					// 				num:14,
					// 			},
					// 			{
					// 				img:'../../static/image/quyaofy.png',
					// 				name:'智慧取药',
					// 				num:40,
					// 			},
					// 			{
					// 				img:'https://aiwz.sdtyfy.com:8099/img/hospitalized4.png',
					// 				name:'营养点餐',
					// 				num:15,
					// 			},
					//     ] : [
					// 	    {
					// 	    	img:'https://aiwz.sdtyfy.com:8099/img/electronicBills.png',
					// 	    	name:'电子票据',
					// 	    	num:12,
					// 	    },
					// 			{
					// 				img:'https://aiwz.sdtyfy.com:8099/img/health.png',
					// 				name:'医保凭证',
					// 				num:13,
					// 			},
					// 			{
					// 				img:'https://aiwz.sdtyfy.com:8099/img/medicalRecord.png',
					// 				name:'病案通',
					// 				num:14,
					// 			},
					// 			{
					// 				img:'../../static/image/quyaofy.png',
					// 				name:'取药服务',
					// 				num:40,
					// 			},
					// 			{
					// 				img:'https://aiwz.sdtyfy.com:8099/img/hospitalized4.png',
					// 				name:'营养点餐',
					// 				num:15,
					// 			},
					//     ]
					// },
					{
						title:'便民服务',
						list:[
							{
								img:'https://aiwz.sdtyfy.com:8099/img/synthesize1.png',
								name:'家庭管理',
								num:23,
							},
							{
								img:'https://aiwz.sdtyfy.com:8099/img/synthesize4.png',
								name:'在线建档',
								num:24,
							},
							{
								img:'https://aiwz.sdtyfy.com:8099/img/synthesize6.png',
								name:'我的',
								num:26,
							},
						]
					},
				],
				urlList:[
					'pages/virtualNurse/index',
					'/sub_packages/subscribe/departments',
					'/sub_packages/outpatientExpenditure/index',
					'/sub_packages/outpatientTopUp/index',
					'/sub_packages/record/index',
					'/sub_packages/report/index',
					'空',
					'/sub_packages/caseHistory/index',
					'空', 
					'pages/virtualNurse/index',//10
					'pages/virtualNurse/index',
					'空',
					'空',
					'空',
					'空',
					'空',
					'空',
					'空',
					'空',
					'空',                      //20
					'/sub_packages/evaluate/index',
					'空',
					'空',
					'/sub_packages/filing/information', //23
					'空',
					'/sub_packages/mine/index',
					'空',
					'空',
					'空',
					'/sub_packages/beHospitalizedRegister/index', //30
					'空',
					'空',
					'空',
					'空',
					'空',
					'空',
					'空',
					'空',
					'空',
					'/sub_packages/medicine/index', //40
				],
			}
		},
		
		methods: {
			skip(num){
				let appId
				let targetUrl
				if(num===12){
					appId = 'wx8e0b79a7f627ca18';
					targetUrl = `pages/index/index?agencyCode=d103b2f4592543e987fffc7f6d75cd03`;
				}else if(num===13){
					appId = 'wx7ec43a6a6c80544d';
					targetUrl = `pages/new_index/index/index`;
				}else if(num===14){
					appId = 'wxff4273542debbc64';
					targetUrl = `pages/index/index?hosId=2119`;
				}else if(num===15){
					appId = 'wx63c30833d698895a';
					targetUrl = `pages/hospital/hospital?hoSpitAl_id=dffc9e5a317c&webtype=2`;
				}else if(num===22){
					appId = 'wxd8f336bfa8545586';
					targetUrl = `pages/index/isCsmUser/isCsmUser?regNo=&hosId=11012&openId=`;
				}else if(num===25){
					appId = 'wx54bf421b03978b4b';
					targetUrl = `pages/homePage/homePage?stationId=717`;
				}
				wx.navigateToMiniProgram({
				  appId: appId,
				  path: targetUrl,
				  envVersion: 'release',
				  success: function(res) {
				  },
				  fail: function(err) {
				    console.log('跳转失败', err);
				  }
				});
			},
			toast(num,url){
				console.log(this.urlList[40-1]);
				if(num==1 || num===10 ||num === 11){
					if(num==1){
						wx.reLaunch({
						    url: `/pages/virtualNurse/index?pattern=1`,
						})
					}else {
						wx.reLaunch({
						    url: `/pages/virtualNurse/index?pattern=2`,
						})
					}
				}else if(num===12 || num===13 || num===14 || num===15 || num===22 || num===25){
					this.skip(num)
				}else if(url==='空'){
					uni.showToast({
					    title: '暂未开放',
					    icon: 'none',   
					    duration: 2000 
				    })  
				}	
			},
			toggle() {
			      const animation = uni.createAnimation({
			        duration: 0,
			        timingFunction: 'ease'
			      });
				  animation.opacity(0).step();
			      this.animationData = animation.export();
				  setTimeout(()=>{
				  	const animation = uni.createAnimation({
				    duration: 500,
				    timingFunction: 'linear'
				  });
				  animation.opacity(1).step();
				  this.animationData = animation.export();			  
				  },0)
			    },
			async show(str){
				this.headerEmit = {
					state:'',
					visitNumber:''
				}
				
				if(str.visitNumber){
					setTimeout(()=>{
						this.headerEmit = str
					},0)
					
				}
			},
			
		},
		mounted(){
			// this.toggle()
			
		},
	}
</script>

<style lang="less" scoped>
	
	.box{
		
		width: 100vw;
		height: 100%; 
		// padding-top: 120px; /* 根据导航栏高度调整 */
		// // background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		
		.scroll-Y {
			width: 750rpx;
			text-align: center;
		    flex: auto;
			overflow: auto;
			padding-bottom: 28rpx;
			
			/deep/.van-grid{
				width: 712rpx;
				background: #ffffff;
				border-radius: 12rpx;
				margin:28rpx auto 0 auto;
				
				.title {
					margin: 20rpx 0 10rpx 20rpx;
					font-weight: 700;
					font-size: 34rpx;
					display: flex;
				}
				
				.van-grid-item__content {
						height: 170rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-evenly;
						padding: 0;
						
						>.img {
							width: 72rpx;
							height: 72rpx;
							// border-radius: 20rpx;
							margin-top: 10rpx;
							// display: flex;
							// justify-content: center;
							// align-items: center;
							
							image {
								width: 72rpx;
								height: 72rpx;
							}
						}
						>.name {
							font-size: 28rpx;
							margin-bottom: 10rpx;
						}
					}
				
			}
		}
	}
	
	
</style>