<template>
	<view class="head" :class="{convenient:footState===2}">
		<image class="background" src="../static/image/Group 1001.png" mode="widthFix"></image>
		<view class="dist">
			<ul  v-if="footState===2 && departmentList.length">
				<li v-for="(item,index) in departmentList" :key="index">
					<view class="test" @click="departmentBtn(item,index)"  :class="{ barBackground: headerEmit.visitNumber==item.visitNumber ||headerEmit.visitNumber==item.orderNo }">
						<view>{{item.queueName?item.queueName.replace('门诊',''):''}}</view>
						<view>{{item.doctorName?item.doctorName:''}}</view>
					</view>
					<view class="wire">
					</view>
				</li>
			</ul>
		</view>
		<view class="bar" v-if="footState===2">
			<view v-for="(item,index) in barList" @click="throttle_btns(index,item.number)" class="barList" :key="index">
				<view  class="bar-name"  :class="{ barColor:item.number==1 }">
					<view>
						<text :class="{ barBackground: item.state==item.name }">{{ item.name }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import HeaderbarApi from '@/api/HeaderbarApi.js'
	import guideApi from '@/api/guideApi.js'
	import mixin from '@/mixins/mixin'
	import bus from "@/utils/bus.js";
	import {mapState,mapMutations} from 'vuex'
export default {
	props:{
		footState:Number,
	},
	mixins: [mixin],
	data() {
		return {
			barListData:null,
			barList: [
				{
					name:'预约',
					number:'1',
					state:'预约'
				}
			],
			hospitalizedBarList:[],
			headerEmit:{
				visitNumber:'',
				orderNo:'',
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
			throttle_btns:null,
			index:0,
			timer:null,
		}
	},
	watch: {
		'getSuggestText': 'animateText',
		'headerEmit.visitNumber': {
			handler: function (newVal, oldVal) {
				let msg = {
					length:this.departmentList.length,
					data:this.departmentList[this.index],
					visitNumber:newVal,
				}
				this.setDepartment(msg)
				if(oldVal){
					// this.getTreatmentStageNew(3)
				}
			},
		}
	},
	computed: {
		...mapState(['footData','department']),
	},
	async created() {
			console.log('666')
		let loginData = uni.getStorageSync("loginData");
		loginData = loginData.defaultArchives ? loginData.defaultArchives : '';
		if(this.footState===2 && loginData != ''){
			bus.$on('refreshGetFirstVisit',(data)=>{
				if(data.callingInterface){
					// 取消挂号或取消预约后马上调用接口更新数据
					this.getFirstVisit()
					console.log('777')
				}else{
					this.refreshData(data)
					console.log('刷刷刷刷11111')
				}
			})
			
			await this.getFirstVisit()
			console.log('9999')
			
			// this.getTreatmentStageNew(3)
			
			this.timer = setInterval(()=>{
				console.log('aaaaa')
				this.getFirstVisit()
				// this.getTreatmentStageNew(3)
			},20000)
			
			this.animateText()
		}
		
		// await this.getSuggest()
		
	},
	beforeDestroy() {
		if(this.footState){
			bus.$off('refreshGetFirstVisit')
			clearInterval(this.interval)
			clearInterval(this.timer)
			this.timer = null
		}
		
	},
	mounted() {
		this.throttle_btns = this.throttle(this.btns, 1200)
	},
	methods: {
		...mapMutations({
			setDepartment:'SET_DEPARTMENT',
		}),
		refreshData(data){
			console.log('4444')
			console.log(JSON.stringify(data),'departmentListdepartmentList');
			let msg = {
				data:this.departmentList,
				effectState:data.effectState,
			}
			
			bus.$emit('complex-data-passed',msg)
		},
		//获取挂号数据
		async getFirstVisit() {
			console.log('3333')
			let data = uni.getStorageSync('loginData');
			let siginData = data.defaultArchives;
			const time = {
				startDate: moment().format('YYYY-MM-DD'),
				endDate: moment().add(7, 'days').format('YYYY-MM-DD')
			};
			const msg = {
			  cardNo: siginData.patientCard,
				cardType: 1,
			  startDate: time.startDate,
			  endDate: time.endDate,
				version: 1,
				status: 1,
			};
			await guideApi.registrationRecord(msg).then(res => {
				let result = JSON.parse(res.data.msg);
				if(result.success){
					let subscribeList = result.data.map(item => {
						return {
							...item,
							queueName:item.deptName,
							doctorName:item.doctName,
						}
					}) || []
					this.departmentList =[...subscribeList]
					
					console.log(JSON.stringify(this.departmentList),'-----')
					
					if(this.departmentList.length){
						console.log(this.departmentList[0].visitNumber,'vvvvv');
						let found = false
						// 判断存下的visitNumber和数组中有没有匹配的如果没有重新赋值
						this.departmentList.forEach(item=>{
							if (item.visitNumber === this.headerEmit.visitNumber || item.orderNo === this.headerEmit.visitNumber) {
							    found = true;
							}
						})
					
						if(!found || !this.headerEmit.visitNumber || this.departmentList.length===1){
						    	if(this.departmentList[0].orderNo){
						    		this.headerEmit.orderNo = this.departmentList[0].orderNo
						    	}else {
									this.headerEmit.orderNo = ''
								}
								this.$set(this.headerEmit,'visitNumber',this.departmentList[0].visitNumber || this.departmentList[0].orderNo)
						}
					}else {
						this.barList = []
					}
					
					// if(data && data.firstState){
						// 当初诊卡片创建后传值
						let msg = {
							data:this.departmentList,
							effectState:data.effectState,
						}
						bus.$emit('complex-data-passed',msg)
					// }
				}
				
			}).catch(err => {
				console.log('errrrrr：', err);
			})
		},
		btns(i,num) {
			if(i % 2 === 0 && num ==1){
				this.barList.forEach((v,x)=>{
				if(i==x){
					v.state = v.name
					if(v.name==='预约'){
						this.headerEmit.state = '初诊'
					}else{
						this.headerEmit.state = v.name
					}
				}else {
					v.state = false
				}
			})
			this.$emit('handle',this.headerEmit)
			}else {
				return
			}
		},
		//切换科室
		departmentBtn(item,index){
			// this.loading = true
			// uni.showLoading({
			// 	title: '加载中...',
			// 	mask: true
			// })
			if(item.visitNumber){
				if(this.headerEmit.visitNumber !== item.visitNumber){
					this.barListData=null
					this.headerEmit.visitNumber = item.visitNumber
					this.headerEmit.orderNo = ''
					this.index = index
				}
			}else {
				if(this.headerEmit.visitNumber !== item.orderNo){
					this.barListData=null
					this.headerEmit.visitNumber = item.orderNo
					this.headerEmit.orderNo = item.orderNo
					this.index = index
				}
				// setTimeout(()=> {
				// 	this.loading = false
				// 	uni.hideLoading()
				// },15000)
			}
			
		},
		animateText() {
			console.log('1111')
			if (this.interval) {
				clearInterval(this.interval)
			}
		}
	},
	
}
</script>

<style lang="less">
	.convenient {
		height: 350rpx !important;
	}
.head {
	position: relative;
	flex: 0 0 auto;
	width: 100%;
	min-height: 194rpx;
	.text {
		position: absolute;
		width: 480rpx;
		color: #ffffff;
		font-weight: 600;
		margin: 46rpx 0 0 32rpx;

		.title {
			font-size: 32rpx;
		}

		.news {
			margin-top: 10rpx;
			font-size: 37rpx;
		}
	}

	.background {
		display: block;
		position: absolute;
		height: 325rpx;
		width: 100%;
	}

	.icon {
		position: absolute;
		top: 10rpx;
		left: 340rpx;
		width: 100rpx;
		height: 44rpx;
	}
	.dist {
		width: 100%;
		transform: translate(0,193rpx);
		display: flex;
		overflow: auto;
		white-space: nowrap;
		padding:0 30rpx 10rpx 30rpx;
		background: linear-gradient(to right, #46DAFB, #55A0F9);
		>ul {
			display: flex;
			align-items: center;
			margin:0 6rpx;
			border-radius: 15rpx;
			
			li {
				background: #edfeff;
				border-top: 2rpx solid #499eff;
				border-bottom: 2rpx solid #499eff;
				// padding:0 6rpx;
				height: 78rpx;
				display: flex;
				align-items: center;
				&:first-child{
					padding-left:3rpx;
					border-radius: 32rpx 0 0 32rpx;
				}
				&:last-child{
					padding-right:3rpx;
					border-radius: 0 32rpx 32rpx 0;
				}
				&:only-child{
					padding: 0 3rpx;
					border-radius: 32rpx;
				}
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
</style>
