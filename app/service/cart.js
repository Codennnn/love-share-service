'use strict'

const Service = require('egg').Service

class CartService extends Service {
  addCartItem(_id, goods_id) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        {
          $addToSet: { carts: goods_id },
        },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功添加一个购物车商品' }
        }
        return { code: 3000, msg: '没有添加任何购物车商品' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  removeCartItem(_id, goods_id) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        {
          $pull: { carts: goods_id },
        }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功删除一个购物车商品' }
        }
        return { code: 3000, msg: '没有删除任何购物车商品' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async getCartList(_id) {
    return this.ctx.model.User
      .findOne({ _id })
      .populate({
        path: 'carts',
        select: 'img_list goods_num name quantity delivery price time',
        populate: { path: 'seller', select: 'nickname real_name' },
      })
      .then(({ carts: cart_list }) => {
        return { code: 2000, data: { cart_list }, msg: '获取购物车列表' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }
}

module.exports = CartService
