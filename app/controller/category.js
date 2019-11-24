'use strict'

const Controller = require('egg').Controller

class CategoryController extends Controller {
  /* GET
   * 获取商品分类
   */
  async getCategoryList() {
    const { ctx, service } = this
    const res = await service.category.getCategoryList()

    ctx.body = res
    ctx.status = 200
  }

  /* POST
   * 添加商品分类
   */
  async addCategory() {
    const { ctx, service } = this

    try {
      ctx.validate({ name: 'string' })
      const res = await service.category.addCategory(ctx.request.body.name)
      ctx.body = res
      ctx.status = 200
    } catch (err) {
      ctx.body = err
      ctx.status = 400
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
      ctx.body = res
      ctx.status = 200
    } catch (err) {
      ctx.body = err
      ctx.status = 400
    }
  }
}

module.exports = CategoryController
