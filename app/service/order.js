'use strict'

const Service = require('egg').Service

class OrderService extends Service {
  async createOrder(buyer, data) {
    const { ctx, service } = this
    const order = new ctx.model.Order(data)
    const goodsIdList = data.goods_list.map(el => el.goods)
    try {
      await service.goods.updateManyGoodsStatus(goodsIdList, 2)
      const { _id } = await order.save()
      return { code: 2000, msg: '成功创建订单', data: { order_id: _id } }
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }

  geteOrdersByUser(_id) {
    return this.ctx.model.Order
      .find({ buyer: _id }, 'goods_list created_at')
      .populate({
        path: 'goods_list.goods',
        select: 'img_list name price',
        populate: { path: 'seller', select: 'nickname' },
      })
      .then(list => {
        return { code: 2000, msg: '查询用户所有的订单', data: { list } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  geteOrderDetail(_id) {
    return this.ctx.model.Order
      .findOne({ _id })
      .populate('buyer', 'nickname real_name phone')
      .populate({
        path: 'goods_list.goods',
        select: 'img_list name price',
        populate: { path: 'seller', select: 'nickname' },
      })
      .then(order_detail => {
        return { code: 2000, msg: '查询订单详情', data: { order_detail } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
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
