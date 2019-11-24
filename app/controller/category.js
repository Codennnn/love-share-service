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
    const { app, ctx, service } = this

    const errors = app.validator.validate(
      { name: 'string' },
      ctx.request.body
    )

    if (errors) {
      ctx.body = errors
      ctx.status = 400
    } else {
      const res = await service.category.addCategory(ctx.request.body.name)
      ctx.body = res
      ctx.status = 200
    }
  }

  /* DELETE
   * 删除商品分类
   */
  async deleteCategory() {
    const { app, ctx, service } = this

    const errors = app.validator.validate(
      { name: 'string' },
      ctx.request.body
    )

    if (errors) {
      ctx.body = errors
      ctx.status = 400
    } else {
      const res = await service.category.deleteCategory(ctx.request.body.name)
      ctx.body = res
      ctx.status = 200
    }
  }
}

module.exports = CategoryController
