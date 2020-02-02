'use strict'

const Controller = require('egg').Controller

class CategoryController extends Controller {
  /* GET
   * 获取商品分类
   */
  async getCategoryList() {
    const { ctx, service } = this
    const res = await service.category.getCategoryList()
    ctx.reply(res)
  }

  /* POST
   * 添加商品分类
   */
  async addCategory() {
    const { ctx, service } = this

    try {
      ctx.validate({ category_name: 'string' })
      const res = await service.category.addCategory(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 删除商品分类
   */
  async deleteCategory() {
    const { ctx, service } = this

    try {
      ctx.validate({ name: 'string' })
      const res = await service.category.deleteCategory(ctx.request.body.name)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 更新商品分类的激活状态
   */
  async updateCategoryActivation() {
    const { ctx, service } = this

    try {
      ctx.validate({ category_id_list: { type: 'array', itemType: 'string' } })
      const res = await service.category.updateCategoryActivation(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = CategoryController
