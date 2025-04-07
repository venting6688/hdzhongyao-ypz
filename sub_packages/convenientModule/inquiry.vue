<template>
	<view class="inquiry">
		
		<view class="" :animation="anData"  style="height:0rpx;"></view>
		<image class="background" src="https://aiwz.sdtyfy.com:8099/img/virtualBg.png" ></image>	
		<view class="head">
			您好！“安好”  为您服务  
		</view>
		<view class="center">
			<scroll-view scroll-y="true" :scroll-top="scrollTop" class="scroll-Y" scroll-with-animation>
				<view  id="okk" style="padding-bottom: 100rpx;">
					<view class="msgList" v-for="(x,i) in msgList" :key="i" :class="{ 'padd': i === msgList.length - 1 }">
					<!-- 用户消息 -->
				    <view class="my"  v-if="x.my">
						<view class="my-box">
							<view class="center">
								<text class="msg">{{x.msg}}</text>
							</view>
							<view class="triangle"></view>
						</view>
				    </view>
					<!-- AI消息 -->
					<view class="robot" v-else>
						<view class="robot-box"  v-if="x.type!==2">
							<view class="triangle"></view>
							<view class="center">
								<view v-if="x.msgLoad" class="cuIcon-loading turn-load" style="font-size: 50rpx;color: #60B6FE;"></view>
								<text v-else class="msg">{{x.msg}}</text>
							</view>
							<!-- 推荐科室医生 -->
						</view>
						<view class="top2" v-if="x.type==2">
							<image src="@/static/image/department.png" mode="widthFix"></image>
							<view class="top2-content">
								<view class="department">
									<view class="title">
										“安好” 推荐您去以下科室挂号
									</view>
									<view class="top2-center">
										<view class="img">
											<image  src="@/static/image/Frame2.png" mode=""></image>
										</view>
											<text>{{x.department}}</text>
										<view class="top2-btn" @click="quit">
											<view class="top2-img">
												<image src="@/static/image/plus.png" mode="widthFix"></image>
											</view>
											<view class="text">挂号</view>
										</view>
									</view>
								</view>
								<view class="doctor">
									<view class="title">
										“安好” 为您推荐以下医生
									</view>
									<view class="top2-center">
										<view class="img">
											<image  src="@/static/image/Frame_1.png" mode="widthFix"></image>
										</view>
										<view class="top2-middle">
											<view class="top2-name">
												<text>{{x.doctor.name}}</text>
												<text>{{x.doctor.title}}</text>
												|
												<text>{{x.doctor.department}}</text>
											</view>
											<view class="sort">
												<view>
													{{x.doctor.sort[0]}}
												</view>
												<view>
													{{x.doctor.sort[1]}}
												</view>
											</view>
										</view>
										<view class="top2-btn">
											<view class="top2-img">
												<image  src="@/static/image/plus.png" mode="widthFix"></image>
											</view>
											<view class="text">挂号</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
			       </view>
				</view>
		    </scroll-view>
			<!-- 预问诊结论 -->
			<uni-popup class="Dialog"  :mask-click="false" ref="popup" type="bottom" mask-background-color="transparent" :safeArea="false" >
				
			  <view class="center" >
				<scroll-view class="scroll" scroll-y="true">
				<view class="middle">
					<view class="head">
						<image src="@/static/image/preview.png" mode=""></image>
						<text>
							您的预问诊结论如下:
						</text>
					</view>
					<view class="personal-details">
						<view>
							<text>姓名: {{patient.patientName}}</text>
							<text>性别: {{patient.sex}}</text>
							<text>年龄: {{patient.age}}</text>
						</view>
						<view>
							<text>挂号科室: {{patient.deptName}}</text>
							<text>挂号医生: {{patient.doctorName}}</text>
						</view>
					</view>
					<view class="rests">
						<view class="title">
							<view></view>
							<view>
								<text>主诉</text>
							</view>
						</view>
						<view class="text">
							{{summary.chiefComplaint?summary.chiefComplaint:'无'}}
						</view>
					</view>
					<view class="rests">
						<view class="title">
							<view></view>
							<view>
								<text>现病史</text>
							</view>
						</view>
						<view class="text">
							{{summary.presentIllnessHistory?summary.presentIllnessHistory:'无'}}
						</view>
					</view>
					<view class="rests">
						<view class="title">
							<view></view>
							<view>
								<text>既往史</text>
							</view>
						</view>
						<view class="text">
							{{summary.pastMedicalHistory?summary.pastMedicalHistory:'无'}}
						</view>
					</view>
					<view class="rests lastRests">
						<view class="title">
							<view></view>
							<view>
								<text>过敏史</text>
							</view>
						</view>
						<view class="text">
							{{summary.allergicHistory?summary.allergicHistory:'无'}}
						</view>
					</view>
				</view>
				</scroll-view>
				
			  </view>
			  <view class="foot-choice">
				<view @click="complete(2)">重新问诊</view>
				<view @click="complete(1)">确认提交</view>
			  </view>
			</uni-popup>
			<!-- 多选弹窗 -->
			<uni-popup class="Dialog2"  :mask-click="false" ref="popup2" type="bottom" mask-background-color="transparent" :safeArea="false" >
			  <view class="center" >
				<scroll-view class="scroll" scroll-y="true">
				<view class="middle">
					<text v-for="(item,index) in DataList.main" :key="index" @click="clickItem(index)" :class="{colour:item.bOn}">
						{{item.value}}
					</text>
				</view>
				</scroll-view>
				
			  </view>
			  <view class="foot-choice">
				<view @click="choice(2)">手动输入</view>
				<view @click="choice(1)">确定</view>
			  </view>
			</uni-popup>
		    <view class="foot">
				<view v-if="voiceState" class="foot-center">
					<view class="image">
					<image @click="voiceState=false" src="@/static/image/keyword.png" mode=""></image>	
					</view>
					<view class="btn">
						<button hover-class="is-hover" @touchmove="handleTouchMove" @touchstart="startMic" @touchend="stopMic">按住说话</button>
					</view>
				</view>
				<view v-else class="foot-center">
					<view class="image">
					<image @click="voiceState=true" src="@/static/image/voice.png" mode=""></image>	
					</view>
					<view class="input" :class="{w:msg}">
						<input v-if="inputState" :class="{ws:msg}" :focus="Focus" @blur="onblur" type="text" cursor-spacing="10" v-model="msg" style="background-color: #f0f0f0;"
					    @confirm="sendMsg" confirm-type="send"  />
					</view>
					<view class="sendMsg" @click="sendMsg" v-if="msg">
						<text>发送</text>
						<image src="../../static/image/Rectangle 346@2x.png" mode=""></image>
					</view>
				</view>
		    </view>
		</view>
		<!--------------------- 语音  ------------------- -->
		<view class="flex-column-center" style="position: fixed;bottom: 0px;" >
			<view class="bottom-dh-char flex-row-around" style="font-size: 55rpx; padding:60rpx 0 100rpx 0;">
		<view class="record-layer">
		    		
		    		<!-- 语音遮罩层 -->
		<view class="voice-mask" v-show="mask" catchtouchmove="true">
			<!-- 语音音阶动画 -->
			<view class="voice-bar " :class="{voiceDel:needCancel}" >
				<view :class="{volumeDel:needCancel}" class="prompt-layer prompt-layer-1" v-if="longPress == '2'">
					<view class="prompt-loader">
						<view class="em" v-for="(item,index) in 15" :key="index"></view>
					</view>
					<!-- <text class="span">松手结束录音</text> -->
				</view>
				<view class="trangle-bottom" :class="{trangleDel:needCancel}"></view>
			</view>
			<!-- 底部区域 -->
			<view class="voice-send">
				<!-- 取消和转文字图标 -->
				<view class="voice-middle-wrapper">
					<!-- 取消 -->
					<view class="voice-left-wrapper">
						<view class="cancel-del" :class="{delTip:needCancel}">松开 取消</view>
						<view class="close" :class="{bigger:needCancel}">
							<image src="@/static/image/icon-close.png" class="close-icon"></image>
						</view>
					</view>
					
					<view class="send-tip" :class="{sendTipNone:needCancel}">松开 转文字</view>
				</view>	
				<!-- 底部语音按钮 -->
				<view class="mask-bottom"  :class="{'mask-bottom-close':needCancel}">
					<image src="@/static/image/v.png"></image>
				</view>
			</view>	
		</view>	
		    	</view>
		    </view>
		</view>
	</view>
