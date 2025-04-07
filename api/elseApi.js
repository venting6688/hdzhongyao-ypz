import { cjRequest } from '@/utils/service.js'
 
const patient = {
	
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
	
	// 就诊记录列表
	async getVisitRecord(data) {
		const queryParams = Object.keys(data)
		.map(key => `${key}=${data[key]}`)
		.join('&');
		const url = `MedicalRecords/getVisitRecord?${queryParams}`;
	   	const res = await cjRequest({
	   		url: url,
	   		method: "get",
	   	})
	   	return res
	},
	// 就诊记录详情列表
	async getDocumentRetrieval(data) {
		const queryParams = Object.keys(data)
		.map(key => `${key}=${data[key]}`)
		.join('&');
		const url = `MedicalRecords/getDocumentRetrieval?${queryParams}`;
	   	const res = await cjRequest({
	   		url: url,
	   		method: "get",
	   	})
	   	return res
	},
	// 获取报告详情
	async documentReview(data) {
		const queryParams = Object.keys(data)
		.map(key => `${key}=${data[key]}`)
		.join('&');
		const url = `MedicalRecords/documentReview?${queryParams}`;
	   	const res = await cjRequest({
	   		url: url,
	   		method: "get",
	   	})
	   	return res
	},
	// 获取检验结果状态
	async flag() {
		const res = await cjRequest({
			url: `dict/data/type/cloud_test_result_flag`,
			method: "get",
		})
		return res
	},
}
export default patient