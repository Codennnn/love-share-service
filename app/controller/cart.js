'use strict'

const Controller = require('egg').Controller

class CartController extends Controller {
  /* POST
   * 添加购物车
   */
  async addCartItem() {
    const { ctx, service } = this

    try {
      ctx.validate({ amount: 'int', goods_id: 'string' })
      const res = await service.cart.addCartItem(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 移出购物车
   */
  async removeCartItem() {
    const { ctx, service } = this

    try {
      ctx.validate({ cart_id: 'string' })
      const res = await service.cart.removeCartItem(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 清空购物车
   */
  async clearCartList() {
    const { ctx, service } = this

    try {
      ctx.validate({ cart_id_list: 'array' })
      const id = ctx.state.user.id
      const { cart_id_list } = ctx.request.body
      const res = await service.cart.clearCartList(id, cart_id_list)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取购物车列表
   */
  async getCartList() {
    const { ctx, service } = this
    const res = await service.cart.getCartList(ctx.state.user.id, ctx.request.query)
    ctx.reply(res)
  }
}

module.exports = CartController
