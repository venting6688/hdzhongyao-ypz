import { cjRequest } from '@/utils/service.js'

//查询
const shop = {
  async createOrderApi(params) {
    const url = `api/sf/createOrder`
    const res = await cjRequest(
      {
        url: url,
        method: 'post',
        data: params
      },
      2,
      false,
      true
    )
    return res?.data || {}
  },
  // 0 -> 系统内部订单号，1 -> 顺丰运单号+电话
  async getLogisticsInfoApi(type = 0, merchantOrderNo) {
    const url = `api/sf/queryRoute/${type}/${merchantOrderNo}`
    const res = await cjRequest(
      {
        url: url,
        method: 'get'
      },
      2,
      false,
      true
    )
    return res?.data || {}
  },
  async queryFreightApi(params) {
    const url = `api/sf/queryFreight`
    const res = await cjRequest(
      {
        url: url,
        method: 'post',
        data: params
      },
      2,
      false,
      true
    )
    return res?.data || {}
  },
  async querySfWaybillApi(merchantOrderNo) {
    const url = `api/sf/querySfWaybill?merchantOrderNo=${merchantOrderNo}`
    const res = await cjRequest(
      {
        url: url,
        method: 'get',
      },
      2,
      false,
      true
    )
    return res?.data || {}
  },
  // 获取医院发货地址
  async getShippingAddressApi(params) {
    const url = `api/shipping/list`
    const res = await cjRequest(
      {
        url: url,
        method: 'get',
        params: params
      },
      2,
      false,
      true
    )
    return res?.data || {}
  }
}
export default shop
