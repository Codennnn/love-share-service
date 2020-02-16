'use strict'

const Service = require('egg').Service

class OrderService extends Service {
  async createOrder(buyer, data) {
    data.buyer = buyer
    const { ctx, service } = this
    const goodsIdList = data.goods_list.map(el => el.goods)
    const sellerIdList = [
      ...new Set(data.goods_list.map(el => el.seller)),
    ]
    const goodsListFilter = sellerId => {
      return data.goods_list.filter(li => li.seller === sellerId)
    }
    const totalPrice = sellerId => goodsListFilter(sellerId)
      .reduce(
        (acc, curr) => acc + curr.price * curr.amount,
        0
      )
    const deliveryCharge = sellerId => goodsListFilter(sellerId)
      .reduce(
        (acc, curr) => acc + curr.delivery_charge,
        0
      )
    const sub_order = sellerIdList.map(el => ({
      goods_list: goodsListFilter(el),
      total_price: totalPrice(el),
      actual_price: totalPrice(el),
      delivery_charge: deliveryCharge(el),
    }))

    if (sellerIdList.length === 1) {
      Object.assign(data, { sub_order })
    } else {
      const split_info = {
        is_split: Boolean(),
        reason: '商品属于不同卖家，订单被拆分为多个子订单分开配送',
      }
      Object.assign(data, { sub_order, split_info })
    }

    try {
      // 更新商品信息
      await service.goods.updateManyGoods({
        goods_id_list: goodsIdList,
        buyer,
        status: 2,
        sell_time: Date.now(),
      })

      // 更新用户已购买的商品信息
      await Promise.all(goodsIdList.map(goods_id => {
        return ctx.model.User.updateOne(
          { _id: buyer },
          {
            $push: {
              bought_goods: { $each: [goods_id], $position: 0 },
            },
          },
          { runValidators: true }
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

      // 创建订单
      const order = new ctx.model.Order(data)
      const { _id: order_id } = await order.save()

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

  async completedOrder(_id, { order_id, sub_id, goods_id_list }) {
    console.log(order_id, sub_id, goods_id_list)
    const { ctx, service } = this
    try {
      await Promise.all([
        service.goods.updateManyGoods({
          goods_id_list,
          status: 4,
        }),
        ctx.model.Order.updateOne(
          { _id: order_id, 'sub_order._id': sub_id },
          {
            $set: {
              'sub_order.$.status': 2,
            },
          },
          { runValidators: true }
        ),
        service.user.updateCreditValue(_id, 10),
        service.user.updateShareValue(_id, 10),
      ])
      return { code: 2000, msg: '成功取消订单' }
    } catch (err) {
      return { code: 5000, msg: '取消订单失败', err }
    }
  }

  async cancelOrder(_id, { order_id, sub_id, goods_id_list, seller_id }) {
    const { ctx, service } = this
    try {
      await Promise.all([
        service.goods.updateManyGoods({
          goods_id_list,
          status: 1,
        }),
        ctx.model.Order.updateOne(
          { _id: order_id, 'sub_order._id': sub_id },
          {
            $set: {
              'sub_order.$.status': 4,
            },
          },
          { runValidators: true }
        ),
        ctx.model.User.updateOne(
          { _id },
          {
            $pull: { bought_goods: { $in: goods_id_list } },
          }
        ),
      ])
      service.notice.addNotice(seller_id, {
        title: '订单取消',
        content: `您有一个编号为：${order_id} 的订单被取消！`,
        type: 4,
      })
      return { code: 2000, msg: '成功取消订单' }
    } catch (err) {
      return { code: 5000, msg: '取消订单失败', err }
    }
  }

  geteOrdersByUser(_id) {
    return this.ctx.model.Order
      .find({ buyer: _id }, 'address payment total_price status sub_order split_info created_at updated_at')
      .populate({
        path: 'sub_order.goods_list.goods',
        select: 'img_list name price delivery delivery_charge status',
        populate: { path: 'seller', select: 'nickname' },
      })
      .sort({ created_at: -1 })
      .then(order_list => {
        return {
          code: 2000,
          msg: '查询用户所有的订单',
          data: { order_list },
        }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async geteOrderDetail({ order_id, sub_id }) {
    return this.ctx.model.Order
      .findOne({ _id: order_id })
      .populate('buyer', 'nickname real_name phone')
      .populate({
        path: 'sub_order.goods_list.goods',
        select: 'img_list name price delivery delivery_charge sell_time review',
        populate: { path: 'seller', select: 'nickname' },
      })
      .then(res => {
        const [sub_order] = res.sub_order.filter(
          el => String(el._id) === sub_id
        )
        const order_detail = Object.assign(
          {},
          { ...res._doc },
          { sub_order }
        )
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
          path: 'sub_order.goods_list.goods',
          populate: { path: 'buyer', select: 'nickname' },
        })
        .populate({
          path: 'sub_order.goods_list.goods',
          select: 'name price status created_at updated_at',
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
          path: 'sub_order.goods_list.goods',
          populate: { path: 'buyer', select: 'nickname' },
        })
        .populate({
          path: 'sub_order.goods_list.goods',
          select: 'name price status created_at updated_at',
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
