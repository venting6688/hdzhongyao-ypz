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
  async getDrugDetailApi({ drugId, userId }) {
    const url = `/api/goods/detail?id=${drugId}&userId=${userId}`;
    const res = await cjRequest(
      {
        url: url,
        method: "post",
      },
      2
    );
    return res?.data || {};
  },

  //获取分类
  async getTypes() {
    const res = await cjRequest(
      {
        url: "api/catalog/index",
        method: "post",
      },
      2
    );
    return res;
  },
  //获取商品详情
  async getDetail(id) {
    const res = await cjRequest(
      {
        url: "api/goods/detail?id=" + id,
        method: "get",
      },
      2
    );
    return res;
  },
  //收货地址
  async getAddressList(userId) {
    const res = await cjRequest(
      {
        url: "api/address/list?userId=" + userId,
        method: "get",
      },
      2
    );
    return res;
  },
  //更新、添加收货地址
  async saveAddress(data) {
    const res = await cjRequest(
      {
        url: "api/address/save",
        method: "post",
        data,
      },
      2
    );
    return res;
  },

  //删除收货地址
  async deleteAddress(id) {
    const res = await cjRequest(
      {
        url: "api/address/delete?id=" + id,
        method: "delete",
      },
      2
    );
    return res;
  },
  // 获取订单列表
  // async getOrderListApi({ userId, page, size }) {
  //   const res = await cjRequest(
  //     {
  //       url: "/api/order/list",
  //       method: "get",
  //       data: {
  //         userId,
  //         page,
  //         size,
  //       },
  //     },
  //     2
  //   );
  //   return res?.data || {};
  // },
  // 获取订单列表
  async getOrderListApi({ userId }) {
    const res = await cjRequest(
      {
        url: "/api/order/orderList",
        method: "get",
        data: {
          userId,
        },
      },
      2
    );
    return res?.data || {};
  },
  // 获取订单详情
  async getOrderDetailApi({ orderId, userId }) {
    const res = await cjRequest(
      {
        url: "/api/order/detail",
        method: "get",
        data: {
          orderId,
          userId,
        },
      },
      2
    );
    return res?.data || {};
  },
  //   修改订单状态（支付成功后）
  async updateSuccessApi({ orderId, userId }) {
    const res = await cjRequest(
      {
        url: "/api/order/updateSuccess",
        method: "post",
        data: {
          orderId,
          userId,
        },
      },
      2
    );
    return res?.data || {};
  },
  //   订单提交
  async submitOrderApi({ userId, addressId, cartIds, postscript, type }) {
    const res = await cjRequest(
      {
        url: "/api/order/submit",
        method: "post",
        data: {
          userId,
          addressId,
          cartIds,
          postscript,
          type
        },
      },
      2
    );
    return res?.data || {};
  },
  //   订单取消
  async cancelOrderApi({ orderId, userId }) {
    const res = await cjRequest(
      {
        url: "/api/order/cancelOrder",
        method: "post",
        data: {
          orderId,
          userId,
        },
      },
      2
    );
    return res?.data || {};
  },
  //   确认收货
  async confirmOrderApi({ orderId, userId }) {
    const res = await cjRequest(
      {
        url: "/api/order/confirmOrder",
        method: "post",
        data: {
          orderId,
          userId,
        },
      },
      2
    );
    return res?.data || {};
  },
	//获取规格参数
	async getProductById(goodsIds) {
		goodsIds = goodsIds.join(',');
	  const res = await cjRequest(
	    {
	      url: "api/product/getProductsByIds?goodsId="+goodsIds,
	      method: "get",
	    }, 2
	  );
	  return res;
	},
	//加入购物车
  async addCart(data) {
    const res = await cjRequest(
      {
        url: "api/cart/add",
        method: "post",
				data
      },
      2
    );
    return res;
  },
	//购物车列表
  async cartList(userId) {
    const res = await cjRequest(
      {
        url: "api/cart/index?userId="+userId,
        method: "get",
      },
      2
    );
    return res;
  },
	//删除购物车
  async deleteCart(data) {
    const res = await cjRequest(
      {
        url: "api/cart/delete",
        method: "post",
				data
      },
      2
    );
    return res;
	},
//   获取支付的请求参数/api/pay/prepay
  async getPayPrepayApi({ orderId, openId, userId }) {
    const res = await cjRequest(
      {
        url: "/api/pay/prepay",
        method: "get",
        data: {
          orderId,
          openId,
          userId,
        },
      },
      2
    );
    return res?.data || {};
  },
};
export default shop;
