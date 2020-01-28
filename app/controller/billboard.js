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
   * 删除广告图片
   */
  async deleteBillboard() {
    const { ctx, service } = this
    try {
      ctx.validate({ url: 'string' })
      const res = await service.billboard.deleteBillboard(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = BillboardController
