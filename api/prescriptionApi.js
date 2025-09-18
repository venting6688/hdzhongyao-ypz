
 
import { cjRequest } from '@/utils/service.js'
 
 
const prescription = {
	// 获取首页处方列表
	async getPrescription(cardNo) {
		const res = await cjRequest({
			url: "getPrescription?cardNo="+cardNo,
			method: "get",
		}, 2)
		return res
	}
}
 
export default prescription