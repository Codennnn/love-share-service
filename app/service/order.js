'use strict'

const Service = require('egg').Service

class OrderService extends Service {
  async createOrder(buyer, { goods_list }) {
    const order = new this.ctx.model.Order({
      goods_list,
      buyer,
    })

    try {
      const res = await order.save()
      console.log(res)
      return { code: 2000, msg: '成功创建订单' }
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }

  async getOrderList({ page, page_size: pageSize }) {
    const [ total, order_list ] = await Promise.all([
      this.ctx.model.Order.estimatedDocumentCount(),
      this.ctx.model.Order
        .find({})
        .skip((page - 1) * pageSize)
        .limit(pageSize),
    ])
    const pagination = {
      page,
      pageSize,
      total,
    }
    return { code: 2000, msg: '查询订单列表', data: { order_list, pagination } }
  }
}

module.exports = OrderService
