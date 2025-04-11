 import store from '../store';
 function loginData(state) {
	return new Promise((resolve, reject) => {
		let loginValue = uni.getStorageSync("loginData");
		if (!loginValue) {
			uni.showModal({
				title: '您未登录账户，请您登录后使用。',
				cancelText: '暂不登录',
				confirmText: '立即登录',
				confirmColor: '#576B95',
				success: res => {
					if (res.confirm) { 
						uni.navigateTo({
							url:"/sub_packages/login/index?title=青岛西海岸新区第二中医医院"
						})
						reject()
					} else if (res.cancel) { 
						//loginData()
						reject()
					}
					store.commit('SET_SHOW_MODAL_STATE', false);
				},	
				fail: () => {},
				complete: () => {}
			});
		} else {
		uni.showModal({
			title: '您的账户下没有添加家庭成员信息，您需要添加家庭成员后使用',
			cancelText: '暂不绑定',
			confirmText: '立即绑定',
			confirmColor: '#576B95',
			success: res => {
				if (res.confirm) { 
					uni.navigateTo({ url:"/sub_packages/family/familyInformation" })
					reject()
				} else if (res.cancel) {
					reject()
				}
				store.commit('SET_SHOW_MODAL_STATE', false);
			},
			fail: () => {},
			complete: () => {}
		});
	}
	})
}
export default {
	loginData
}