import login from './login.js'
import store from '../store';
let requestCount = 0
/**
 *
 * @param state   1: 没有加载弹框    2：跳过判断登录弹窗     3：定时刷新接口不弹窗
 * @param isArraybuffer   是否返回arraybuffer类型数据，默认返回text类型数据, 用于接收二进制格式文件
*/
export const cjRequest =  (parmas, state, isArraybuffer = false, isNew = false) => {
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
				return request(parmas,state, isArraybuffer, isNew)
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
		return request(parmas,state, isArraybuffer, isNew)
	}
}

const baseUrl = "https://api.2zhongyi.cn/prod-api/"
// const baseUrl = "http://192.168.10.45:8088/mobile/"
const middleUrl = "mobile2/"
const middleUrlNew = "mobile/"

function request(parmas,state, isArraybuffer, isNew = false) {
	let header = { "Authorization": store.state.loginToken };

	return new Promise((resolve, reject) => {
		if(!state){
			requestCount++;
			uni.showLoading({
				title:'加载中'
			})
		}
		uni.request({
			url: baseUrl + (isNew ? middleUrlNew : middleUrl) + parmas.url,
			method: parmas.method,
			header,
      responseType: isArraybuffer ? 'arraybuffer' : 'text',
			data: parmas.data,
			success: res => {
				if(!state){
					requestCount--;
					if(!requestCount){
						uni.hideLoading()
					}
				}
				if (res.data.code === 401) {
				  uni.showModal({
						title: '登录过期',
						content: '请重新授权手机号登录',
						showCancel: false,
						success: () => {
							uni.navigateTo({ url:"/sub_packages/login/index?title=青岛西海岸新区第二中医医院" });
						}
					});
				}
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
		});
	})
}
