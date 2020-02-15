'use strict'

const Controller = require('egg').Controller

class LogController extends Controller {
  /* GET
   * 获取日志列表
   */
  async getLogList() {
    const { ctx, service } = this
    const res = await service.log.getLogList(ctx.query)
    ctx.reply(res)
  }

  /* POST
   * 添加日志
   */
  async addLog() {
    const { ctx, service } = this
    ctx.validate({
      err: 'object',
      detail: 'object',
      info: 'string',
    })
    const res = await service.log.addLog(ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 删除日志
   */
  async deleteLog() {
    const { ctx, service } = this
    ctx.validate({ log_id_list: 'array' })
    const res = await service.log.deleteLog(ctx.request.body)
    ctx.reply(res)
  }
}

module.exports = LogController
