import { cjRequest } from "@/utils/service.js";

//查询
export async function getMemberListApi(params) {
	const url = `member/list?ownerUserId=${params.ownerUserId}`;
	const res = await cjRequest(
		{
			url: url,
			method: "get",
		},
		2
	);
	return res?.data || {};
}
// 新增家庭成员
export async function addMemberApi(params) {
	const url = `member/create`;
	const res = await cjRequest(
		{
			url: url,
			method: "post",
			data: params,
		},
		2
	);
	return res?.data || {};
}

// 设置默认就诊人
export async function setDefaultMemberApi(params) {
	const url = `member/setDefault/${params.familyId}/${params.ownerUserId}`;
	// const url = `member/setDefault?familyId=${params.familyId}&ownerUserId=${params.ownerUserId}`;
	const res = await cjRequest(
		{
			url: url,
			method: "post",
			data: params,
		},
		2
	);
	return res?.data || {};
}
