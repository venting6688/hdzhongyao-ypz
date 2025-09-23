import { cjRequest } from '@/utils/service.js'

const questionnaire = {
	async getComplaintContent(type) {
		const res = await cjRequest({
			url: "dict/data/type/"+type,
			method: "get"
		}, 2)
		return res
	},
	
	async getComplaintsAndSuggestionsList(data) {
		const queryParams = Object.keys(data)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&');
		const url = `diagnose/ComplaintsAndSuggestions/list?${queryParams}`;
		const res = await cjRequest({
			url,
			method: "get"
		})
		return res
	},
	
	async addComplaintContent(data) {
		const res = await cjRequest({
			url: "diagnose/ComplaintsAndSuggestions/add",
			method: "post",
			data,
		})
		return res
	},
	//调查问卷
	async submitAnswers(data) {
		const res = await cjRequest({
			url: "diagnose/cloudSatisfactionSurvey/add",
			method: "post",
			data,
		})
		return res
	},
}

export default questionnaire