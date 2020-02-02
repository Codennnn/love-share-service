'use strict'

const Service = require('egg').Service

class CategoryService extends Service {
  getCategoryList() {
    return this.ctx.model.Category
      .find({})
      .then(category_list => {
        return { code: 2000, msg: '获取商品分类列表', data: { category_list } }
      })
  }

  async addCategory({ category_name: name }) {
    try {
      const category = new this.ctx.model.Category({ name })
      await category.save()
      return { code: 2000, msg: '成功添加分类' }
    } catch (err) {
      if (err.message.includes('duplicate key')) {
        return { code: 4003, msg: '不能重复添加分类' }
      }
      return { code: 5000, msg: err.message }
    }
  }

  deleteCategory({ category_id_list }) {
    return this.ctx.model.Category
      .deleteMany({ _id: { $in: category_id_list } })
      .then(({ ok }) => {
        if (ok) {
          return { code: 2000, msg: '成功删除分类' }
        }
      })
  }

  updateCategoryActivation({ category_id_list, activation }) {
    return this.ctx.model.Category
      .updateMany(
        { _id: { $in: category_id_list } },
        { activation }
      )
      .then(({ ok }) => {
        if (ok) {
          return { code: 2000, msg: '成功更新分类激活状态' }
        }
      })
  }
}

module.exports = CategoryService
