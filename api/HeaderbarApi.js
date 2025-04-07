
 
import { cjRequest } from '@/utils/service.js'
 
const patient = {
	/**
	 * 获取就诊阶段(上方横条)
    */
   async getTreatmentStageNew(data,state) {
	   const queryParams = Object.keys(data)
	   .map(key => `${key}=${data[key]}`)
	   .join('&');
	   const url = `cardContent/getTreatmentStageNew?${queryParams}`;
	     	const res = await cjRequest({
	     		url: url,
	     		method: "get",
	     	},state)
	     	return res
   },
    /**
    	 * 获取建议列表
        */
       async getSuggest(data) {
       	const res = await cjRequest({
       		url: "cardContent/getSuggest",
       		method: "get",
       		data:{
       		visitNumber: data,
       		}
       	})
       	return res
       },
		/**
		  * footer更换就诊人
		*/
		    async updateDefaultArchives(data) {
		    	const res = await cjRequest({
		    		url: `updateDefaultArchives?patientCard=${data.patientCard}&phone=${data.phone}`,
		    		method: "post",
		    		
		    	})
		    	return res
		    },
		/**
		  * 刷新用户信息
		*/
		    async refreshUserInfo(phoneNum) {
		    	const res = await cjRequest({
		    		url: `refreshUserInfo?phoneNum=${phoneNum}`,
		    		method: "get",
		    	})
		    	return res
		    },
}
 
export default patient