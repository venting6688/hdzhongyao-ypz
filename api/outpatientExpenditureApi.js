import { cjRequest } from '@/utils/service.js'
 
const patient = {
	// 待缴费结算单
	   async getToBePaid(data) {
	   	const res = await cjRequest({
	   		url: "cardContent/getToBePaid",
	   		method: "get",
	   		data:{
				patientID:data.patientID,
	   		    visitNumber:data.visitNumber, 
	   		    startDate:data.startDate, 
	   		    endDate:data.endDate, 
	   		}
	   
	   	},)
	   	return res
	   },
	   // 待缴费就诊记录
	   async queryMedicalRecords(data) {
	   	const res = await cjRequest({
	   		url: "cardContent/queryMedicalRecords",
	   		method: "get",
	   		data:{
	   			patientID:data.patientID,
	   		    startDate:data.startDate, 
	   		    endDate:data.endDate, 
	   		}
	   
	   	},)
	   	return res
	   },
	   // 拉起缴费
	   async toBePaidPreOrder(data) {
	   	const queryParams = Object.keys(data)
	   	.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
	   	.join('&');
	   	const url = `cardContent/toBePaidPreOrder?${queryParams}`;
	      	const res = await cjRequest({
	      		url: url,
	      		method: "post",
				
	      	})
	      	return res
	   },
	   // 查询支付结果
	   async queryPayResultForToBePaid(ToBePaidPreOrderResponse) {
	      	const res = await cjRequest({
	      		url: "cardContent/queryPayResultForToBePaid",
	      		method: "post",
	   		    data:ToBePaidPreOrderResponse,
	      	},1)
	      	return res
	   },
	   // 取消预结算
	   async cancelPreSettlement(data) {
	   	const queryParams = Object.keys(data)
	   	.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
	   	.join('&');
	   	const url = `cardContent/cancelPreSettlement?${queryParams}`;
	      	const res = await cjRequest({
	      		url: url,
	      		method: "post",
	      	})
	      	return res
	   },
	   // 已缴费就诊记录
	   async getPaymentRecord(data) {
	   	const queryParams = Object.keys(data)
	   	.map(key => `${key}=${data[key]}`)
	   	.join('&');
	   	const url = `cardContent/getPaymentRecord?${queryParams}`;
	      	const res = await cjRequest({
	      		url: url,
	      		method: "get",
	      	})
	      	return res
	   },
	   // 已缴费就诊记录明细
	   async getPaymentDetails(data) {
	   	const queryParams = Object.keys(data)
	   	.map(key => `${key}=${data[key]}`)
	   	.join('&');
	   	const url = `cardContent/getPaymentDetails?${queryParams}`;
	      	const res = await cjRequest({
	      		url: url,
	      		method: "get",
	      	})
	      	return res
	   },
}
 
export default patient