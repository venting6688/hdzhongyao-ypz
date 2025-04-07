<template>
	<view class="head" :class="{convenient:footState===2}">
		<image class="background" src="https://aiwz.sdtyfy.com:8099/img/Group.png" mode="widthFix"></image>
		<view class="text">
			<view class="title">您好！"安好" 为您服务<image class="icon" src="@/static/image/Group308.png" mode="widthFix"></image></view>
			<view class="news">
				{{ animatedText.slice(0,39) }}
			</view>
		</view>
		<view class="dist">
			<ul  v-if="footState===2 && departmentList.length">
				<li v-for="(item,index) in departmentList" :key="index">
					<view class="test" @click="departmentBtn(item,index)"  :class="{ barBackground: headerEmit.visitNumber==item.visitNumber ||headerEmit.visitNumber==item.orderCode }">
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
			barList: [],
			hospitalizedBarList:[],
			headerEmit:{
				visitNumber:'',
				orderCode:'',
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
					this.getTreatmentStageNew(3)
				}
			},
		}
	},
	computed: {
		...mapState(['footData','department']),
	},
	async created() {
		if(this.footState===2){
	        bus.$on('refreshGetFirstVisit',(data)=>{
				if(data.callingInterface){
					// 取消挂号或取消预约后马上调用接口更新数据
					this.getFirstVisit(data)
				}else{
					this.refreshData(data)
				}
	        	
	        })
			await this.getFirstVisit()
			this.getTreatmentStageNew(3)
			this.timer = setInterval(()=>{
				this.getFirstVisit({},3)
				this.getTreatmentStageNew(3)
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
		//获取就诊阶段(上方横条)
		async getTreatmentStageNew(state) {
			try{
				if(!this.headerEmit.orderCode){
					let data = {
						visitNumber:this.headerEmit.visitNumber,
						patientID:this.footData.patientUniquelyIdentifies,
						departmentCode:(this.department.data && this.department.data.queueId)||'',
					}
					const res = await HeaderbarApi
					.getTreatmentStageNew(data,state)
					.then((data) => {
						if(data.data.code===200){
							if (this.barListData===null || JSON.stringify(data.data.data) !== JSON.stringify(this.barListData)) {
							    this.barListData = data.data.data;
								this.barList = []
								for (let key in data.data.data) {
								  this.barList.push({name: '》》', number: data.data.data[key],state:false},{name: key, number: data.data.data[key],state:false});
								}
								this.barList.shift()
								let lastIndex = this.barList.findLastIndex(item => item.number === '1');
								if(lastIndex>=0){
									this.barList[lastIndex].state=this.barList[lastIndex].name
									this.$set(this.headerEmit,'state',this.barList[lastIndex].name)
								}
								this.$emit('handle',this.headerEmit)
							} 
						}
					})
				}else {
					let data = [
							{
								name:'预约',
								number:'1',
								state:'预约'
							}
						]
					if (this.barListData===null || JSON.stringify(data) !== JSON.stringify(this.barListData)) {
						this.barListData = data
						this.barList = data
						this.$set(this.headerEmit,'state','初诊')
						this.$emit('handle',this.headerEmit)
					}
					
					
				}
			}catch(e){
				console.log(e);
			}
		},
		refreshData(data){
			let msg = {
				data:this.departmentList,
				effectState:data.effectState,
			}
			bus.$emit('complex-data-passed',msg)
		},
		//获取今日挂号数据
		async getFirstVisit(data,state) {
			try{
				let registrationList = []
				let patientID = this.footData.patientUniquelyIdentifies
				const res= await guideApi.getFirstVisit(patientID,state).then((res) => {
					if(res.data.code===200){
						registrationList = res.data.data.orders.order || []
					}else {
						registrationList = []
					}
				})
				await this.getBookingRecord(data,registrationList)
				
			}catch(e){
				console.log(e)
				//TODO handle the exception
			}
		},
		// 获取预约数据
		async getBookingRecord (data,registrationList) {
			try{
				const time = await this.getWeek('下一周');
				const msg = {
				  patientID: this.footData.patientUniquelyIdentifies,
				  startTime: time.startDate,
				  endTime: time.endDate
				};
				const res= await guideApi.getBookingRecord(msg).then((res) => {
					if(res.data.code===200){
						let subscribeList = res.data.data.orders&&res.data.data.orders.order
						.map(item => {
							return {
								...item,
								queueName:item.department,
								doctorName:item.doctor,
							}
						})||[]
						this.departmentList =[...registrationList,...subscribeList]
						if(this.departmentList.length){
							let found = false
							// 判断存下的visitNumber和数组中有没有匹配的如果没有重新赋值
							this.departmentList.forEach(item=>{
								if (item.visitNumber === this.headerEmit.visitNumber || item.orderCode === this.headerEmit.visitNumber) {
								    found = true;
								}
							})
							if(!found || !this.headerEmit.visitNumber || this.departmentList.length===1){
							    	if(this.departmentList[0].orderCode){
							    		this.headerEmit.orderCode = this.departmentList[0].orderCode
							    	}else {
										this.headerEmit.orderCode = ''
									}
									this.$set(this.headerEmit,'visitNumber',this.departmentList[0].visitNumber || this.departmentList[0].orderCode)
							}
						}else {
							this.barList = []
						}
						if(data && data.firstState){
							// 当初诊卡片创建后传值
							let msg = {
								data:this.departmentList,
								effectState:data.effectState,
							}
							bus.$emit('complex-data-passed',msg)
						}
					}
					
			    })
			}catch(e){
				console.log('e',e)
				this.toastObj = {
					state:true,
					type:'fail',
					message:e,
				}
			}
		},
		//获取建议列表
		async getSuggest() {
			try{
				const res = await HeaderbarApi
				.getSuggest(
					this.headerEmit.visitNumber
				)
				.then((data) => {
					this.getSuggestText = data.data[0]? data.data[0]:''
				})
			}catch(e){
				//TODO handle the exception
			}
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
			if(item.visitNumber){
				if(this.headerEmit.visitNumber !== item.visitNumber){
					this.barListData=null
					this.headerEmit.visitNumber = item.visitNumber
					this.headerEmit.orderCode = ''
					this.index = index
				}
			}else {
				if(this.headerEmit.visitNumber !== item.orderCode){
					this.barListData=null
					this.headerEmit.visitNumber = item.orderCode
					this.headerEmit.orderCode = item.orderCode
					this.index = index
				}
			}
			
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
			}
			
		}
	},
	
}
</script>

<style lang="less">
	.convenient {
		height: 397rpx !important;
	}
.head {
	position: relative;
	flex: 0 0 auto;
	width: 100%;
	min-height: 325rpx;
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
		transform: translate(0,232rpx);
		display: flex;
		overflow: auto;
		white-space: nowrap;
		padding:0 30rpx 10rpx 30rpx;
		>ul {
			display: flex;
			align-items: center;
			margin:0 6rpx;
			
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
