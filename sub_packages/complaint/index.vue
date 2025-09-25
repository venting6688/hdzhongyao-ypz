<template>
	<view class="homeLayout pageBg homePageBg">
		<customerNav title=" " />
		<view class="goBack" :style="{top: barHeight +'px'}" @click="goBack">
			<uni-icons type="back" color="#fff" size="15"></uni-icons>
		</view>
		<view class="head">
			<view class="left">
				<image src="@/static/image/投诉与建议.png" />
				<text>若您对就医过程中的服务、流程等有不满意的地方，请告诉我们，以便于督促我们不断改进。</text>
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
				<view v-show="currentTab === 0">
					<view class="user-info">
						<view class="form-item">
							<view class="label">
								<view class="x">*</view>
								<text>姓名</text>
							</view>
							<input placeholder="请输入姓名" v-model="form.name" class="border input" />
						</view>
						<view class="form-item">
							<view class="label">
								<view class="x">*</view>
								<text>手机号</text>
							</view>
							<input placeholder="请输入手机号" v-model="form.phone" class="border input" keyboard="number" maxlength="11"  />
						</view>
						<view class="form-item">
							<view class="label">
								<view class="x">*</view>
								<text>门诊/住院</text>
							</view>
							<uni-data-checkbox v-model="form.departmentComplainedAgainst" :localdata="department"></uni-data-checkbox>
						</view>
						<view class="form-item">
							<view class="label">
								<view class="x">*</view>
								<text>投诉环节</text>
							</view>
							<uni-data-checkbox multiple v-model="complaintSection" :localdata="complaintSteps"></uni-data-checkbox>
						</view>
						<view class="form-item">
							<view class="label">
								<view class="x">*</view>
								<text>具体内容</text>
							</view>
							<textarea
								class="border textarea"
								v-model="form.specificContent"
								placeholder="请输入投诉内容，描述具体经过"
							/>
						</view>
						<button class="btnStyle bigBtn" @click="submit">提交</button>
					</view>
				</view>
				<!-- 历史投诉 -->
				<view class="history" v-show="currentTab === 1">
					<uni-section type="line" v-if="lists.length">
						<uni-list border-full>
							<uni-list-item 
							v-for="(val, key) in lists" 
							ellipsis="1"
							:key="key" 
							:title="val.name" 
							:note="val.specificContent" 
							:rightText="val.status" 
							/>
						</uni-list>
					</uni-section>
					<noData v-else />
				</view>
			</view>
		</view>
		<view class="fill" :style="{ height: barHeight + 'px' }"></view>
	</view>
	
</template>

<script>
	import { mapState } from 'vuex'
	import login from '@/utils/login.js'
	import customerNav from '@/components/customerNav.vue';
	import noData from '../components/noData.vue';
	import questionItem from '../components/questionItem.vue'
	import { getStatusBarHeight } from "@/utils/system.js";
	import questionnaireApi from '@/api/questionnaireApi.js'
	
	export default {
	  components: {
			noData,
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
				form: {
					name: '',
					phone: '',
					departmentComplainedAgainst: '',
					complaintSection: '',
					specificContent: '',
				},
				tabs: ['新建投诉', '历史投诉'],
				department: [
					{
						text: '门诊',
						value: '门诊',
					},
					{
						text: '住院',
						value: '住院',
					},
				],
				complaintSteps: [],
				complaintSection: [],
				status: [],
				lists: [],
			}
		},
		methods: {
			onTabClick(e) {
				this.currentTab = e.currentIndex
			},
			onStepChange(e) {
				this.complaintSection = e.detail.value
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
			getComplaintContent(type) {
			  return new Promise((resolve, reject) => {
			    questionnaireApi.getComplaintContent(type).then((res) => {
			      if (res.data.code === 200) {
			        if (type === 'cloud_complaint_status') {
			          this.status = res.data.data;
			        } else {
								res.data.data.map(v => {
									this.complaintSteps.push({
										text: v.dictLabel,
										value: v.dictValue
									})
								})
			        }
			      }
			      resolve();
			    }).catch(reject);
			  });
			},
			getList() {
				let data = { patientId: this.footData.patientUniquelyIdentifies };
				questionnaireApi.getComplaintsAndSuggestionsList(data).then((res) => {
					this.lists = [];
					if (res.data.list) {
						res.data.list.map(v => {
							v.status = this.status.filter(x => x.dictValue == v.status)[0].dictLabel
						})
						this.lists = res.data.list;
						this.lists = res.data.list.map(v => {
						  const safeTime = v.createTime.replace(/-/g, '/');
						  return {
						    ...v,
						    createTimeForSort: new Date(safeTime)
						  };
						});
						
						this.lists.sort((a, b) => b.createTimeForSort - a.createTimeForSort);
					}
				});
			},
			submit() {
				if (!this.footData.patientUniquelyIdentifies) {
					login.loginData().catch((error) => {});
				} else {
					if (!this.form.name ||!this.form.phone ||!this.form.departmentComplainedAgainst || !this.form.specificContent) {
						uni.showToast({
							title: '请完善您的信息',
							icon: 'none',
							duration: 2000 
						})
					} else {
						const phoneReg = /^1[3-9]\d{9}$/;
						if (!phoneReg.test(this.form.phone)) {
							uni.showToast({ title: '手机号格式不正确', icon: 'none' });
						} else {
							this.form.patientId = this.footData.patientUniquelyIdentifies,
							this.form.complaintSection = this.complaintSection.join(',');
							questionnaireApi.addComplaintContent(this.form).then(res => {
								if (res.data.code == 200) {
									this.form = {
										name: '',
										phone: '',
										departmentComplainedAgainst: '',
										complaintSection: '',
										specificContent: '',
									};
									this.complaintSection = [];
									
									uni.showToast({
										title: '反馈成功，敬请等待',
										icon: 'success',
										duration: 2000 
									})
									setTimeout(() => {
										this.getList();
									}, 200);
								}
							});
						}
					}
				}
			}
		},
		mounted() {
			this.getComplaintContent('cloud_complaint_section');
			if (this.footData.patientUniquelyIdentifies) {
				this.getComplaintContent('cloud_complaint_status').then(() => {
					this.getList();
				});
			} else {
				this.getComplaintContent('cloud_complaint_status');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.homeLayout {
		width: 100%;
		overflow-x: hidden;
		.goBack {
			position: fixed;
			z-index: 999;
			top: 0;
			left: 30rpx;
			margin-left: 0;
			width: 30px;
			height: 30px;
			border: 1rpx solid rgba(255, 255, 255, 0.3);
			border-radius: 35px;
			background: #87653A;
			display: flex;
			align-items: center;
			justify-content: center;
			backdrop-filter: blur(10rpx);
		}
		
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
			.history {
				width: 700rpx;
				margin-top: 20rpx;
			}
			.user-info {
				width: 700rpx;
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
			  flex-direction: column;
				.x {
					color: red;
					margin-right: 10rpx;
				}
			}
			.checkbox-list {
			  display: flex;
			  flex-wrap: wrap;
			  gap: 20rpx 30rpx;
			  margin-top: 10rpx;
			}
			.checkbox-label {
			  display: flex;
			  align-items: center;
			  font-size: 26rpx;
				.checkbox {
					transform: scale(0.8);
				}
				text {
					margin-left: 15rpx;
				}
			}
			.label {
				display: flex;
			  font-size: 30rpx;
			  color: #333;
			  margin-bottom: 10rpx; 
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
