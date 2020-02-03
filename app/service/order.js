'use strict'

const Service = require('egg').Service

class OrderService extends Service {
  async createOrder(buyer, data) {
    data.buyer = buyer
    const { ctx, service } = this
    const goodsIdList = data.goods_list.map(el => el.goods)
    try {
      const order = new ctx.model.Order(data)
      const { _id: order_id } = await order.save()
      // 更新商品信息
      await service.goods.updateManyGoods({
        goods_id_list: goodsIdList,
        buyer,
        status: 2,
        sell_time: Date.now(),
      })

      // 更新用户已购买的商品信息
      await Promise.all(data.goods_list.map(el => {
        return ctx.model.User.updateOne(
          { buyer },
          {
            $push: {
              bought_goods: { $each: [el._id], $position: 0 },
            },
          }
        )
      }))

      // 通知卖家
      await Promise.all(data.goods_list.map(el => {
        const notice = {
          title: '您有一件闲置被买走啦',
          content: `您发布的闲置物品 <b>${el.name}</b> 被人拍走啦~`,
          type: 2,
        }
        return service.notice.addNotice(el.seller, notice)
      }))

      // 更新用户乐享信用值和乐享值
      await Promise.all([
        service.user.updateCreditValue(buyer, 10),
        service.user.updateShareValue(buyer, 10),
      ])

      return { code: 2000, msg: '成功创建订单', data: { order_id } }
    } catch (err) {
      await service.goods.updateManyGoods({
        goods_id_list: goodsIdList,
        buyer: null,
        status: 1,
        sell_time: null,
      })
      return { code: 5000, msg: err.message }
    }
  }

  deleteOrder(_id) {
    return this.ctx.model.Order
      .deleteOne({ _id })
      .then(({ deletedCount }) => {
        if (deletedCount === 1) {
          return { code: 2000, msg: '删除了一个订单' }
        }
        return { code: 3000, msg: '无任何订单被删除' }
      })
  }

  geteOrdersByUser(_id) {
    return this.ctx.model.Order
      .find({ buyer: _id }, 'goods_list created_at')
      .populate({
        path: 'goods_list.goods',
        select: 'img_list name price status',
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
        select: 'img_list name price sell_time',
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
    const [total, order_list] = await Promise.all([
      this.ctx.model.Order.estimatedDocumentCount(),
      this.ctx.model.Order
        .find({})
        .populate({
          path: 'goods_list.goods',
          select: 'name price status created_at updated_at',
          populate: { path: 'buyer', select: 'nickname' },
        })
        .populate({
          path: 'goods_list.goods',
          populate: { path: 'seller', select: 'nickname' },
        })
        .sort({ created_at: -1 })
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

  async getOrderListByDateRange({ date_range, page, page_size: pageSize }) {
    const [total, order_list] = await Promise.all([
      this.ctx.model.Order.countDocuments({
        created_at: {
          $gte: new Date(`${date_range[0]} 00:00:00`),
          $lte: new Date(`${date_range[1]} 23:59:59`),
        },
      }),
      this.ctx.model.Order
        .find({
          created_at: {
            $gte: new Date(`${date_range[0]} 00:00:00`),
            $lte: new Date(`${date_range[1]} 23:59:59`),
          },
        })
        .populate({
          path: 'goods_list.goods',
          select: 'name price status created_at updated_at',
          populate: { path: 'buyer', select: 'nickname' },
        })
        .populate({
          path: 'goods_list.goods',
          populate: { path: 'seller', select: 'nickname' },
        })
        .sort({ created_at: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
    ])
    const pagination = {
      page,
      pageSize,
      total,
    }
    return { code: 2000, msg: '根据日期范围查询订单', data: { order_list, pagination } }
  }

  getOrderTransaction() {
    return {
      code: 2000, msg: '查询订单详情', data: {
        name: '交易额',
        data: [28, 40, 36, 52, 38, 60, 55],
      },
    }
  }

  getOrderVolume() {
    return {
      code: 2000, msg: '查询订单详情', data: {
        name: '成交量',
        data: [10, 15, 8, 15, 7, 12, 8],
      },
    }
  }

  getOrderNum() {
    return {
      code: 2000, msg: '查询订单详情', data: {
        name: '订单数',
        data: [55, 68, 44, 52, 38, 60, 55],
      },
    }
  }
}

module.exports = OrderService
