import { cjRequest } from "@/utils/service.js";

//查询
const shop = {
    async getDrugListApi(params) {
        const url = `list?ownerUserId=${params.ownerUserId}`;
        const res = await cjRequest(
            {
                url: url,
                method: "get",
            },
            2
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
}
export default shop;
