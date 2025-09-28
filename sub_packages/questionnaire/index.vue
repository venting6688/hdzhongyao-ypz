<template>
	<view class="homeLayout pageBg homePageBg">
		<customerNav title=" " />
		<view class="goBack" :style="{top: barHeight +'px'}" @click="goBack">
			<uni-icons type="back" color="#fff" size="15"></uni-icons>
		</view>
		<view class="head">
			<view class="left">
				<image src="@/static/image/满意度调查.png" />
				<text>为了更好提升我院服务质量，占用您宝贵的1分钟时间，邀请您填写调查问卷</text>
			</view>
			<image src="@/static/image/image 50.png" mode="aspectFit" />
		</view>
		<view class="content">
		  <uni-segmented-control
				:current="currentTab"
				:values="tabs"
				styleType="button"
				activeColor="#87653A"
				@clickItem="onTabClick"
				class="tabs"
			/>
			<view class="tab-content">
				<view class="user-info">
					<view class="form-item">
						<text class="label">姓名</text>
						<input v-model="name" placeholder="请输入姓名" class="border input" />
					</view>
					<view class="form-item">
						<text class="label">手机号</text>
						<input v-model="phone" placeholder="请输入手机号" class="border input" keyboard="number" maxlength="11" />
					</view>
				</view>
				<view v-for="(val, i) in questionsList" :key="i" v-show="currentTab === i">
				  <question-item
						v-for="(item, index) in questionsList[currentTab]"
						:key="index"
				    :question="item.title"
				    :index="index"
				    :options="item.options"
				    v-model="answersList[currentTab][index]"
				  />
				</view>
			</view>
			<view class="user-info">
				<view class="form-item">
					<text class="label">其他建议：</text>
					<textarea v-model="otherText" placeholder="请填写..." class="border textarea" />
				</view>
				<button class="btnStyle bigBtn" @click="submit">提交</button>
			</view>
			
		</view>
		<view class="fill" :style="{ height: barHeight + 'px' }"></view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import login from '@/utils/login.js'
	import customerNav from '@/components/customerNav.vue';
	import questionItem from '../components/questionItem.vue'
	import { getStatusBarHeight } from "@/utils/system.js";
	import questionnaireApi from '@/api/questionnaireApi.js'
	
	export default {
	  components: {
	    customerNav,
			questionItem
	  },
		computed: {
			barHeight() {
				return getStatusBarHeight()+5
			},
			...mapState(['footData']),
		},
		data() {
			return {
				currentTab: 0,
				tabs: [],
				answerOptions: [
					{ text: '很满意',value: '很满意', },
					{ text: '满意',value: '满意', },
					{ text: '一般',value: '一般', },
					{ text: '不满意',value: '不满意', },
					{ text: '很不满意',value: '很不满意', },
				],
			  specialOptions: {
					24: ['<=5分钟', '6-10分钟', '10-20分钟', '20-30分钟', '30-60分钟'],
					25: ['<=5分钟', '6-10分钟', '10-20分钟', '20-30分钟', '30-60分钟', '>1小时'],
					26: ['1','2','3','4','5','6','7','8','9','10'],
					27: ['一定会', '可能会', '不会']
				},
				hospitalizationOptions: ['是', '否'],
				hospitalizationAnswerOptionsMap: {
					3: ['临床科室医护人员', '医保办', '社会媒体'],
					5: ['减轻了患者的负担', '无所谓'],
					6: ['过重', '合适', '较轻'],
					7: ['了解', '不太了解', '没听说过'],
					8: ['明白', '不太明白', '完全看不懂'],
					9: ['好', '一般', '差']
				},
				envQuestions: [
					'您对医院路标、指示牌等导引表示是否满意？',
					'您对候诊区、检查室、大厅、电梯、卫生间等区域的标识是否满意？',
					'您对医院的停车管理是否满意？',
					'您对医院内交通秩序是否满意？',
					'您对候诊椅的数量是否满意？',
					'您对候诊椅的舒适程度是否满意？',
					'您对医院候诊大厅的冷暖空调调节是否满意？',
					'您对医院诊室的冷暖空调是否满意？',
					'您对医院检查室的冷暖空调调节是否满意？',
					'您对清洁卫生是否满意？',
					'您对门诊地面防滑安全是否满意？',
					'您对饮水设施是否满意？',
					'您对整个环境布局是否满意？',
					'您对门诊光线是否满意？',
					'您对我院专家介绍是否满意？',
					'您对宣传教育展板及健康教育处方是否满意？',
					'您对工作人员仪表是否满意？',
					'您对免费使用轮椅、平车等物品是否满意？'
				],
				outpatientQuestions: [
					'您对我院提供的挂号方式是否满意？',
					'您对收费人员的服务是否满意？',
					'您对我院提供的挂号方式是否满意?',
					'您对医生对您的尊重，能仔细倾听您讲话？',
					'您能听懂医生对问题的解释？',
					'您对护士对您的尊重，能仔细倾听您讲话？',
					'您能听懂护士对问题的解释？',
					'您对医生在特殊检查时告知的注意事项是否满意？',
					'您对CT、MRI、拍片工作人员的服务是否满意？',
					'您对检验科工作人员的服务是否满意？',
					'您对药房工作人员的服务是否满意？',
					'您对超声科医生的服务是否满意？',
					'您对超声科医生的服务是否满意？',
					'您对等候就诊是否满意？',
					'您对等候检查是否满意？',
					'您对就诊过程中，医务人员对您一丝的保护是否满意？',
					'就诊期间您的抱怨和不满能及时得到回应是否满意？',
					'您对医院的清洁卫生（诊室、卫生间、环境）是否满意？',
					'您对医院提供的座椅、电梯、饮水等服务是否满意？',
					'您对医院内明确的路标和指示是否满意？',
					'您对医院的停车管理及交通秩序是否满意？',
					'您对医院大厅、诊室、检查室的温度是否满意？',
					'您对医院的布局方便、合理是否满意？',
					'您排队挂号的时间大概为几分钟？',
					'您挂号后等待就诊的时间大约为几分钟？',
					'您认为哪一个数字最能代表您对此医院的整体评价？(1代表最差，10代表最好)',
					'您是否会推荐亲友来我们医院就诊？'
				],
				inpatientQuestions: [
					'入院时，医院工作人员是否及时提醒患者出示医保证件，并按规定为参保患者办理住院网上登记？',
					'住院期间，医院是否能及时给参保患者提供一日清单及时交患者或家属确认',
					'您对医保相关政策的了解通过什么却道获取？',
					'科室在使用自费药物及自费诊疗项目时，是否先征得病人或家属同意？',
					'我院对医保住院患者住院非费用采取不交全额，而是按一定比例交取预定金，您的看法是？',
					'您认为个人住院负担：',
					'您对医保的起付线、报销比例、甲乙类药物及诊疗项目了解吗？',
					'对您的医保出院结算单看明白了吗？',
					'您认为，我院在宣传医保政策方面如何？'
				],
				questionnaireType: [],
				questionsList: [],
				answersList: [[], [], []],
				name: '',
				phone: '',
				otherText: ''
			}
		},
		//格式化数据
		onLoad() {
			this.getComplaintContent();
			//环境
			let environmentQuestions = this.envQuestions.map(title => ({
			  title,
			  options: this.answerOptions,
			}));
			let questionsList = [environmentQuestions];
			this.questionsList = questionsList
			
			//门诊
			let questionGroup = this.outpatientQuestions.map((title, idx) => {
				let qIndex = idx + 1;
				if (this.specialOptions[qIndex]) {
					// 特殊选项，value做简单化处理
					return {
						title,
						options: this.specialOptions[qIndex].map(opt => ({
							text: opt,
							value: opt
						}))
					};
				} else {
					return {
						title,
						options: this.answerOptions
					};
				}
			});
			if (!this.questionsList) this.questionsList = [];
			this.questionsList.push(questionGroup);
			
			//住院
			let arr = this.inpatientQuestions.map((title, idx) => {
			  let qIndex = idx + 1;
			  let opts;
			  if (this.hospitalizationAnswerOptionsMap[qIndex]) {
			    opts = this.hospitalizationAnswerOptionsMap[qIndex].map(opt => ({ text: opt, value: opt }));
			  } else {
			    opts = this.hospitalizationOptions.map(opt => ({ text: opt, value: opt }));
			  }
			  return {
			    title,
			    options: opts
			  };
			});
			
			if (!this.questionsList) this.questionsList = [];
			this.questionsList.push(arr);
			
		},
		methods: {
			onTabClick(e) {
				this.currentTab = e.currentIndex
			},
			updateAnswer(list, index, value) {
				list[index].answer = value
			},
			goBack() {
				uni.navigateBack({
					success: () => {
						
					}, fail: (err) => {
						uni.reLaunch({
							url:'/pages/home/index'
						})
					}
				})
			},
			getComplaintContent() {
				questionnaireApi.getComplaintContent('cloud_satisfaction_survey_type').then((res) => {
					if (res.data.code === 200) {
						res.data.data.map(v => {
							this.tabs.push(v.dictLabel)
						})
					}
				});
			},
			isValidPhone(phone) {
			  return /^1[3-9]\d{9}$/.test(phone);
			},
			submit() {
				if (!this.footData.patientUniquelyIdentifies) {
					login.loginData().catch((error) => {});
				} else {
					let currentQuestions = this.questionsList[this.currentTab];
					let currentAnswers = this.answersList[this.currentTab];
						
					if (!this.name) {
						uni.showToast({ title: '请输入姓名', icon: 'none' });
						return;
					}
			
					if (!this.phone || !this.isValidPhone(this.phone)) {
						uni.showToast({ title: '请输入有效手机号', icon: 'none' });
						return;
					}
			
					if (currentAnswers.length !== currentQuestions.length || currentAnswers.includes('')) {
						uni.showToast({ title: '请完成所有题目', icon: 'none' });
						return;
					}
			
					let content = currentQuestions.map((item, index) => ({
						question: item.title,
						answer: currentAnswers[index]
					}));
					
					let detail = {
						content,
						feedback: this.otherText
					};

					detail = JSON.stringify(detail)
					let payload = {
						patientId: this.footData.patientUniquelyIdentifies,
						name: this.name,
						phone: this.phone,
						detail,
						type: this.currentTab+1
					};
					questionnaireApi.submitAnswers(payload).then(res => {
						if (res.data.code === 200) {
							// 清空数据
							this.answersList[this.currentTab] = [];
							this.otherText = '';
							this.name = '';
							this.phone = '';
							uni.showToast({ title: '提交成功', icon: 'success' });
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.homeLayout {
		width: 100%;
		overflow-x: hidden;
		
		.head {
			position: absolute;
			top: 12%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			.left {
				display: flex;
				flex-direction: column; 
				flex: 1;
				text {
					flex: 1;
					font-size: 28rpx;
					word-wrap: break-word;
				}
				image {
					width: 456rpx;
					height: 66rpx;
					margin-bottom: 20rpx;
				}
			} 
			image {
				width: 200rpx;
				height: 200rpx;
			}
		}
		.content {
			position: absolute;
			top: 25%;
			.user-info {
			  background: #fff;
			  padding: 30rpx;
				margin-top: 20rpx;
			  border-radius: 16rpx;
			  margin-bottom: 30rpx;
			  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.05);
			}
			
			.form-item {
			  margin-bottom: 30rpx;
			  display: flex;
			  flex-direction: column; /* ← 关键改动：上下排列 */
			}
			.label {
			  font-size: 30rpx;
			  color: #333;
			  margin-bottom: 10rpx; /* 增加 label 与 input 之间的间距 */
			}
			.border {
				border: 1rpx solid #ccc;
				border-radius: 10rpx;
				background: #fff;
				font-size: 30rpx;
			}
			.input {
			  height: 70rpx;
			  padding: 0 20rpx;
			}
			.textarea{
				width: 100%;
				padding: 10rpx 20rpx 0;
			}
		}
	}
</style>
