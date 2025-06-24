import { cjRequest } from '@/utils/service.js'

const patient = {
	//获取住院信息
	async getHospitalizationRecord(data) {
		const queryParams = Object.keys(data)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&');
		
		const res = await cjRequest({
			url: `zyQueryPatientInfo?${queryParams}`,
			method: "get",
		})
		return res
	},
	
	//获取住院清单
	async getHospitalizationList(data) {
		const queryParams = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
		
		const res = await cjRequest({
			url: `zyQueryBillDetail?${queryParams}`,
			method: "get",
		})
		return res
	},
	
	//住院押金
	async hospitalDepositPrePay(data) {
		const res = await cjRequest({
			url: `addDeposit`,
			method: "post",
			data
		})
		return res
	},
	
	//查询住院押金支付状态
	async queryHospitalDepositPrePayResult(data) {
		const res = await cjRequest({
			url: `hospitalizedInformation/queryHospitalDepositPrePayResult`,
			method: "POST",
			data,
		})
		return res
	},
	
	//获取充值记录
	async getPayRecord(data) {
		const queryParams = Object.keys(data)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&');
		
		const res = await cjRequest({
			url: `getDepositByCardNo?${queryParams}`,
			method: "get",
		}, 2)
		return res
	},
	
}
 
export default patient