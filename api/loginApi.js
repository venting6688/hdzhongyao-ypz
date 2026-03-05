

import { cjRequest } from '@/utils/service.js'


const patient = {

	   async getPhoneNumber(data) {
	   	const res = await cjRequest({
			 url: "miniProgramLogin",
	   		method: "post",
	   		data:{
					phoneCode:data.phoneCode,
					openidCode:data.openidCode,
	   		}
	   	},2,
        false,
        true)
	   	return res
	   },
}

export default patient
