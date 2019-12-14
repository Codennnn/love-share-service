'use strict'

const Controller = require('egg').Controller

class OrderController extends Controller {
  /* POST
   * 创建订单
   */
  async createOrder() {
    const { ctx, service } = this
    const id = ctx.state.user.id
    const data = ctx.request.body
    const res = await service.order.createOrder(id, data)
    ctx.reply(res)
  }

  /* GET
   * 获取订单详情
   */
  async geteOrderDetail() {
    const { ctx, service } = this
    const res = await service.order.geteOrderDetail(ctx.request.body.name)
    ctx.reply(res)
  }

  /* GET
   * 获取订单列表
   */
  async getOrderList() {
    const { ctx, service } = this
    try {
      ctx.validate({
        page: 'int',
        page_size: 'int',
      }, ctx.request.query)
      const res = await service.order.getOrderList(ctx.request.query)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = OrderController
