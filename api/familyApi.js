import { cjRequest } from '@/utils/service.js'

const family = {
  // 查询
  async getMemberListApi(params) {
    const url = `member/list?ownerUserId=${params.ownerUserId}`
    const res = await cjRequest(
      {
        url: url,
        method: 'get'
      },
      2
    )
    return res?.data || {}
  },

  // 新增家庭成员
  async addMemberApi(params) {
    const url = `member/create`
    const res = await cjRequest(
      {
        url: url,
        method: 'post',
        data: params
      },
      2
    )
    return res?.data || {}
  },

  // 设置默认就诊人
  async setDefaultMemberApi(params) {
    const url = `member/setDefault/${params.familyId}/${params.ownerUserId}`
    const res = await cjRequest(
      {
        url: url,
        method: 'post',
        data: params
      },
      2
    )
    return res?.data || {}
  },

  // 查询默认就诊人
  async getDefaultPatientApi(params) {
    const url = `getDefautlPatient?userId=${params.ownerUserId}`
    const res = await cjRequest(
      {
        url: url,
        method: 'get'
      },
      2
    )
    return res?.data || {}
  },

  // 删除某一就诊人
  async deleteMemberApi(params) {
    const url = `member/delete/${params.familyId}/${params.ownerUserId}`
    const res = await cjRequest(
      {
        url: url,
        method: 'delete',
        data: params
      },
      2
    )
    return res?.data || {}
  }
}

export default family
