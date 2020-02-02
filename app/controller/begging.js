'use strict'

const Controller = require('egg').Controller

class BeggingController extends Controller {
  /* GET
   * 获取求购列表
   */
  async getBeggingList() {
    const { ctx, service } = this
    try {
      ctx.validate({
        page: { type: 'int', min: 1 },
        page_size: { type: 'int', min: 1 },
      }, ctx.query)
      const res = await service.begging.getBeggingList(ctx.query)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取求购列表
   */
  async addBegging() {
    const { ctx, service } = this
    try {
      ctx.validate({
        name: { type: 'string', maxlength: 20 },
        description: { type: 'string', maxlength: 150 },
        category: 'array',
        min_price: 'number',
        max_price: 'number',
      })
      const res = await service.begging.addBegging(
        ctx.state.user.id,
        ctx.request.body
      )
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = BeggingController
