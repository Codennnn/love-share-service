'use strict'

const Controller = require('egg').Controller

class CartController extends Controller {
  /* POST
   * 添加购物车
   */
  async addCartItem() {
    const { ctx, service } = this

    try {
      ctx.validate({ goods_id: 'string' })
      const res = await service.cart.addCartItem(ctx.state.user.id, ctx.request.body.goods_id)
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
      ctx.validate({ goods_id: 'string' })
      const res = await service.cart.removeCartItem(ctx.state.user.id, ctx.request.body.goods_id)
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

    try {
      ctx.validate({
        page: 'int',
        page_size: 'int',
      }, ctx.request.query)
      const res = await service.cart.getCartList(ctx.state.user.id, ctx.request.query)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = CartController
