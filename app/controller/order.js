'use strict'

const Controller = require('egg').Controller

class OrderController extends Controller {
  /* POST
   * 创建订单
   */
  async createOrder() {
    const { ctx, service } = this
    const res = await service.school.createOrder(ctx.request.body.name)
    ctx.reply(res)
  }

  /* GET
   * 获取订单详情
   */
  async geteOrderDetail() {
    const { ctx, service } = this
    const res = await service.school.geteOrderDetail(ctx.request.body.name)
    ctx.reply(res)
  }

  /* GET
   * 获取订单列表
   */
  async getOrderList() {
    const { ctx, service } = this
    const res = await service.school.getOrderList(ctx.request.body.name)
    ctx.reply(res)
  }
}

module.exports = OrderController
