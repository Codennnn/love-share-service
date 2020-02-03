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
    try {
      ctx.validate({
        goods_list: 'array',
        payment: 'string',
        address: 'object',
        total_price: 'number',
        actual_price: 'number',
      })
      const res = await service.order.createOrder(id, data)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 删除订单
   */
  async deleteOrder() {
    const { ctx, service } = this
    try {
      ctx.validate({ order_id: 'string' })
      const res = await service.order.deleteOrder(ctx.request.body.order_id)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 取消订单
   */
  async cancelOrder() {
    const { ctx, service } = this
    try {
      ctx.validate({ goods_id: 'string' })
      const id = ctx.state.user.id
      const res = await service.order.cancelOrder(id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取订单详情
   */
  async geteOrderDetail() {
    const { ctx, service } = this
    try {
      ctx.validate({ order_id: 'string' }, ctx.query)
      const res = await service.order.geteOrderDetail(ctx.query.order_id)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取订单详情
   */
  async geteOrdersByUser() {
    const { ctx, service } = this
    const res = await service.order.geteOrdersByUser(ctx.state.user.id)
    ctx.reply(res)
  }

  /* GET
   * 获取订单列表
   */
  async getOrderList() {
    const { ctx, service } = this
    try {
      ctx.validate({
        page: { type: 'int', min: 1 },
        page_size: { type: 'int', min: 1 },
      }, ctx.query)
      const res = await service.order.getOrderList(ctx.query)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 根据日期范围获取订单列表
   */
  async getOrderListByDateRange() {
    const { ctx, service } = this
    try {
      const { date_range, page, page_size } = ctx.queries
      const queries = Object.assign({}, { date_range, page: page[0], page_size: page_size[0] })
      ctx.validate({
        date_range: 'array',
        page: { type: 'int', min: 1 },
        page_size: { type: 'int', min: 1 },
      }, queries)
      const res = await service.order.getOrderListByDateRange(queries)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取订单交易量
   */
  async getOrderTransaction() {
    const { ctx, service } = this
    try {
      const res = await service.order.getOrderTransaction()
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取订单成交量
   */
  async getOrderVolume() {
    const { ctx, service } = this
    try {
      const res = await service.order.getOrderVolume()
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取订单数量
   */
  async getOrderNum() {
    const { ctx, service } = this
    try {
      const res = await service.order.getOrderNum()
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = OrderController