</template>

<script>
	// rpx和px的比率
	var l
	// 可用窗口高度
	var wh
	// 顶部空盒子的高度
	var mgUpHeight
	
	import { parse } from 'best-effort-json-parser'
	import guideApi from '@/api/guideApi.js'
	import { mapState } from 'vuex'
	import mixin from '@/mixins/mixin'
	export default {
		mixins: [mixin],
		data() {
			return {
				number:1,
				msg:'',
				anData:{},
				go:0,
				scrollTop: 0,
				msgList:[
					{
						my:false,
						type:1,
						msg:'请问您有什么症状或者感觉身体哪里不舒服呢?',
					}
				],      //消息集合
				voiceState:false,        //底部切换状态
				DataList:{},    //底部弹窗
				reply:[],
				Focus:false,  //输入框聚焦
				conversation_id:'',
				summary:{
					allergicHistory:'',
					chiefComplaint:'',
					pastMedicalHistory:'',
					presentIllnessHistory:'',
					patientName:'',
					sex:'',
					age:'',
					deptName:'',
					doctorName:'',
					visitNumber:'',
				},
				needCancelState:false,     //关闭语音
				needCancel:false,          //关闭动画
				startX:'',   //按住录音时的位置
				startY:'',
				mask:false,            //语音状态
				longPress: '1',         // 1显示 按住说话 2显示 说话中
				manager:null,
				test1:'',
				test2:'',
				patient:{    
					patientName:'',
					sex:'',
					age:'',
					deptName:'',
					doctorName:'',
					visitNumber:'',
					uniquelyIdentified:'',
				},
				mode:'',
				outputs:{
					type:''
				},
				inputState:true,
				department:{},
				requestTask:null,
				scene:false,     //判断是否是从外部小程序跳转
			}
		},
		computed: {
			...mapState(['footData']),
		},
		onLoad(options) {
			
		},
		onShow() {
		    const options = this.$mp.query;
			if (options && options.patient) {
				this.scene = true
				this.patient = JSON.parse(decodeURIComponent(options.patient))
			    console.log(this.patient);
			}else if(options && options.params){
				this.scene = false
				let content = JSON.parse(options.params)
				this.patient = {
					patientName:this.footData.patientName,
					sex:this.footData.sex,
					age:this.calculateAge(this.footData.idNum),
					deptName:content.queueName,
					doctorName:content.doctorName,
				}
			}
		},
		beforeDestroy() {
			this.requestTask.abort()
			this.requestTask = null
		},
		methods: {
			onblur(){
				this.Focus = false
			},
			// 保持消息体可见
			msgGo(i){
				const query = uni.createSelectorQuery().in(this);
				// 延时保证是最新的高度
				setTimeout(()=>{
					// 获取消息体高度
					query.select('#okk').boundingClientRect(data => {
					   // 如果超过scorll高度就滚动scorll
					   if(data.height-wh>-240){
					   		this.go=data.height-wh+600  
					   		this.$nextTick(function() {
					   			this.scrollTop = this.go
					   		});
					   }
					   // this.msg = 'wh:+'wh+'data.height:'+data.height+'wh'+wh
					   // 保证键盘第一次拉起时消息体能保持可见
					   var moveY=wh-data.height+600
					   // 超出页面则缩回空盒子
					   if(moveY-mgUpHeight<0){
						   // 小于0则视为0
						   if(moveY<0){
							   this.msgMove(0,0)
						   }else{
							   // 否则缩回盒子对应的高度
							  this.msgMove(moveY,0) 
						   }  
					   }
					}).exec();
				},i?0:100)
			},
			msgMove(x,t){
				var animation = uni.createAnimation({
				        duration: t,
				        timingFunction: 'ease',
				      })
				      this.animation = animation
				      animation.height(x).step()
				      this.anData = animation.export()
			},
			// 回答问题
			answer(msg){
				this.msg = msg
				this.sendMsg()
			},
			sendMsg(){
				// 消息为空不做任何操作
				if(this.msg==""){
					return 0;
				}
				// 显示消息 msg消息文本,my鉴别是谁发的消息(不能用俩个消息数组循环,否则消息不会穿插)
				this.msgList.push({"msg":this.msg,"my":true})	
				// 保证消息可见
				this.msgGo()
				//发送消息
				this.msgKf(this.msg)
				// 清除消息
				this.msg=""
			},
			msgKf(msg){
				let m
				this.outputs.message = msg
				m = JSON.stringify(this.outputs)
				this.msgList.push({msgLoad:true})
				this.inputState = false
				this.requestTask = wx.request({
				  url: 'https://www.chinzsoft.com/api/v1/chat-messages', // 流式接口的URL
				  method: 'POST',
				  timeout: 10000,
				  data: {
				    query: m,
				    inputs: {
				      sex: this.patient.sex?this.patient.sex:'男',
				      age: this.patient.age?this.patient.age:30,
				    },
				    response_mode: "streaming",
				    conversation_id: this.conversation_id,
				    user: "abc-123"
				  },
				  enableChunked: true,
				  // enableHttp2:true,
				  header: {
				    'Authorization': 'Bearer app-Wdonm1evx4bCyRtZQsspM6gG',
				    'content-type': 'application/json',
				  },
				  success: (res) => {
						
				  },
				  fail: (err) => {
					  console.log('err',err)
					  this.inputState = true
				  },
				});
				this.requestTask.onChunkReceived((response) => {
					try {
						// 收到流式数据，根据返回值进行相对应数据解码
						const arrayBuffer = response.data;
						const uint8Array = new Uint8Array(arrayBuffer);
						let text = uni.arrayBufferToBase64(uint8Array)
						text = new Buffer(text, 'base64')
						let responseText = text.toString('utf-8')
						let data = responseText.split('data: ')
						let i 
						for (let j = 0; j < data.length; j++) {
							if(!j) continue;
							if(!data[j].includes('message') || data[j].includes('message_end')){
								break
							}
							parse(data[j]) 
							i = JSON.parse(data[j])
							this.conversation_id = i.conversation_id
							
									if(i.answer){
										i.answer = i.answer && i.answer.replace(/[ \r\n\u21B5]/g,'')
										this.test1 += i.answer
										// this.test2 += this.test1
										this.test2 = parse(this.test1)
											if(!this.test2.is_complete){
											if(this.test2.question){
												this.msgLoad=false
												const content = {
													my:false,
													msgLoad:false,
													msg:this.test2.question?this.test2.question.replace(/\[.*?\]/, ''):'',
												}
													this.msgList.splice(this.msgList.length-1,1,content)
											}
										}
									}
									if(i.event==='workflow_finished'){
										if(!this.test2.is_complete){
										    this.mode = this.test2.mode
										    this.DataList.main = this.test2.option.map(item=> {
										    	return {value:item}
										    })
										    this.$refs.popup2.open('bottom')   //弹框
										}else{
											this.summary = {
												allergicHistory:this.test2.summary.allergic_history,
												chiefComplaint:this.test2.summary.chief_complaint,
												pastMedicalHistory:this.test2.summary.past_medical_history,
												presentIllnessHistory:this.test2.summary.present_illness_history,
												...this.patient
											}
											this.$refs.popup.open('bottom')   //弹框
										}
										this.msgLoad=false
									    this.test1 = ''
										this.msgGo()
										this.inputState = true
									}
						}
					} catch (error) {
						console.log('error',error)
						//TODO handle the exception
					}
				  
				});
			},
			
			choice(index){
				let reply = this.reply.join(',')
				if(index==1) {
					if(!reply){
						uni.showToast({
							title:`您还未选择内容`,
							icon:'none'
						})
						return
					}
					this.answer(reply)
				}else if(index==2) {
					this.Focus = true
				}
				this.inputState = true
				this.$refs.popup2.close()
			 	this.reply = []
				this.msgGo()
			},
			//结束弹窗
			async complete(index){
				if(index==1) {
					try{
						const res= await guideApi.PreConsultation({
							data:this.summary,
					    }).then((res) => {
							uni.showModal({
							   title: '提交成功',
							   confirmColor: '#576B95',
							    success: res => {
									if (res.confirm) {
									    this.conversation_id = ''
									    if(this.requestTask){
									    	this.requestTask.abort()
									    }
									    if(this.scene){
									    	wx.exitMiniProgram()
									    }else {
											uni.navigateBack();
										}
							        }
							    },
							 });
					    })
					}catch(e){
					    console.log(e);
					}
				}else if(index==2) {
					
					this.$refs.popup.close()
					this.msgList = [
					{
						my:false,
						type:1,
						msg:'请问您有什么症状或者感觉身体哪里不舒服呢?',
					}
				] 
					// this.msgKf('MODIFY',this.userId)
				}
				this.conversation_id = ''
				this.outputs = {
					type:'',
					message:'',
				}
			},
			//弹窗多选
			clickItem (index) {
				if(this.mode){
					// 多选
						const temp = this.DataList.main[index]
					temp.bOn = !this.DataList.main[index].bOn
					this.$set(this.DataList.main, index, temp)
					if (this.reply.indexOf(temp.value) !== -1) {
					    this.reply.splice(this.reply.indexOf(temp.value), 1)
					} else {
					    this.$set(this.reply, this.reply.length, temp.value)
					}
				}else {
					// 单选
					this.DataList.main.forEach((item, i) => {
					    item.bOn = false;
					    this.$set(this.DataList.main, i, item);
					});
					const temp = this.DataList.main[index];
					temp.bOn = true;
					this.$set(this.DataList.main, index, temp);
					this.reply = [temp.value];
				
				}
				
			  },
			// 监听语音
			setManagerLisener(){
				this.manager.onRecognize = (res) =>{
					this.msg += res.result
				}
				
				this.manager.onStop = (res) =>{
					if(this.needCancelState == true){
						this.needCancelState = false
						return
					}
					
					 if(res.result == ''){
						uni.showToast({
							title:'未检测到声音，请重试',
							icon:'none'
						})
					}else{
						this.msg = res.result.replace('.','').replace('，','').replace('。','').replace('！','').replace('？','')
						this.voiceState = false
					}
				}
				this.manager.onStart = (res) =>{
					
					// uni.hideLoading()
					// uni.showLoading({
					// 	title:"语音识别中...",
					// })
				    // console.log("成功开始录音识别", res)
				}
				this.manager.onError = (res) =>{
				    console.error("error msg", res.retcode,res.msg)
				}
			},
			startMic(e){
				// uni.showLoading({
				// 	title:"准备语音中",
				// })
				this.manager.start({
					duration:30*1000,
					lang: "zh_CN",
					})
					this.longPress = '2';
					this.mask = true
					this.startX = e.touches[0].pageX;
					this.startY = e.touches[0].pageY;
			},
			stopMic(){
				this.msgGo(true)
				// uni.hideLoading()
				
				if(this.needCancel == true){               //取消语音发送 因为取消时微信和动画有延迟  所以 在这里直接关闭动画   新增加一个变量去关闭语音
					this.needCancel =false               
					this.needCancelState = true
				}
				this.manager.stop()
				this.longPress = '1';
				this.mask = false
			},
			// 语音录制时滑动事件
			handleTouchMove(e){
				if(this.startX - e.touches[0].pageX > 14 && this.startY - e.touches[0].pageY > 50){
					this.needCancel = true;
				} else {
					this.needCancel = false;
				}
			},
		},
		mounted() {
			
			// 如果需要缓存消息缓存msgList即可
			// 监听键盘拉起
			// 因为无法控制键盘拉起的速度,所以这里尽量以慢速处理
			uni.onKeyboardHeightChange(res => {
				const query = uni.createSelectorQuery().in(this);
				query.select('#okk').boundingClientRect(data => {
					// 若消息体没有超过2倍的键盘则向下移动差值,防止遮住消息体
					var up=res.height*2-data.height-l*200     //110
				  if(up>0){
					  // 动态改变空盒子高度
					 this.msgMove(up,100)
					 // 记录改变的值,若不收回键盘且发送了消息用来防止消息过多被遮盖
					 // mgUpHeight=up
				  }
				  // 收回
				  if(res.height==0){
					   this.msgMove(0,0)	
				  }
				  // this.goPag(res.height)
				}).exec();
			 })
			var query=uni.getSystemInfoSync()
						
			l=query.screenWidth/750		
			wh=query.windowHeight	
			this.msgGo()
			// 同声传译
			var plugin = requirePlugin("WechatSI")
			this.manager = plugin.getRecordRecognitionManager()
			this.setManagerLisener()
			// this.$refs.agePopup.open('bottom')  
		}
	}
