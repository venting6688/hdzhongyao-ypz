import { cjRequest } from '@/utils/service.js'

const healthCard = {
	//验证授权
	async cardVerification(data) {
		const res = await cjRequest({
			url: "registerHealthCardPreAuth",
			method: "post",
			data
		})
		return res
	},
	
	//注册就诊人
	async registerHealthCardPreFill(data) {
		const res = await cjRequest({
			url: "registerHealthCardPreFill",
			method: "post",
			data
		})
		return res
	},
	
	//获取就诊人信息
	async getHealthCardByHealthCode(data) {
		const queryParams = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
		const res = await cjRequest({
			url: `getHealthCardByHealthCode?${queryParams}`,
			method: "get",
		})
		return res
	},
	
	//存储健康卡
	async addHealthCard(data) {
		const res = await cjRequest({
			url: "addHealthCard",
			method: "post",
			data
		})
		return res
	},
	
	//获取健康卡列表
	async queueFilingInfo(data) {
		const queryParams = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
		const res = await cjRequest({
			url: `queueFilingInfo?${queryParams}`,
			method: "get",
		})
		return res
	},
	
	//删除健康卡
	async deleteByHealthCardId(data) {
		const queryParams = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
		const res = await cjRequest({
			url: `deleteArchiveById?${queryParams}`,
			method: "delete",
		})
		return res
	},
	
	//设置默认就诊人
	async updateDefaultArchives(data) {
		const res = await cjRequest({
			url: "updateDefaultArchives",
			method: "post",
			data
		})
		return res
	},
	
	//人脸识别获取就诊人信息
	async getOrderInfoByOrderId (data) {
		const queryParams = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
		const res = await cjRequest({
			url: `getOrderInfoByOrderId?${queryParams}`,
			method: "get",
		})
		return res
	},
	
	//获取人脸识别结果
	async registerRealPersonAuthOrder (data) {
		const res = await cjRequest({
			url: "registerRealPersonAuthOrder",
			method: "post",
			data
		})
		return res
	},
	
	//获取实人验证生成orderId
	async registerUniformVerifyOrder (data) {
		const res = await cjRequest({
			url: "registerUniformVerifyOrder",
			method: "post",
			data
		})
		return res
	},
	
	//实人验证结果查询
	async checkUniformVerifyResult (data) {
		const res = await cjRequest({
			url: "checkUniformVerifyResult",
			method: "post",
			data
		})
		return res
	},
	
	//检测用卡数据
	async reportHISData (data) {
		const res = await cjRequest({
			url: "reportHISData",
			method: "post",
			data
		})
		return res
	},
	
}

export default healthCard