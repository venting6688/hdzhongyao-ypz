import { cjRequest } from '@/utils/service.js'
const patient = {
	//获取手机验证码
  async sendVerificationCode(phoneNum) {
		const res = await cjRequest({
			url: "sendVerificationCode",
			method: "get",
			data:{
					phoneNum:phoneNum,
			}
		},2)
		return res
	},
	// 建档
	async archive(filingDTO) {
		const res = await cjRequest({
			url: "archive",
			method: "post",
			data:filingDTO,
		},2)
		return res
	},
	//建档信息查询
	async archiveQuery(data) {
		const queryParams = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
		const url = `archiveQuery?${queryParams}`;
		console.log(url);
		const res = await cjRequest({
			url: url,
			method: "get",
		}, 2)
		return res
	},
	// 家庭管理添加成员
	// async queueFilingInfo(filingDTO) {
	// 	const res = await cjRequest({
	// 		url: "queueFilingInfo",
	// 		method: "post",
	// 		data:filingDTO,
	// 	},2)
	// 	return res
	// },
}
 
export default patient