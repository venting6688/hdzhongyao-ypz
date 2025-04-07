
 
import { cjRequest } from '@/utils/service.js'
 
 
const patient = {
	/**
		 * 获取初诊卡片数据
	*/
		async getFirstVisit(patientID,state) {
			const res = await cjRequest({
				url: "cardContent/getFirstVisit",
				method: "get",
				data:{
				patientID,
				}
			},state)
			return res
		},
	/**
		 * 获取预约卡片数据
	*/
		async getBookingRecord(data) {
			const res = await cjRequest({
				url: `cardContent/getBookingRecord?patientID=${data.patientID}&startTime=${data.startTime}&endTime=${data.endTime}`,
				method: "get",
			},1)
			return res
		},
	/**
		 * 取消预约
	*/
		async cancelAppointmentRegister(orderCode) {
			const res = await cjRequest({
				url: `cancelAppointmentRegister?orderCode=${encodeURIComponent(orderCode)}`,
				method: "post",
			})
			return res
		},
		
	/**
		 * 退号
	*/
		async cancelRegistration(visitNum) {
			const res = await cjRequest({
				url: `cancelRegistration?visitNum=${encodeURIComponent(visitNum)}`,
				method: "post",
			})
			return res
		},
	/**
		 * 预约取号
	*/
		async takeANumberPrePay(data) {
			const queryParams = Object.keys(data)
			.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
			.join('&');
			const url = `takeANumberPrePay?${queryParams}`;
			const res = await cjRequest({
				url: url,
				method: "post",
			})
			return res
		},
	/**
		* 查询取号的支付结果
	*/
	async queryPayResultForTakeANumber(data) {
		const res = await cjRequest({
			url: "queryPayResultForTakeANumber",
			method: "post",
			data,
		})
		
		return res
	},
	/**
		 * 获取查验接口
	*/
	async getExaminationOrTest(visitNumber) {
		const res = await cjRequest({
			url: `cardContent/getExaminationOrTest?visitNumber=${visitNumber}`,
			method: "get",
		},1)
		return res
	},
   /**
   	 * 获取回诊卡片数据
   */
   	async getReportQueue(data) {
   		const res = await cjRequest({
   			url: `cardContent/getReportQueue?patientID=${data.patientID}&departmentCode=${data.departmentCode}`,
   			method: "get",
   		},1)
   		
   		return res
   	},
	/**
		 * 回诊签到接口
	*/
	async checkInForReturnVisit(data) {
		const res = await cjRequest({
			url: `cardContent/checkInForReturnVisit?patientID=${data.patientID}&admQueID=${data.admQueID}`,
			method: "post",
		})
		return res
	},
    /**
    	 * 获取处方接口
    */
    async getMedication(visitNumber) {
    	const res = await cjRequest({
    		url: `cardContent/getMedication?visitNumber=${visitNumber}`,
    		method: "get",
    	},1)
    	return res
    },
	/**
		 * 查验签到接口
	*/
	async medicalTechnologySignIn(data) {
		const queryParams = Object.keys(data)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&');
		const url = `cardContent/medicalTechnologySignIn?${queryParams}`;
		  	const res = await cjRequest({
		  		url: url,
		  		method: "post",
		  	})
		return res
	},
	
	/**
		* 查验刷新信息接口
	*/
	async medicalTechnologyReportQueue(data) {
		const queryParams = Object.keys(data)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&');
		const url = `cardContent/medicalTechnologyReportQueue?${queryParams}`;
		  	const res = await cjRequest({
		  		url: url,
		  		method: "post",
		  	},1)
		return res
	},
	/**
		* 初诊回诊刷新信息接口
	*/
	async getQueueingMessage(data) {
		const res = await cjRequest({
			url: "cardContent/getQueueingMessage",
			method: "get",
			data:data
		},1)
		
		return res
	},
	
	/**
		* 预问诊结论保存
	*/
	async PreConsultation(data) {
		const res = await cjRequest({
			url: "PreConsultation",
			method: "post",
			data:data.data,
		})
		
		return res
	},
}
 
export default patient