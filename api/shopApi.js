import { cjRequest } from '@/utils/service.js'

//查询
const shop = {
  async getDrugListApi(params) {
    const url = `list?ownerUserId=${params.ownerUserId}`
    const res = await cjRequest(
      {
        url: url,
        method: 'get'
      },
      2
    )
    return res?.data || {}
  },
  async getDrugDetailApi({ drugId, userId }) {
    const url = `/api/goods/detail?id=${drugId}&userId=${userId}`
    const res = await cjRequest(
      {
        url: url,
        method: 'post'
      },
      2
    )
    return res?.data || {}
  },

  //获取分类
  async getTypes() {
    const res = await cjRequest(
      {
        url: 'api/catalog/index',
        method: 'post'
      },
      2
    )
    return res
  },
  //获取商品详情
  async getDetail(id) {
    const res = await cjRequest(
      {
        url: 'api/goods/detail?id=' + id,
        method: 'get'
      },
      2
    )
    return res
  },
  //收货地址
  async getAddressList(userId) {
    const res = await cjRequest(
      {
        url: 'api/address/list?userId=' + userId,
        method: 'get'
      },
      2
    )
    return res
  },
  //更新、添加收货地址
  async saveAddress(data) {
    const res = await cjRequest(
      {
        url: 'api/address/save',
        method: 'post',
        data
      },
      2
    )
    return res
  },

  //删除收货地址
  async deleteAddress(id) {
    const res = await cjRequest(
      {
        url: 'api/address/delete?id=' + id,
        method: 'delete'
      },
      2
    )
    return res
  },
  //默认收货地址
  async defaultAddress(userId) {
    const res = await cjRequest(
      {
        url: 'api/address/getDefaultAddress?id=' + userId,
        method: 'get'
      },
      2
    )
    return res
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
        url: '/api/order/orderList',
        method: 'get',
        data: {
          userId
        }
      },
      2
    )
    return res?.data || {}
  },
  // 获取订单详情
  async getOrderDetailApi({ orderId, userId }) {
    const res = await cjRequest(
      {
        url: '/api/order/detail',
        method: 'get',
        data: {
          orderId,
          userId
        }
      },
      2
    )
    return res?.data || {}
  },
  //   修改订单状态（支付成功后）
  async updateSuccessApi({ orderId, userId, orderSn }) {
    const res = await cjRequest(
      {
        url: `/api/order/updateSuccess?orderId=${orderId}&userId=${userId}&orderSn=${orderSn}`,
        method: 'post'
      },
      2
    )
    return res?.data || {}
  },
  //   订单提交
  async submitOrderApi(data) {
    const res = await cjRequest(
      {
        url: '/api/order/submit',
        method: 'post',
        data
      },
      2
    )
    return res?.data || {}
  },
  //   订单取消
  async cancelOrderApi({ orderId, userId }) {
    const res = await cjRequest(
      {
        url: `/api/order/cancelOrder?orderId=${orderId}&userId=${userId}`,
        method: 'post'
      },
      2
    )
    return res?.data || {}
  },
  //   确认收货
  async confirmOrderApi({ orderId, userId }) {
    const res = await cjRequest(
      {
        url: `/api/order/confirmOrder?orderId=${orderId}&userId=${userId}`,
        method: 'post'
      },
      2
    )
    return res?.data || {}
  },
  //获取规格参数
  async getProductById(goodsIds) {
    goodsIds = goodsIds.join(',')
    const res = await cjRequest(
      {
        url: 'api/product/getProductsByIds?goodsId=' + goodsIds,
        method: 'get'
      },
      2
    )
    return res
  },
  async addCart(data) {
    const res = await cjRequest(
      {
        url: 'api/cart/add',
        method: 'post',
        data
      },
      2
    )
    return res
  },
  async minus(data) {
    const res = await cjRequest(
      {
        url: 'api/cart/minus',
        method: 'post',
        data
      },
      2
    )
    return res
  },
  async cartList(userId) {
    const res = await cjRequest(
      {
        url: 'api/cart/index?userId=' + userId,
        method: 'get'
      },
      2
    )
    return res
  },
  async deleteCart(data) {
    const res = await cjRequest(
      {
        url: 'api/cart/delete',
        method: 'post',
        data
      },
      2
    )
    return res
  },
  // 提交订单前检查
  async buyAddApi({ goodsId, productId, number, userId }) {
    const res = await cjRequest(
      {
        url: 'api/buy/add',
        method: 'post',
        data: {
          goodsId,
          productId,
          number,
          userId
        }
      },
      2
    )
    return res?.data || {}
  },
  //   申请退款
  async applyRefundApi(data) {
    const res = await cjRequest(
      {
        url: 'api/order/applyRefund', // !! 这个接口还没有实现
        method: 'post',
        data
      },
      2
    )
    return res?.data || {}
  },
  // 获取数据
  async getRowDataApi({ merOrderId, userId }) {
    const res = await cjRequest(
      {
        url: 'getRowData',
        method: 'get',
        data: {
          merOrderId,
          userId
        }
      },
      2
    )
    return res?.data || {}
  },
  // 开处方
  async createPrescription({ params, medicines }) {
    const res = await cjRequest(
      {
        url: 'api/dierzhongyiyuan/prescription/getPrescriptionFile',
        method: 'post',
        data: {
          params,
          medicines
        }
      },
      2,
      true
    )
    return res?.data || {}
  }
}
export default shop
