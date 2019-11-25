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
    ctx.reply(res)
  }

  /* POST
   * 图片上传
   */
  async uploadImg() {
    const { ctx, service } = this
    const id = ctx.state.user.id
    const files = ctx.request.files
    const res = await service.goods.uploadImg(id, files)
    ctx.reply(res)
  }

  /* DELETE
   * 删除已上传的图片
   */
  async deleteImg() {
    const { ctx, service } = this

    try {
      ctx.validate({ img_list: 'array', img_with_id: 'boolean?' })
      const { img_list, img_with_id = true } = ctx.request.body
      if (!img_with_id) {
        const id = ctx.state.user.id
        // 逐张图片名加上用户的 ID
        img_list.forEach((it, i, _this) => {
          _this[i] = `${id}-${it}`
        })
      }
      const res = await service.goods.deleteImg(img_list)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = GoodsController
