'use strict'

const Controller = require('egg').Controller

class CartController extends Controller {
  constructor(ctx) {
    super(ctx)
    if (ctx.state && ctx.state.user) {
      this._id = ctx.state.user.id
    }
  }

  /* POST
   * 添加购物车
   */
  async addCartItem() {
    const { ctx, service, _id } = this
    ctx.validate({ amount: 'int', goods_id: 'string' })
    const res = await service.cart.addCartItem(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 移出购物车
   */
  async removeCartItem() {
    const { ctx, service, _id } = this
    ctx.validate({ cart_id: 'string' })
    const res = await service.cart.removeCartItem(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 清空购物车
   */
  async clearCartList() {
    const { ctx, service, _id } = this
    ctx.validate({ cart_id_list: 'array' })
    const { cart_id_list } = ctx.request.body
    const res = await service.cart.clearCartList(_id, cart_id_list)
    ctx.reply(res)
  }

  /* GET
   * 获取购物车列表
   */
  async getCartList() {
    const { ctx, service, _id } = this
    const res = await service.cart.getCartList(_id, ctx.query)
    ctx.reply(res)
  }
}

module.exports = CartController
