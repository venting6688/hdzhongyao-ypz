import { cjRequest } from "@/utils/service.js";

//查询
const shop = {
	async getDrugListApi(params) {
		const url = `list?ownerUserId=${params.ownerUserId}`;
		const res = await cjRequest(
			{
				url: url,
				method: "get",
			},2
		);
		return res?.data || {};
	},
	async getDrugDetailApi(params) {
		const url = `detail/${params.drugId}`;
		const res = await cjRequest(
				{
						url: url,
						method: "get",
				},
				2
		);
		return res?.data || {};
	},
	
	//获取分类
	async getTypes() {
		const res = await cjRequest({
			url: "api/catalog/index",
			method: "post",
		},2)
		return res
	},
	//获取商品详情
	async getDetail(id) {
		const res = await cjRequest({
			url: "api/goods/detail?id="+id,
			method: "get",
		},2)
		return res
	},
	//收货地址
	async getAddressList(userId) {
		const res = await cjRequest({
			url: "api/address/list?userId="+userId,
			method: "get"
		},2)
		return res
	},
	//更新、添加收货地址
	async getAddressList(data) {
		const res = await cjRequest({
			url: "api/address/save?userId="+userId,
			method: "post",
		},2)
		return res
	},
	
	//删除收货地址
	async getAddressList(data) {
		const res = await cjRequest({
			url: "api/address/delete?userId="+userId,
			method: "post",
		},2)
		return res
	}
	
}
export default shop;
