 import store from '../store';
 function loginData(state) {
	return new Promise((resolve, reject) => {
		let loginValue = uni.getStorageSync("loginData");
		if (!loginValue) {
			uni.navigateTo({
				url:"/sub_packages/login/index?title=青岛西海岸新区第二中医医院"
			})
		} else {
			uni.navigateTo({ url:"/sub_packages/family/familyManage" })
		}
	})
}
export default {
	loginData
}