import login from './login.js'
import store from '../store';
let requestCount = 0
/**
 *
 * @param state   1: 没有加载弹框    2：跳过判断登录弹窗     3：定时刷新接口不弹窗
*/
export const cjRequest =  (parmas, state) => {
	if(!store.state.loginValue && state!==2){
		let loginValue = uni.getStorageSync("loginData");
		if (loginValue){
			let data = loginValue
			if(!data){
				if(!store.state.showModalState && state!==3){
					store.commit('SET_SHOW_MODAL_STATE', true);
					return login.loginData(state)
				}else{
					return Promise.reject(false);
				}
				
			}else {
				store.commit('SET_LOGIN_VALUE', true);
				return request(parmas,state)
			}
		}else{
			if(!store.state.showModalState && state!==3){
				store.commit('SET_SHOW_MODAL_STATE', true);
				return login.loginData(state)
			}else{
				return Promise.reject(false);
			}
			
		}
		
	}else{
		return request(parmas,state)
	}
}
function request(parmas,state){
	return new Promise((resolve, reject) => {
		const baseUrl = "https://api.2zhongyi.cn/prod-api/mobile2/"
		if(!state){
			requestCount++;
			uni.showLoading({
				title:'加载中'
			})
		}
		wx.request({
			...parmas,
			url: baseUrl + parmas.url,
			success: (result) => {
			if(!state){
				requestCount--;
				if(!requestCount){
					uni.hideLoading()
				}
			}
				resolve(result)
			},
			fail: (err) => {
					reject(err)
			},
		}); 
	})
}
 