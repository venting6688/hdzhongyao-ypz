<template>
	<view class="department">
		<HeaderBar :HeaderBar="HeaderBar" />
		<!-- <van-search
		    v-model="searchQuery"
		    placeholder="搜索科室"
		    @change="onSearchChange"
		/> -->
		<van-tree-select
			height="1000rpx"
			:items="filteredItems"
			:main-active-index.sync="mainActiveIndex"
			:active-id.sync="activeId"
			@click-nav="onNavClick"
			@click-item="onItemClick"
		/>
	</view>
</template>

<script>
	import HeaderBar from '@/components/HeaderBar.vue';
	import registrationApi from '@/api/registrationApi.js'
	export default {
		components:{
			HeaderBar
		},
		data() {
			return {
				HeaderBar:{
					title:'预约挂号',
					state:true,
				},
				searchQuery: '',
				items:[],
				filteredItems: [],
				stairDepartment:[],     //一级科室
				firstDepartment: [],
				secondDepartment:[],     //二级科室
				clickDepartment:[],
				activeId: null,
				mainActiveIndex: 0,
				departmentName: '内科'
			};
		},
		onLoad() {
			this.loginValue = uni.getStorageSync("loginData");
			if (!this.loginValue) {
				uni.navigateTo({ url:"/sub_packages/login/index?title=青岛西海岸新区第二中医医院" })
			} else {
				this.getServiceGroup()
			}
		},
		methods: {
			onSearchChange(value) {
				this.searchQuery = value.detail
				this.filterItemsFun();
			},
			// 获取科室所有信息
			getServiceGroup() {
				registrationApi.getServiceGroup().then(res => {
					if(res.data.code === 200) {
						let data =  res.data.data;
						data.map(v => {
							if (v.parentDeptName == null) {
								v.parentDeptName = '其他'
							}
						})
						let filterFirst = data.filter(x => x.parentDeptName != null);
						filterFirst.map(v => {
							if (!this.firstDepartment.includes(v.parentDeptName)) {
								this.stairDepartment.push({
									text: v.parentDeptName,
									children: []
								})
								this.firstDepartment.push(v.parentDeptName)
							}
						})
						if(this.firstDepartment.length){
							this.stairDepartment.map(v => {
								this.secondDepartment = data.filter(x => x.parentDeptName == v.text);
								let sendDepartment = data.filter(x => x.parentDeptName == v.text);
								sendDepartment.map(val => {
									this.secondDepartment.push({
										deptCode: val.deptCode,
										text: val.deptName,
										parentDeptCode: val.parentDeptCode,
										simplePy: val.simplePy,
										fullPy: val.fullPy,
									})
								})
								v.children = this.secondDepartment
							})
							this.filteredItems = this.stairDepartment;
						}
					}
				}).catch(err => {
					console.log('errrrrr：', err);
				})
			},
			//搜索科室
			filterItemsFun() {
				if (this.searchQuery) {
					this.filteredItems = this.items.map((category,index) => {
					// 检查父类的 text 属性是否包含 searchQuery
					const parentMatches = category.text.includes(this.searchQuery);
					if(parentMatches){
					// this.mainActiveIndex = index
					return {
							...category,
					};
					}
					return null;
					}).filter(category => category !== null);
				} else {
					this.filteredItems = this.items;
				}
				this.mainActiveIndex = 0
				let CliSerGroupID = this.filteredItems[this.mainActiveIndex].CliSerGroupID
				this.getSpecialtyGroup(CliSerGroupID)
			},
			onNavClick(index) {
				this.mainActiveIndex = index.target.index;
				this.clickDepartment = this.filteredItems[this.mainActiveIndex];
				this.departmentName = this.clickDepartment.text;
				
				this.filteredItems.forEach((i,x)=> {
					if(x === this.mainActiveIndex){
						i.children = this.clickDepartment['children'];
					}
				})
			},
			onItemClick(item) {
				this.activeId = item.target.text;
				this.searchQuery = ''
				this.filteredItems = []
				this.items = []
					// 处理点击事件
					uni.navigateTo({
						url: `/sub_packages/subscribe/doctors?title=${item.target.text}&deptCode=${item.target.deptCode}&parentDeptName=${this.departmentName}&detail=${item.target.text}`
					})
			}
	},
	mounted() {
	}
};
</script>

<style  lang="less" scoped>
	.department {
		width: 100vw;
		height: 100%; 
		background-color: #ffffff;
		// input
		/deep/.van-search{
			width: 681.3rpx;
			height: 61.07rpx;
			background: #f2f6f9;
			border-radius: 7.63rpx;
			margin: 35rpx auto;
		}
		// select
		/deep/ .van-tree-select__nav{
			background-color: #ffffff;
		}
		/deep/ .van-sidebar-item{
			background-color: #ffffff;
		}
		/deep/ .van-sidebar-item--selected {
		  color: #3E99FF;
		  background: #f2f6f9;
		  border-color: var(--sidebar-selected-border-color,#3E99FF);
		     
		}
		/deep/ .van-tree-select__content{
			background-color: #F2F6F9;
			width: 65%;
			
			.van-ellipsis {
				border-bottom: 2rpx solid #ffffff;
			}
		}
		
	}
</style>