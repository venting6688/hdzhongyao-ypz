import { cjRequest } from '@/utils/service.js'

const healthCard = {
	async cardVerification(data) {
		const res = await cjRequest({
			url: "registerHealthCardPreAuth",
			method: "post",
			data
		})
		return res
	}
}

export default healthCard