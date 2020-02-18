'use strict'

const Controller = require('egg').Controller

class OrderController extends Controller {
  constructor(ctx) {
    super(ctx)
    if (ctx.state && ctx.state.user) {
      this._id = ctx.state.user.id
    }
  }

  /* POST
   * 创建订单
   */
  async createOrder() {
    const { ctx, service, _id } = this
    const data = ctx.request.body
    ctx.validate({
      goods_list: { type: 'array', itemType: 'object' },
      payment: 'string',
      address: 'object',
      total_price: 'number',
      actual_price: 'number',
    })
    const res = await service.order.createOrder(_id, data)
    ctx.reply(res)
  }

  /* DELETE
   * 删除订单
   */
  async deleteOrder() {
    const { ctx, service } = this
    ctx.validate({ order_id: 'string' })
    const res = await service.order.deleteOrder(ctx.request.body.order_id)
    ctx.reply(res)
  }

  /* PUT
   * 完成订单
   */
  async completedOrder() {
    const { ctx, service, _id } = this
    ctx.validate({
      order_id: 'string',
      sub_id: 'string',
      goods_id_list: { type: 'array', itemType: 'string' },
    })
    const res = await service.order.completedOrder(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* PUT
   * 取消订单
   */
  async cancelOrder() {
    const { ctx, service, _id } = this
    ctx.validate({
      order_id: 'string',
      sub_id: 'string',
      goods_id_list: { type: 'array', itemType: 'string' },
      seller_id: 'string',
    })
    const res = await service.order.cancelOrder(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 获取订单详情
   */
  async geteOrderDetail() {
    const { ctx, service } = this
    ctx.validate({ order_id: 'string', sub_id: 'string' }, ctx.query)
    const res = await service.order.geteOrderDetail(ctx.query)
    ctx.reply(res)
  }

  /* GET
   * 获取订单详情
   */
  async getOrderId() {
    const { ctx, service } = this
    ctx.validate({ buyer: 'string', goods_id: 'string' }, ctx.query)
    const res = await service.order.getOrderId(ctx.query)
    ctx.reply(res)
  }

  /* GET
   * 获取订单详情
   */
  async geteOrdersByUser() {
    const { ctx, service, _id } = this
    const res = await service.order.geteOrdersByUser(_id)
    ctx.reply(res)
  }

  /* GET
   * 获取订单列表
   */
  async getOrderList() {
    const { ctx, service } = this
    ctx.validate({
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
    }, ctx.query)
    const res = await service.order.getOrderList(ctx.query)
    ctx.reply(res)
  }

  /* GET
   * 根据日期范围获取订单列表
   */
  async getOrderListByDateRange() {
    const { ctx, service } = this
    const { date_range, page, page_size } = ctx.queries
    const queries = Object.assign({}, { date_range, page: page[0], page_size: page_size[0] })
    ctx.validate({
      date_range: 'array',
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
    }, queries)
    const res = await service.order.getOrderListByDateRange(queries)
    ctx.reply(res)
  }

  /* GET
   * 获取订单交易量
   */
  async getOrderTransaction() {
    const { ctx, service } = this
    const res = await service.order.getOrderTransaction()
    ctx.reply(res)
  }

  /* GET
   * 获取订单成交量
   */
  async getOrderVolume() {
    const { ctx, service } = this
    const res = await service.order.getOrderVolume()
    ctx.reply(res)
  }

  /* GET
   * 获取订单数量
   */
  async getOrderNum() {
    const { ctx, service } = this
    const res = await service.order.getOrderNum()
    ctx.reply(res)
  }
}

module.exports = OrderController
