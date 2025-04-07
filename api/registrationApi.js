
 
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
	// 获取所有专业组(小科室)
	// async getSpecialtyGroup(cliSerGroupID) {
	//    	const res = await cjRequest({
	//    		url: "getSpecialtyGroup",
	//    		method: "get",
	// 		data:{
	// 		cliSerGroupID: cliSerGroupID,
	// 		},
	//    	})
	//    	return res
	// },
	// 获取7天号源
	// async getScheduleDates(data) {
	//    	const res = await cjRequest({
	//    		url: "getDoctorQueues",
	//    		method: "get",
	// 			data:{
	// 				deptCode: data.patientID,
	// 				startDate: data.days,
	// 				endDate: data.specialtyGroupId,
	// 			},
	//    	})
	//    	return res
	// },
	// 获取医生
	async getScheduleDetail(data) {
	   	const res = await cjRequest({
	   		url: "getDoctorQueues",
	   		method: "get",
				data:{
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
	   	const res = await cjRequest({
	   		url: "getNumSource",
	   		method: "get",
			data:{
			patientID: data.patientID,
			dateStr: data.dateStr,
			scheduleItemCode: data.scheduleItemCode,
			},
	   	})
	   	return res
	},
	// 拉起支付
	async registrationPreOrder(data) {
	   	const res = await cjRequest({
	   		url: "createOrder ",
	   		method: "post",
				data,
	   	})
	   	return res
	},
	// 查询支付结果
	async queryPayResult(registrationPrePayResponse) {
	   	const res = await cjRequest({
	   		url: "queryPayResult",
	   		method: "post",
			data:registrationPrePayResponse,
	   	})
	   	return res
	},
	// 取消锁号
	async unLockNum(data) {
		const queryParams = Object.keys(data)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&');
		const url = `unLockNum?${queryParams}`;
	   	const res = await cjRequest({
	   		url: url,
	   		method: "post",
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
}
 
export default patient