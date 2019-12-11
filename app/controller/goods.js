'use strict'

const Controller = require('egg').Controller

class GoodsController extends Controller {
  /* GET
   * 创建商品
   */
  async createGoods() {
    const { ctx, service } = this

    try {
      ctx.validate({
        img_list: { type: 'array', itemType: 'string' },
        price: 'number',
        original_price: 'number',
        quantity: 'number',
        delivery: 'string',
        description: { type: 'string', max: 400, required: false },
        can_bargain: 'boolean',
        can_return: 'boolean',
      })
      const res = await service.goods.createGoods(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 创建商品
   */
  async deleteGoods() {
    const { ctx, service } = this

    try {
      ctx.validate({ goods_id: 'string' })
      const res = await service.goods.deleteGoods(ctx.request.body.goods_id)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取推荐商品列表
   */
  async getRecommendGoodsList() {
    const { ctx, service } = this
    try {
      ctx.validate({
        page: 'int',
        page_size: 'int',
      }, ctx.request.query)
      const res = await service.goods.getRecommendGoodsList(ctx.state.user.id, ctx.request.query)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取商品列表
   */
  async getGoodsList() {
    const { ctx, service } = this

    try {
      ctx.validate({
        page: 'int',
        page_size: 'int',
      }, ctx.request.query)
      const res = await service.goods.getGoodsList(ctx.request.query)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取商品详情
   */
  async getGoodsDetail() {
    const { ctx, service } = this

    try {
      ctx.validate({ goods_id: 'string' }, ctx.request.query)
      const res = await service.goods.getGoodsDetail(ctx.request.query.goods_id)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* POST
   * 图片上传
   */
  async uploadImg() {
    const { ctx, service } = this
    const id = ctx.state.user.id
    const parts = ctx.multipart()
    const res = await service.goods.uploadImg(id, parts)
    ctx.reply(res)
  }

  /* DELETE
   * 删除已上传的图片
   */
  async deleteImg() {
    const { ctx, service } = this

    try {
      ctx.validate({ img_list: 'array' })
      const res = await service.goods.deleteImg(ctx.request.body.img_list)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = GoodsController
