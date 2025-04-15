<template>
	<view class="virtual">
		<view class=""   :animation="anData"  style="height:0rpx;"></view>
		<image class="background" src="../../static/image/virtualBg.png"></image>
		<!-- <image class="background" src="https://aiwz.sdtyfy.com:8099/img/virtualBg.png" ></image>	 -->
		<view class="head">
			您好！“海豚禾禾”为您服务 
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
								<view class="loading" v-if="x.msgLoad">
									<text>思考中</text>
									<view class="dot">
										<view class="stage">
											<view  class="dot-typing"></view>
										</view>
									</view>
								</view>
								<!-- <view v-if="x.msgLoad" class="cuIcon-loading turn-load" style="font-size: 50rpx;color: #60B6FE;"></view> -->
								<view v-else class="msg" v-html="markdown(x.msg)"></view>
								<!-- 消息模板 -->
								<view class="top1" v-if="x.type==1">
									<view @click="answer(item)" v-for="(item,index) in x.questionList" :key="index">
										<text>{{item}}</text>
									</view>
								</view>
								<view class="ai-tips" v-if="pattern!==1 && !x.msgLoad && x.type!==1">
									此内容由AI生成，仅供参考
								</view>
							</view>
						</view>
						<!-- 推荐科室 -->
						<view class="top2" v-if="x.type==2">
							<!-- <image src="@/static/image/department.png" mode="widthFix"></image> -->
							<view class="top2-content">
								<view class="department" v-for="(clinic,u) in x.department" :key="u">
									<view class="title">
										推荐科室{{u+1}}
									</view>
									<view class="top2-center">
										<text>{{clinic.name}}</text>
										<view class="top2-btn" @click="footType(clinic)">
											<view class="top2-img">
												<image src="@/static/image/plus.png" mode="widthFix"></image>
											</view>
											<view class="text" >挂号</view>
										</view>
									</view>
								</view>
								
								<view class="more">
									<text @click="more">更多</text>
									<image @click="tipsBtn(i)" src="../../static/image/question.png" mode="widthFix"></image>
								</view>
								<view class="dept-tips" v-if="x.tipsState">
									{{x.tips}}
								</view>
								<view class="ai-tips" v-if="!x.msgLoad">
									此内容由AI生成，仅供参考
								</view>
							</view>
						</view>
					</view>
			       </view>
				</view>
		    </scroll-view>
			<!-- 选择症状、疾病 弹窗 -->
			<uni-popup class="Dialog"  :mask-click="false" ref="popup" type="bottom" mask-background-color="transparent" :safeArea="false" >
				
			  <view class="center">
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
				<view class="foot-bar">
					<view :class="{blue:item.state===pattern}" class="test" v-for="item in footBar" :key="item" @click="footBarBtn(item)">
						<text>{{item.name}}</text>
					</view>
				</view>
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
				 @confirm="sendMsg" confirm-type="send" />
					</view>
					<view class="sendMsg" @click="sendMsg" v-if="msg">
						<text>发送</text>
						<image src="../../static/image/Rectangle 346@2x.png" mode=""></image>
					</view>
				</view>
		    </view>
			<foot v-if="showComponent" :footState="footState" />
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
	
	import MarkdownIt from 'markdown-it';
	import foot from '@/components/footer.vue'
	import bus from "@/utils/bus";
	import login from '@/utils/login.js'
	import { parse } from 'best-effort-json-parser'
	import {mapActions} from 'vuex'
	export default {
	components:{
		foot,
	},
		data() {
			return {
				md: new MarkdownIt(),
				pattern:2,
				patternList:[
					'app-oRXGFmCq64Sdca8L7eKLTEIP',
					'app-jvcTkWue6jt4pb06TWZGAsHI',
				],
				showComponent: true,
				text:'',
				number:1,
				msg:'',
				anData:{},
				go:0,
				scrollTop: 0,
				conversation_id:'',
				mode:'',
				msgList:[
					{
					    my:false,
						type:1,
						msg:'您可以向我询问以下问题：',
						questionList:['感冒吃什么药','头孢的作用是什么'],
					}
				],      //消息集合
				DataList:{},    //底部弹窗
				footBar:[
					{
					name:'智能导诊',
					state:1,
				    },
					{
					name:'智能问答',
					state:2,
					},
				],
				voiceState:false,        //底部切换状态
				reply:[],
				Focus:false,  //输入框聚焦
				footState:1,
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
				},
				inputState:true,
			}
		},
		onShow() {
			const options = this.$mp.query;
			if (options && options.patient) {
				this.patient = JSON.parse(decodeURIComponent(options.patient))
			    console.log(this.patient);
			}
		},
		onLoad(options) {
			if (Object.keys(options).length > 0) {
			    this.pattern = Number(options.pattern)
			    let manifestation = options.manifestation
			    if(this.pattern===1){
					uni.showToast({
					    title: '已为您切换到智能导诊',
					    icon: 'none',   
					    duration: 2000 
					}) 
					this.msgList = [
						{
						    my:false,
							type:1,
							msg:'您可以详细描述症状，我将为您优先推荐科室去挂号：',
							questionList:['感冒','恶心','上吐下泻'],
						}
					]
			    	
			    }else{
					if(options.shouldUpdate){
						this.updateData()
					}
					if(manifestation){
						this.answer(manifestation)
					}else{
						uni.showToast({
						    title: '已为您切换到智能问答',
						    icon: 'none',   
						    duration: 2000 
						}) 
						this.msgList = [
							{
							    my:false,
								type:1,
								msg:'您可以向我询问以下问题：',
								questionList:['感冒吃什么药','头孢的作用是什么'],
							}
						]
					}
					
			    }
			} 
		},
		computed: {
		    parsedMarkdown() {
		    }
		},
		methods: {
			tipsBtn(index){
				// 使用 this.$set 修改数组中某一项的属性
				this.$set(this.msgList[index], 'tipsState', !this.msgList[index].tipsState);
			},
			markdown(item){
				return this.md.render(item);
			},
			more(){
				uni.navigateTo({
					url: `/sub_packages/subscribe/departments`
				})
				// 跳转到山一大二附院小程序挂号科室页面
				// const appId = 'wx6334d37b051ec074';
				// const targetUrl = `pages/outpatient-department/main?hosld=2`;
				// wx.navigateToMiniProgram({
				//   appId: appId,
				//   path: targetUrl,
				//   envVersion: 'release',
				//   success: function(res) {
				//   },
				//   fail: function(err) {
				//     console.log('跳转失败', err);
				//   }
				// });
			},
			footBarBtn(item){
				if(!this.inputState){
					// 数据流未完成不能切换
					return
				}
				// 切换模式
				if(item.name==='智能导诊'){
					this.pattern = 1
					uni.showToast({
					    title: '已为您切换到智能导诊',
					    icon: 'none',   
					    duration: 2000 
					}) 
					this.conversation_id = ''
					this.msgList = [
						{
						    my:false,
							type:1,
							msg:'您可以详细描述症状，我将为您优先推荐科室去挂号：',
							questionList:['感冒','恶心','上吐下泻'],
						}
					]
					
				}else {
					uni.showToast({
					    title: '已为您切换到智能问答',
					    icon: 'none',   
					    duration: 2000 
					}) 
					this.pattern = 2
					this.conversation_id = ''
					this.msgList = [
						{
						    my:false,
							type:1,
							msg:'您可以向我询问以下问题：',
							questionList:['感冒吃什么药','头孢的作用是什么'],
						}
					]
				}
			},
			// 登录成功后重新渲染foot
			updateData(){
				this.showComponent = false
				this.$nextTick(()=>{
					this.showComponent = true
				})
			},
			onblur(){
				this.Focus = false
			},
			footType(item){
				uni.navigateTo({
					url: `/sub_packages/subscribe/doctors?title=${item.name}&CLGRPRowId=${item.id}`
				})
				// const appId = 'wx6334d37b051ec074';
				// const data = {
				//   checkedDep: {
				//     departmentld:item.id,
				//     departmentCode:item.id,
				//     departmentName: item.name,
				//     typeFlag: "cliGroup"
				//   },
				//   checkedFirDep: ""
				// };
				// const jsonString = JSON.stringify(data);
				// const encodedData = encodeURIComponent(jsonString);
				// const targetUrl = `/pages/outpatient-doctor-list/main?dep=${encodedData}`;
				// wx.navigateToMiniProgram({
				//   appId: appId,
				//   path: targetUrl,
				//   envVersion: 'release',
				//   success: function(res) {
				//   },
				//   fail: function(err) {
				//     console.log('跳转失败', err);
				//   }
				// });
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
					   		this.go=data.height-wh+300  
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
				let loginValue = uni.getStorageSync("loginData");
				if(loginValue){
					// let data = JSON.parse(loginValue)
					if(loginValue){
						this.msg = msg
						this.sendMsg()
					}else {
						login.loginData().catch((error) => {});
					}
					
				}else {
					login.loginData().catch((error) => {
					});
				}
				
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
				// 必须建档
				this.msgList.push({msgLoad:true})
				this.inputState = false
				const requestTask = wx.request({
				  url: 'https://www.chinzsoft.com/api/v1/chat-messages', // 流式接口的URL
				  method: 'POST',
				  data: {
				    query: msg,
				   inputs: {
				     sex: this.patient.sex?this.patient.sex:'男',
				     age: this.patient.age?this.patient.age:24,
				   },
				    response_mode: "streaming",
				    conversation_id: this.conversation_id,
				    user: "abc-123"
				  },
				  enableChunked: true,
				  // enableHttp2:true,
				  header: {
				    'Authorization': `Bearer ${this.pattern===1?this.patternList[0]:this.patternList[1]}`,
				    'content-type': 'application/json',
				  },
				  success: (res) => {
					  if(this.pattern===1){
						this.test1 = ''
						if(!this.test2.is_complete){
							this.mode = this.test2.mode
							if(this.test2.option.length){
								this.DataList.main = this.test2.option.map(item=> {
								    return {value:item}
								})
								this.$refs.popup.open('bottom')   //弹框
							}
						}else {
							this.conversation_id = ''
						}  
					  }else {
						  this.test1 = ''
					  }
					  
					  this.msgGo()
					  this.inputState = true
				  },
				  fail: (err) => {
					  console.log('err',err)
					  this.inputState = true
				  },
				});
				requestTask.onChunkReceived((response) => {
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
							
							i = JSON.parse(data[j])
							this.conversation_id = i.conversation_id
							// i.answer = i.answer&&i.answer.replace(/[ \r\n\u21B5]/g,'')
							if(i.answer){
								this.test1 += i.answer
								if(this.pattern===1){
									this.test2 = parse(this.test1)
									if(!this.test2.is_complete){
										if(this.test2.response){
											const content = {
												my:false,
												msgLoad:false,
												msg:this.test2.response?this.test2.response.replace(/\[.*?\]/, ''):'',
											}
											this.msgList.splice(this.msgList.length-1,1,content)		  
										}
									}else {
										const originalTipsState = this.msgList[this.msgList.length - 1]?.tipsState;
										const content = {
											my:false,
											type:2,
											msgLoad:false,
											department:this.test2.option?this.test2.option:[],
											tips:this.test2.reason?this.test2.reason:'',
											tipsState: originalTipsState
										}
										this.msgList.splice(this.msgList.length-1,1,content)
									}
								}else {
									const content = {
										my:false,
										msgLoad:false,
										msg:this.test1?this.test1.replace(/\[.*?\]/, ''):'',
									}
									this.msgList.splice(this.msgList.length-1,1,content)
								}
							}
						}
					} catch (error) {
						console.log('error',error)
						//TODO handle the exception
					}
				  
				});
			},
			//弹窗事件
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
				this.$refs.popup.close()
			 	this.reply = []
				this.msgGo()
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
			 let loginData = uni.getStorageSync("loginData");
			 loginData = loginData.defaultArchives ? loginData.defaultArchives : false;
			 if (!loginData) {
				 uni.reLaunch({ url: '/pages/more/index' });
			 } else  {
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
				 
				 // 同声传译
				 var plugin = requirePlugin("WechatSI")
				 this.manager = plugin.getRecordRecognitionManager()
				 this.setManagerLisener()
				 this.msgGo()
				 // this.$refs.agePopup.open('bottom')  
			 }
		},
	}
