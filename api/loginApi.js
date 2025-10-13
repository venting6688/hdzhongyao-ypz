
 
import { cjRequest } from '@/utils/service.js'
 
 
const patient = {

	   async getPhoneNumber(data) {
	   	const res = await cjRequest({
	   		url: "XCXLogin",
	   		method: "get",
	   		data:{
					phoneCode:data.phoneCode,
					openidCode:data.openidCode, 
	   		}
	   
	   	},2)
	   	return res
	   },
}
 
export default patient