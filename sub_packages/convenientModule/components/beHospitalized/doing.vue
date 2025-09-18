<template>
	<view class="doing">
		<view class="center">
			<view class="title">
				<view @click="matter(i.type)" :class="{b:type===i.type}" v-for="(i,x) in titleList" :key="x">{{i.name}}({{type == i.type ? matterList.length : 0}}项)</view>
			</view>
			<ul class="today" v-if="type ==='today'">
				<li v-for="(item, index) in matterList" :key="index">
					<view class="time">
						<view>治疗时间:</view>
						<view><view>{{item.date}}</view></view>
					</view>
					<uni-table border stripe>
						<uni-tr>
							<uni-th>项目</uni-th>
							<uni-th>状态</uni-th>
						</uni-tr>
						<uni-tr v-for="(val,key) in item.detail" :key="key">
							<uni-td>{{val.OrdDesc}}</uni-td>
							<uni-td>{{val.ExStatus}}</uni-td>
						</uni-tr>
					</uni-table>
				</li>
			</ul>
			
			<ul class="today" v-else>
				<!-- <li style="border-bottom: 1px solid #eee;">
					<view class="project">
						<view><uni-icons type="info-filled"></uni-icons>注意:</view>
						<view>
							<view>请提前半个小时到检查科室等候检查</view>
						</view>
					</view>
				</li> -->
				<li v-for="(item, index) in matterList" :key="index">
					<view class="time">
						<view>预约时间:</view>
						<view><view>{{item.date}}</view></view>
					</view>
					<uni-table border stripe>
						<uni-tr>
							<uni-th>项目</uni-th>
							<uni-th>状态</uni-th>
						</uni-tr>
						<uni-tr v-for="(val,key) in item.detail" :key="key">
							<uni-td>{{val.OrdDesc}}</uni-td>
							<uni-td>{{val.ExStatus}}</uni-td>
						</uni-tr>
					</uni-table>
				</li>
			</ul>
			
			<view v-if="matterList.length === 0" class="without">
				<image src="https://aiwz.sdtyfy.com:8099/img/wu.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import { mapState } from 'vuex';
	import bus from "@/utils/bus.js";
	import hospitalizationApi from '@/api/hospitalizationApi.js';
	export default {
		props: { headerEmit: Object },
		data() {
			return {
				matterList: [],
				otherNum: 0,
				type: 'today',
				titleList:[
					{
						name:'今日事项',
						type:'today',
					},
					{
						name:'预约事项',
						type:'other',
					},
				],
			}
		},
		computed: {
			...mapState(['footData','department']),
		},
		mounted() {
			this.getMattersList('today')
		},
		
		methods: {
			matter(val){
				this.type = val
				this.getMattersList(this.type)
			},
			// 获取事项
			async getMattersList(type) {
				let id = this.footData.patientUniquelyIdentifies;
				let data = {
					patientID: this.footData.patientUniquelyIdentifies,
					AimFlag: 'Dep'
				}
				let res = await hospitalizationApi.getHospitalRecord(data);
				if (res.data.code === 200) {
					let admId = res.data.data.admInfoList.admInfo[0].admID;
					let nowDate = dayjs().format('YYYY-MM-DD');
					let sendDate = dayjs().add(1, 'days').format('YYYY-MM-DD');
					let nextDate = dayjs(sendDate).add(7, 'days').format('YYYY-MM-DD');
					let str = {
						admId,
						startTime: type == 'today' ? nowDate : sendDate,
						endTime: type == 'today' ? nowDate : nextDate,
					}
					let matterRes = await hospitalizationApi.getMattersRecord(str);
					if (matterRes.data.code === 200){
						let data = matterRes.data.data.Data;
						this.matterList = Object.entries(data).map(([date, detail]) => ({
						  date,
						  detail
						}));
					} else {
						this.matterList = [];
					}
				}
			},
		},
	}
</script>

<style lang="less" scoped>
	.moveR-enter-active,  .moveR-leave-active {
	    transition: all 4s linear;
	    transform: translateX(0);
	  }
	   .moveR-enter,  .moveR-leave {
	    transform: translateX(100%);
	  }
	   .moveR-leave-to{
	     transform: translateX(100%);
	   }
	   .b {
	   	background: #f0f7ff;
			color: #0B69B6;
	   }
	.doing{
		// background: fuchsia;
		.center {
			margin:28rpx 33rpx 28rpx 33rpx;
			width: 684rpx;
			background: #ffffff;
			border-radius: 12rpx;
			.title {
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				padding: 10rpx 0;
				margin: 0 20rpx;
				border-bottom: 2rpx solid #eeeeee;
				color: #7D7D7D;
				view {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 312rpx;
					height: 64rpx;
				}
			}
			.today {
				text-align: left;
				padding-bottom: 10rpx;
				> li {
					margin: 0 20rpx;
					padding: 20rpx 0;
					
					&:last-child{
						border: 0;
					}
					// width: 100%;
					.time {
						display: flex;
						padding: 10rpx 0 20rpx;
						font-weight: 600;
						>view {
							&:first-child{
								margin-right: 10rpx;
							}
						}
					}
					.project {
						display: flex;
						padding: 10rpx 0;
						>view {
							.text-red {
							  color: red;
							}
							&:first-child{
								width: 20%;
								color: #999999;
								margin-right: 10rpx;
							}
							&:last-child{
								margin-right: 10rpx;
								width: 80%;
								
								.list {
									margin-top: 20rpx;
									display: flex;
									justify-content: space-between;
								}
							}
						}
					}
				}
			}
			.subscribe {
				padding: 28rpx 0;
				> li {
					margin:0 4% 0 4%;
					width: 92%;
					display: flex;
					
					&:first-child{
						// margin:3% 6% 0 4%;
						.attribute{
							color: #000 !important;
						}
					}
					
					.attribute{
						color: #888888;
						width: 22%;
						display: flex;
						margin-bottom:2%;
						justify-content: left;
					}
					
					.name {
						min-height: 36rpx;
						display: flex;
						text-align: left;
						margin-bottom:2%;
						width: 78%;
					}
				}
			}
		}
	}
</style>
