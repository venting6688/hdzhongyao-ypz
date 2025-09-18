
 
import { cjRequest } from '@/utils/service.js'
 
 
const patient = {
	// 获取所有服务组
	async getServiceGroup(data) {
		const res = await cjRequest({
			url: "getQueues",
			method: "get",
		}, 2)
		return res
	},
	// 获取医生
	async getScheduleDetail(data) {
	   	const res = await cjRequest({
	   		url: "getDoctorQueues",
	   		method: "get",
				data:{
					regMode: data.regMode,
					regType: data.regType,
					deptCode: data.deptCode,
					startDate: data.startDate,
					endDate: data.endDate,
				},
	   	}, 2)
	   	return res
	},
	// 其他时间预约
	async appointmentRegister(data) {
		const queryParams = Object.keys(data)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&');
		const url = `appointmentRegister?${queryParams}`;
	   	const res = await cjRequest({
	   		url: url,
	   		method: "post",
	   	})
	   	return res
	},
	// 获取医生号源
	async getNumSource(data) {
		const queryParams = Object.keys(data)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&');
		const res = await cjRequest({
			url: `registrationSources?${queryParams}`,
			method: "get",
		})
		return res
	},
	//发起订单
	async registerOrder(data) {
		const res = await cjRequest({
			url: "wxOrder",
			method: "post",
			data
		})
	   	return res
	},
	//支付
	async wxPay(data) {
		const res = await cjRequest({
			url: "wxPay",
			method: "post",
			data
		})
	  return res
	},
	// 查询支付结果
	async queryPayResult(data) {
		const queryParams = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
		const res = await cjRequest({
			url: `wxPayQuery?${queryParams}`,
			method: "get",
		})
		return res
	},
	
	//上传接口
	async registrationSettlement(data) {
		const res = await cjRequest({
			url: `registrationSettlement`,
			method: "post",
			data
		})
		return res
	},
	
	// 结算上传
	async opPay(data) {
		const res = await cjRequest({
			url: 'opPay',
			method: "post",
			data
		})
		return res
	},
	
	// 取消锁号
	async unRegistrationLock(data) {
		const res = await cjRequest({
			url: 'unRegistrationLock',
			method: "post",
			data
		})
		return res
	},
	// 锁号
	async registrationLock(data) {
		const queryParams = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
		const url = `registrationLock?${queryParams}`;
	   	const res = await cjRequest({
	   		url: url,
	   		method: "get",
	   	})
	   	return res
	},
	
	//退费
	async refund(data) {
		const res = await cjRequest({
			url: 'refund',
			method: "post",
			data
		})
		return res
	}
	
}
 
export default patient