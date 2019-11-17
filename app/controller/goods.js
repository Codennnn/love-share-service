'use strict'

const Controller = require('egg').Controller

class GoodsController extends Controller {
  /* GET
   * 获取商品列表
   */
  async getGoodsList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.goods.getGoodsList(data)

    ctx.body = res
    ctx.status = 200
  }
}

module.exports = GoodsController
