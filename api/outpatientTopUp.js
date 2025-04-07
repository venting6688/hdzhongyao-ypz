import { cjRequest } from '@/utils/service.js'
 
const patient = {
	// 充值前需要用这个接口里面的参数
	async getAccountInformation(data) {
		const res = await cjRequest({
			url: `outpatientRecharge/getAccountInformation?patientID=${data.patientID}&cardType=${data.cardType}`,
			method: "get",
		})
		return res
	},
	// 拉起微信支付页面
	async outpatientRechargePreOrder(data) {
		const queryParams = Object.keys(data)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&');
		const url = `outpatientRecharge/outpatientRechargePreOrder?${queryParams}`;
	   	const res = await cjRequest({
	   		url: url,
	   		method: "post",
					
	   	})
	   	return res
	},
	// 查询支付结果
	async queryOutpatientRechargeResult(data) {
	   	const res = await cjRequest({
	   		url: "outpatientRecharge/queryOutpatientRechargeResult",
	   		method: "post",
			data,
	   	},1)
	   	return res
	},
	// 充值记录
	async rechargeRecord(data) {
		const queryParams = Object.keys(data)
		.map(key => `${key}=${data[key]}`)
		.join('&');
		const url = `outpatientRecharge/rechargeRecord?${queryParams}`;
	   	const res = await cjRequest({
	   		url: url,
	   		method: "get",
	   	})
	   	return res
	},
}
 
export default patient