</script>

<style lang="less" scoped>
    .virtual{
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
		
		.head{
			position: absolute;
			top: 20rpx;
			left: 32rpx;
			height: 50rpx;
			font-size: 36rpx;
			font-weight: 600;
			text-align: LEFT;
			color: #ffffff;
		}
		
		.center{
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
					
					padding-bottom: 180rpx !important;
				}
				.msgList {
					font-size: 37rpx;
					color: #000;
					// display: flex;
					// justify-content: flex-start;
					
					&:nth-of-type(1){
						padding-top: 140rpx;
						padding-bottom: 0 !important;
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
							width: 630rpx;
							margin: 20rpx 25rpx 20rpx 0;
							
							.triangle {
							    width: 0;
							 	height: 0;
							 	border-style: solid;
							 	border-width: 15rpx 0 15rpx 18rpx;
							 	border-color: transparent transparent transparent rgba(7,106,255,0.80);
							}
							
							.center {
								background: rgba(7,106,255,0.80);
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
						width: 680rpx;
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
									display: flex;
									flex-wrap: wrap;
									
									view {
										margin: 20rpx 14rpx 0 14rpx;
										text{
											border-bottom: 2rpx solid #1A66C2;
										}
									}
								}
								.ai-tips {
									margin-top: 20rpx;
									text-align: center;
									font-size: 26rpx;
									color: #919191;
								}
								
							}
							
							
						}
						.top2 {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							min-width: 560rpx;
							max-width: 660rpx;
							margin: 20rpx 0 20rpx 25rpx;
							position: relative;
							padding:20rpx 24rpx;
							background: rgba(255,255,255,0.80);
							border-radius: 12rpx;
							>image {
								position: absolute;
								width: 560rpx;
								height: 380rpx;
							}
							.top2-content {
								position: relative;
								width: 560rpx;
								// height: 380rpx;
								
								
								.department {
									width: 100%;
									height: 190rpx;
									color: #000000;
									.title {
										display: flex;
										align-items: center;
										height: 30%;
										font-weight: 600;
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
											>image {
												display: block;
												width: 52rpx;
											    height: 52rpx;
											}
										}
										
										
										text {
											font-size: 32rpx;
											text-align: left;
											display: block;
											width: 220px;
											margin-left: 20rpx;
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
												>image {
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
								.more {
									// width: 100%;
									color: #1A66C2;
									margin: 0 20rpx;
									display: flex;
									align-items: center;
									justify-content: space-between;
									>text {
										border-bottom: 2rpx solid #1A66C2;
									}
									>image {
										width: 45rpx;
										height: 45rpx;
									}
								}
								.dept-tips {
									margin: 20rpx 20rpx 10rpx 20rpx;
									font-size: 30rpx;
									
								}
							}
							.ai-tips {
								margin-top: 20rpx;
								text-align: center;
								font-size: 26rpx;
								color: #919191;
							}
						}
					}
					
				}
			
		    }
			/* 选择症状、疾病 弹窗 */
			.Dialog {
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
						
						
				}
				
			}
		
		    .foot {
			   
				margin-bottom:24rpx;   //带着footbar
				// margin-bottom:50rpx;
			    width: 750rpx;
				
				.foot-bar {
					margin-left: 12rpx;
					width: 726rpx;
					display: flex;
					margin: 20rpx 12rpx;
					
					>view {
						width: 150rpx;
						height: 60rpx;
						background: rgba(255,255,255,0.90);
						border-radius: 8rpx;
						line-height: 28rpx;
						margin-right: 24rpx;
						color: #000000;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 30rpx;
					}
					
					.blue {
						color: #ffffff;
						background: #0066ff;
					}
				}
				
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
				transform: translate(-50%,-80%);
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
				transform: translateY(-80%);
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
				height:300rpx;
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
			
		.loading {
			display: flex;
			align-items: center;
			color: #888;
			.dot {
				width: 45rpx;
				.stage {
				    display: flex;
				    justify-content: center;
				    align-items: center;
					padding: 12rpx 0 0 0;
				    overflow: hidden;
					transform: translate(0,8rpx);
					.dot-typing {
					    position: relative;
					    left: -9995px;
					    width: 3px;
					    height: 3px;
					    border-radius: 3px;
					    background-color: #888;
					    color: #888;
					    box-shadow: 9988px 0 0 0 #888, 9994px 0 0 0 #888,
					      10000px 0 0 0 #888;
					    animation: dotTyping 1.5s infinite linear;
					}
					@keyframes dotTyping {
					        0% {
					          box-shadow: 9988px 0 0 0 #888, 9994px 0 0 0 #888,
					            10000px 0 0 0 #888;
					        }
					        16.667% {
					          box-shadow: 9988px -3px 0 0 #888, 9994px 0 0 0 #888,
					            10000px 0 0 0 #888;
					        }
					        33.333% {
					          box-shadow: 9988px 0 0 0 #888, 9994px 0 0 0 #888,
					            10000px 0 0 0 #888;
					        }
					        50% {
					          box-shadow: 9988px 0 0 0 #888, 9994px -3px 0 0 #888,
					            10000px 0 0 0 #888;
					        }
					        66.667% {
					          box-shadow: 9988px 0 0 0 #888, 9994px 0 0 0 #888,
					            10000px 0 0 0 #888;
					        }
					        83.333% {
					          box-shadow: 9988px 0 0 0 #888, 9994px 0 0 0 #888,
					            10000px -3px 0 0 #888;
					        }
					        100% {
					          box-shadow: 9988px 0 0 0 #888, 9994px 0 0 0 #888,
					            10000px 0 0 0 #888;
					        }
					      }
				}
			}
		}
	}
</style>




