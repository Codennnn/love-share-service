'use strict'

const Controller = require('egg').Controller

class BillboardController extends Controller {
  /* GET
   * 获取广告图片列表
   */
  async getBillboardList() {
    const { ctx, service } = this
    const res = await service.billboard.getBillboardList()
    ctx.reply(res)
  }

  /* POST
   * 上传广告图片
   */
  async uploadBillboard() {
    const { ctx, service } = this
    const parts = ctx.multipart()
    const res = await service.billboard.uploadBillboard(parts)
    ctx.reply(res)
  }

  /* DELETE
   * 删除广告牌
   */
  async deleteBillboard() {
    const { ctx, service } = this
    ctx.validate({ _id: 'string', url: 'string' })
    const res = await service.billboard.deleteBillboard(ctx.request.body)
    ctx.reply(res)
  }

  /* PUT
   * 更新广告牌
   */
  async updateBillboard() {
    const { ctx, service } = this
    ctx.validate({ type: [1, 2, 3], link: 'string?' })
    const res = await service.billboard.updateBillboard(ctx.request.body)
    ctx.reply(res)
  }
}

module.exports = BillboardController
