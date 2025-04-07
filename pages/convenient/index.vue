<template>
	<view class="box" >
		<HeaderBar @handle="show" v-if="showState" :footState="footState" />
		<!-- <report @handle="expandBtn" :expand="expand" v-if="visitNumber!=='1358799' && (headerEmit.state=='查验' || headerEmit.state=='回诊')" /> -->
		<view v-if="showState" class="scroll-Y" :animation="animationData" @touchmove='touchMove'>
			<first @handle="show" v-if="headerEmit.state=='初诊'" :headerEmit="headerEmit" />
		    <check @handle="show" v-if="headerEmit.state=='查验'" :headerEmit="headerEmit" />
			<answer @handle="show" v-if="headerEmit.state=='回诊'" :headerEmit="headerEmit" />
			<prescription @handle="show" v-if="headerEmit.state=='处方'" :headerEmit="headerEmit" />
			<view class="img" v-if="!headerEmit.state">
				<image src="https://aiwz.sdtyfy.com:8099/img/wu.png" mode="widthFix"></image>
			</view>
		</view>
		<foot :footState="footState"/>
	</view>
</template>
<script>
	import {mapState} from 'vuex'
	import HeaderBar from '@/components/HeaderBar.vue';
	import foot from '@/components/footer.vue'
	import report from '../../sub_packages/convenientModule/components/report.vue'
	import first from '../../sub_packages/convenientModule/components/outpatient/first.vue'
	import check from '../../sub_packages/convenientModule/components/outpatient/check.vue'
	import answer from '../../sub_packages/convenientModule/components/outpatient/answer.vue'
	import prescription from '../../sub_packages/convenientModule/components/outpatient/prescription.vue'
	import prepare from '../../sub_packages/convenientModule/components/beHospitalized/prepare.vue'
	import doing from '../../sub_packages/convenientModule/components/beHospitalized/doing.vue'
	import inventory from '../../sub_packages/convenientModule/components/beHospitalized/inventory.vue'
	export default {
		components:{
			HeaderBar,
			foot,
			report,
			first,
			check,
			answer,
			prescription,
			prepare,
			doing,
			inventory,
		},
		data() {
			return {
				animationData: {},
				headerEmit:{
					state:'初诊',
					userId:'',
				},
				footState:2,
				message:'',
				moveState:true,
				expand:false,
				timer:null,
				convenientState:true,
			}
		},
		computed: {
			...mapState({ 
				footData: state => state.footData,
				showState: state => state.showState,
				visitNumber: state => state.department.visitNumber,
			}),
		},
		methods: {
			expandBtn(state){
				this.expand = state
			},
			touchMove(){
				if(this.moveState && (this.headerEmit.state==='查验'||this.headerEmit.state==='回诊') && this.expand){
					this.expand = false
					this.moveState = false
					this.timer = setTimeout(()=> {
						this.moveState = true
						clearTimeout(this.timer)
						this.timer = null
					},1000)
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
				    duration: 800,
				    timingFunction: 'linear'
				  });
				  animation.opacity(1).step();
				  this.animationData = animation.export();			  
				  },0)
			    },
			async show(str){
				this.touchMove()
				if(!str){
					await this.toggle()
				}else{
					this.headerEmit = {
					    state:'',
					    visitNumber:''
					}
					setTimeout(()=>{
						this.headerEmit = str
					},0)
					
				}
			},
			
		},
		mounted(){
		},
	}
</script>

<style lang="less">
	.box{
		width: 100vw;
		height: 100%; 
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
	
		.scroll-Y {
			// margin-top: 30rpx;
			width: 750rpx;
			text-align: center;
		    flex: auto;
			overflow: auto;
			.img {
				height: 100%;
				display: flex;
				align-items: center;
				image {
					width: 60%;
					margin: 0 auto;
				}
			}
			
		}
	}
</style>