</script>

<style lang="less">
	
    .inquiry{
		height: 100%;
		position: relative;
		background: linear-gradient(to right,#4dccfb,#5da9fc);
		display: flex;
		flex-direction: column;  
		
		.background {
			position: absolute;
            width: 100%;
			height: 89%;
		}
		
		>.head{
			position: absolute;
			top: 20rpx;
			left: 32rpx;
			height: 50rpx;
			font-size: 36rpx;
			font-weight: 600;
			text-align: LEFT;
			color: #ffffff;
		}
		
		>.center{
			z-index: 0;
			height: 100%;
			display: flex;
			flex-direction: column;  
			.scroll-Y {
				margin-top: 86rpx;
			    width: 750rpx;
		        flex: auto;
			    overflow: auto;
				.padd{
					
					padding-bottom: 220rpx !important;
				}
				
				.msgList {
					font-size: 37rpx;
					color: #000;
					// display: flex;
					// justify-content: flex-start;
					
					&:nth-of-type(1){
						padding-top: 140rpx;
						// padding-bottom: 0 !important;
					}
					
					
					.my {
						width: 100%;
						display: flex;
						justify-content: flex-end;
						align-items: flex-start;
						
						
						
						.my-box {
							display: flex;
							justify-content: flex-end;
							align-items: center;
							width: 460rpx;
							margin: 20rpx 25rpx 20rpx 0;
							
							.triangle {
							    width: 0;
							 	height: 0;
							 	border-style: solid;
							 	border-width: 15rpx 0 15rpx 18rpx;
							 	border-color: transparent transparent transparent #076aff;
							}
							
							.center {
								
								background: #076aff;
							    padding: 20rpx 24rpx;
							    border-radius: 12rpx;
							    color: #ffffff;
								.msg {
									text-align: left;
									line-height: 37rpx;
								}
							}
							
						}
					}
					
					.robot {
						width: 100%;
						display: flex;
						justify-content: flex-start;
						align-items: flex-start;
						
						
						.robot-box {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						width: 490rpx;
						margin: 20rpx 0 20rpx 25rpx;
						
						.triangle {
						    width: 0;
						 	height: 0;
						 	border-style: solid;
						 	border-width: 15rpx 18rpx 15rpx 0;
						 	border-color: transparent rgba(255,255,255,0.80) transparent transparent;
						}
							
							.center{
								color: #000000;
							    padding:20rpx 24rpx;
							    background: rgba(255,255,255,0.80);
							    border-radius: 12rpx;
								font-size: 34rpx;
								
								.msg {
									text-align: left;
								}
								.top1 {
									margin-top: 10rpx;
									text-align: left;
									color: #1A66C2;
									
									view {
										margin-top: 20rpx;
										text{
											border-bottom: 2rpx solid #1A66C2;
										}
									}
								}
								
							}
							
							
						}
						.top2 {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							width: 560rpx;
							margin: 20rpx 0 20rpx 25rpx;
							position: relative;
							image {
								position: absolute;
								width: 560rpx;
								height: 380rpx;
							}
							.top2-content {
								position: relative;
								width: 560rpx;
								height: 380rpx;
								
								
								.department {
									width: 100%;
									height: 50%;
									color: #000000;
									.title {
										display: flex;
										align-items: center;
										height: 30%;
										font-size: 34rpx;
										margin-left: 20rpx;
									}
									.top2-center {
										width: 100%;
										margin: 0;
										height: 70%;
										display: flex;
										justify-content: space-between;
										align-items: center;
										font-size: 38rpx;
										overflow: hidden;
										
										.img {
											transform: translate(16rpx,0);
											width: 52rpx;
											height: 52rpx;
											image {
												display: block;
												width: 52rpx;
											    height: 52rpx;
											}
										}
										
										
										text {
											font-size: 32rpx;
											text-align: left;
											display: block;
											width: 140px;
										}
										.top2-btn {
											transform: translate(-16rpx,0);
											color: #ffffff;
											width: 120rpx;
											height: 53rpx;
											background: linear-gradient(3deg,#489dff 0%, #50bfff 100%);
											border-radius: 8rpx;
											font-size: 30rpx;
											display: flex;
											align-items: center;
											justify-content: space-evenly;
											.top2-img {
												width: 22rpx;
												height: 22rpx;
												image {
													display: block;
													width: 22rpx;
												    height: 22rpx;
												}
												
											}
											.text {
												line-height: 30rpx;
											}
										}
									}
								}
								.doctor {
									width: 100%;
									height: 50%;
									color: #000000;
									
									.title {
										display: flex;
										align-items: center;
										height: 30%;
										font-size: 34rpx;
										margin-left: 20rpx;
										
									}
									.top2-center {
										width: 100%;
										margin: 0;
										height: 70%;
										display: flex;
										justify-content: space-between;
										align-items: center;
										font-size: 38rpx;
										overflow: hidden;
										
										.img {
											transform: translate(16rpx,0);
											width: 52rpx;
											height: 52rpx;
											image {
												display: block;
												width: 52rpx;
											    height: 52rpx;
											}
										}
										.top2-middle{
											.top2-name {
												display: flex;
												align-items: center;
												width: 180px;
												color: #064087;
												
												text {
													display:inline-block;
													&:nth-of-type(1){
														font-size: 30rpx;
														color: #000000;
														width: 200rpx;
														line-height: 32rpx;
														margin-right: 6rpx;
														flex-wrap: wrap;
													}
													&:nth-of-type(2){
														width: 260rpx;
														font-size: 24rpx;
														line-height: 24rpx;
													}
													&:nth-of-type(3){
														width: 210rpx;
														font-size: 24rpx;
														line-height: 24rpx;
														flex-wrap: wrap;
													}
												}
											}
											.sort {
												display: flex;
												view {
													min-width: 80rpx;
													display: flex;
													justify-content: center;
													align-items: center;
													height: 32rpx;
													line-height: 20rpx;
													border: 1rpx solid #479cff;
													border-radius: 40rpx;
													color: #064087;
													font-size: 20rpx;
													margin-left: 12rpx;
												}
											}
										}
										
										.top2-btn {
											transform: translate(-16rpx,0);
											color: #ffffff;
											width: 120rpx;
											height: 53rpx;
											background: linear-gradient(3deg,#489dff 0%, #50bfff 100%);
											border-radius: 8rpx;
											font-size: 30rpx;
											display: flex;
											align-items: center;
											justify-content: space-evenly;
											.top2-img {
												width: 22rpx;
												height: 22rpx;
												image {
													display: block;
													width: 22rpx;
												    height: 22rpx;
												}
												
											}
											.text {
												line-height: 30rpx;
											}
										}
									}
								}
							}
						}
					}
					
				}
			
		    }
			/* 预问诊结论 */
			.Dialog {
				width: 750rpx;
	   //          background-color: #ffffff;
	   //          border-radius: 30rpx 30rpx 0 0;
				// height: 380rpx;
	
				.center {
					width: 750rpx;
					background-color: #ffffff;
					border-radius: 30rpx 30rpx 0 0;
					min-height: 500rpx;
					overflow: hidden;
				.scroll {
						height: 100%;
						.middle {
							width: 750rpx;
							   .head {
								   height: 60rpx;
								   margin: 0 22rpx;
								   border-bottom: 2rpx solid #dddddd;
								   display: flex;
								   align-items: center;
								   
								   image {
									   width: 30rpx;
									   height: 30rpx;
									   margin-right: 8rpx;
								   }
								   text {
									   font-size: 26rpx;
									   line-height: 26rpx;
									   color: #076aff;
								   }
							   }
							   .personal-details {
								   height: 122rpx;
								   border-bottom: 2rpx solid #dddddd;
								   font-size: 26rpx;
								   margin: 0 22rpx;
								   display: flex;
								   flex-direction: column;
								   justify-content: center;
								    >view {
									   margin: 10rpx 0;
									   text {
										    margin: 0 35rpx;
									   		line-height: 26rpx;
									   		min-width: 80rpx;
									   		display: inline-block;
											&:nth-of-type(1){
												margin: 0 35rpx 0 16rpx;
											}
								        }
								    }
							    }
								.rests {
									min-height: 80rpx;
									border-bottom: 2rpx solid #dddddd;
									font-size: 26rpx;
									margin: 0 22rpx;
									
									>.title {
										height: 26rpx;
										width: 100%;
										margin-top: 15rpx;
										display: flex;
										align-items: center;
										> view {
											&:nth-of-type(1){
												width: 5rpx;
												height: 18rpx;
												background: #0680ff;
												border-radius: 46rpx;
												margin-right: 10rpx;
											}
											&:nth-of-type(2){
												line-height: 26rpx;
												
											}
										}
									}
									> .text {
										margin: 15rpx 5rpx 15rpx 15rpx;
										color: #888888;
									}
								}
								.lastRests {
									border-bottom: 2rpx solid transparent;
								}
							}
						}
					}
				.foot-choice {
					background-color: #ffffff;
					// height: 120rpx;
					padding: 10rpx 0 45rpx 0;
					font-size: 40rpx;
					display: flex;
					margin: 0;
					align-items: center;
					border-top: 2rpx solid #DDDDDD;
					position: relative;
					
						view{
							color: #0085FF;
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 40rpx;
							width: 50%;
							height: 80rpx;
							border:none;
							
							&:nth-of-type(1){
								color: #797979;
								border-right: 2rpx solid #e7e7e7;
							}
							
						}
						
						// .is-hover {
						// 	background-color: #49c5bf;
						// 	border-color: #E8F2FE;
						// }
						// .is-hover2 {
						// 	background-color: #d1ebeb !important;
						// 	border-color: #c3cbd5 !important;
						// }
				}
				
			}
			/* 选择症状、疾病 弹窗 */
						.Dialog2 {
							width: 750rpx;
			//          background-color: #ffffff;
			//          border-radius: 30rpx 30rpx 0 0;
							// height: 380rpx;
				
							.center {
								width: 750rpx;
								background-color: #ffffff;
								border-radius: 30rpx 30rpx 0 0;
								height: 250rpx;
								overflow: hidden;
							.scroll {
									height: 100%;
									.middle {
										    margin: 30rpx 20rpx 0 20rpx;
											display: flex;
											flex-wrap: wrap;
											text {
												border-radius: 4px;
												flex-grow: 1;
												display: flex;
												justify-content: center;
												align-items: center;
												padding: 12rpx 30rpx;
												margin: 16rpx;
												color: #004eae;
												font-size: 38rpx;
												background: rgba(7,106,255,0.04);
												border: 2rpx solid #479cff;
												border-radius: 40rpx;
											}
											.colour {
												background: #479cff !important;
												color: #ffffff;
											}
										}
									}
								}
								
							.foot-choice {
								background-color: #ffffff;
								// height: 120rpx;
								padding: 10rpx 0 45rpx 0;
								font-size: 40rpx;
								display: flex;
								margin: 0;
								align-items: center;
								border-top: 2rpx solid #DDDDDD;
								position: relative;
								
								
									view{
										color: #0085FF;
										display: flex;
										justify-content: center;
										align-items: center;
										font-size: 40rpx;
										width: 50%;
										height: 80rpx;
										border:none;
										
										&:nth-of-type(1){
											color: #797979;
											border-right: 2rpx solid #e7e7e7;
										}
										
									}
									
									// .is-hover {
									// 	background-color: #49c5bf;
									// 	border-color: #E8F2FE;
									// }
									// .is-hover2 {
									// 	background-color: #d1ebeb !important;
									// 	border-color: #c3cbd5 !important;
									// }
							}
							
						}
		
		    .foot {
			   
				margin-bottom:50rpx;
			    width: 750rpx;
				
				.foot-center {
					margin-left: 12rpx;
					width: 726rpx;
					height: 115rpx;
					background: rgba(255,255,255,0.90);
					border-radius: 8rpx;
					display: flex;
					align-items: center;
					justify-content: space-evenly;
					
					.image {
						width: 63rpx;
						height: 63rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: #ffffff;
						border: 2rpx solid transparent;
						// border-image: linear-gradient(108deg, #499eff 0%, #7b5afd 100%) 1 1;
						background-image: linear-gradient(#ffffff, #ffffff),
						    linear-gradient(108deg, #499eff 0%, #7b5afd 100%);
						border-radius: 40rpx;
						background-origin: border-box;
						background-clip: content-box, border-box;
						
						image {
							width: 45rpx;
							height: 45rpx;
						}
					}
					.sendMsg {
						width: 104rpx;
						height: 56rpx;
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						
						text {
							position: absolute;
						}
						image {
							width: 104rpx;
							height: 56rpx;
						}
					}
					.btn {
						
						button {
						width: 580rpx;
						height: 71rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: linear-gradient(336deg,#479cff 10%, rgba(71,216,251,0.80) 100%);
						border-radius: 8rpx;
						font-size: 36rpx;
						color: #ffffff;
						}
						.is-hover{
							background: #7ebdff;
						}
					}
					.w {
						width: 520rpx !important;
					}
					
					.input {
									width: 580rpx;
									height: 71rpx;
									border: 2rpx solid transparent;
									border-radius: 8rpx;
									background-image: linear-gradient(#ffffff, #ffffff),
									    linear-gradient(101deg, #49a1ff 0%, #55bbfd 100%);
									background-origin: border-box;
									background-clip: content-box, border-box;
										  
									input{
									width: 550rpx;
									height: 71rpx;
									background-color: transparent !important;
									font-size: 34rpx;
									line-height: 34rpx;
									margin: 0 15rpx;
									}
									.ws {
										width: 490rpx !important;
									}
								}
							}
					    }
					}
					/*---------------------------------- 语音样式 ------------------------------ */
					.voice-mask{
							position:fixed;
							top:0;
							right:0;
							bottom:0;
							left:0;
							background-color: rgba(0,0,0,0.8);
						}
						.voice-bar{
							position: absolute;
							left:50%;
							top: 50%;
							transform: translate(-50%,-50%);
							/* width: 230rpx; */
							height:150rpx;
							background-color:#51ff50;
							border-radius: 26rpx;
							margin-bottom: 220rpx;
						}
						.voiceDel{
							left:80rpx;
							top: 50%;
							width: 170rpx !important;
							transform: translateX(0%);
							transform: translateY(-50%);
							background-color: red;
						}
						
						.trangle-bottom{
							position: absolute;
							bottom: -38rpx;
							left:50%;
							transform: translateX(-50%);
							border-width: 20rpx;
							border-style: solid;
							border-color: #95EA6C transparent transparent transparent;
						}
						.trangleDel{
							border-color: red transparent transparent transparent;
						}
						.voice-send{
							position: absolute;
							bottom: 0;
							width: 100%;
						}
						.voice-middle-wrapper{
							width: 100%;
							display: flex;
							position:relative;
							justify-content: space-between;
							align-items: flex-end;
							margin-bottom: 40rpx;
						}
						.voice-left-wrapper{
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: flex-end;
						}
						.cancel-del{
							display:none;
						}
						.delTip{
							display:block;
							color:#bfbfbf;
							margin: 0 -30rpx 18rpx 46rpx;
						}
						
						.close{
							font-size: 100rpx;
							position: relative !important;
							width: 140rpx;
							height: 140rpx;
							text-align: center;
							display: flex;
							align-items: center;
							justify-content: center;
							background-color: rgba(0,0,0,0.2);
							transform: rotate(350deg);
							margin:0 0 30rpx 80rpx;
							border-radius: 50%;
							line-height: 1; /* 设置行高为1 */
						}	
						.close-icon{
								width: 80rpx;
								height: 80rpx;	
							}
						.bigger{
							width: 150rpx;
							height: 150rpx;
							/* display: flex;
							align-items: center;
							justify-content: center; */
							background: #f9f9f9;
							font-size: 120rpx;
							color: #333;
							
						}
						
						
						.send-tip{
							position: absolute;
							left: 50%;
							bottom:0rpx;
							transform: translate(-50%,36%);
							color:#bfbfbf;
						}
						.sendTipNone{
							display: none;
						}
						.mask-bottom{
							position: relative;
							width: 100%;
							height:230rpx;
							border-top: #BABABB 8rpx solid;
							border-radius: 50% 50% 0 0;
							background-image: linear-gradient(#949794,#e1e3e1);
						}
						.mask-bottom-close {
							background: rgba(0,0,0,0.2) !important;
							border-top: rgba(0,0,0,0.2) 8rpx solid;
						}
						.mask-bottom image{
							position: absolute;
							width: 60rpx;
							height: 60rpx;
							top: 0;
							right:0;
							bottom: 0;
							left: 0;
							margin: auto;
						}
						
						/* 提示小弹窗 */
						.prompt-layer{
							border-radius: 8px;
							background: #95EA6C;
							padding: 53rpx 20rpx;
							box-sizing: border-box;
							position: absolute;
							left: 50%;
							transform: translateX(-50%);
						}
						
						.prompt-layer-1{
							font-size: 36rpx;
							width: 280rpx;
							text-align: center;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
						}
						.volumeDel{
							background: #ff0000;
							width: 240rpx;
						}
						.prompt-layer-1 .p{
							color: #000000;
						}
						.prompt-layer-1 .span{
							color: rgba(0,0,0,.6);
						}
						.prompt-loader .em{	
						}
						/* 语音音阶------------- */
						.prompt-loader {
							width: 96px;
							height: 20px;
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 6px;
						}
						.prompt-loader .em {
							display: block;
							background: #333333;
							width: 1px;
							height: 10%;
							margin-right: 2.5px;
							float: left;
						}
						.prompt-loader .em:last-child {
							margin-right: 0px;
						}
						.prompt-loader .em:nth-child(1) {
						 animation: load 2s 1.4s infinite linear;
						}
						.prompt-loader .em:nth-child(2) {
						 animation: load 2s 1.2s infinite linear;
						}
						.prompt-loader .em:nth-child(3) {
						 animation: load 2s 1s infinite linear;
						}
						.prompt-loader .em:nth-child(4) {
						 animation: load 2s 0.8s infinite linear;
						}
						.prompt-loader .em:nth-child(5) {
						 animation: load 2s 0.6s infinite linear;
						}
						.prompt-loader .em:nth-child(6) {
						 animation: load 2s 0.4s infinite linear;
						}
						.prompt-loader .em:nth-child(7) {
						 animation: load 2s 0.2s infinite linear;
						}
						.prompt-loader .em:nth-child(8) {
						 animation: load 2s 0s infinite linear;
						}
						.prompt-loader .em:nth-child(9) {
						 animation: load 2s 0.2s infinite linear;
						}
						.prompt-loader .em:nth-child(10) {
						 animation: load 2s 0.4s infinite linear;
						}
						.prompt-loader .em:nth-child(11) {
						 animation: load 2s 0.6s infinite linear;
						}
						.prompt-loader .em:nth-child(12) {
						 animation: load 2s 0.8s infinite linear;
						}
						.prompt-loader .em:nth-child(13) {
						 animation: load 2s 1s infinite linear;
						}
						.prompt-loader .em:nth-child(14) {
						 animation: load 2s 1.2s infinite linear;
						}
						.prompt-loader .em:nth-child(15) {
						 animation: load 2s 1.4s infinite linear;
						}
						@keyframes load {
							0% {
								height: 20%;
							}
							50% {
								height: 100%;
							}
							100% {
								height: 20%;
							}
						}
					
						/*---------------------------------- 语音样式结束------------------------------ */
						
	}
</style>
