'use strict'

const Service = require('egg').Service

class CategoryService extends Service {
  getCategoryList() {
    const res = this.ctx.model.Category
      .find({}, '_id name')
      .then(category_list => {
        return { code: 2000, msg: '获取商品分类列表', data: { category_list } }
      })
    return res
  }

  async addCategory(name) {
    try {
      const category = new this.ctx.model.Category({ name })
      await category.save()
      return { code: 2001, msg: '成功添加分类' }
    } catch (err) {
      if (err.message.includes('duplicate key')) {
        return { code: 4003, msg: '不能重复添加分类' }
      }
      return { code: 5000, msg: err.message }
    }
  }

  deleteCategory(name) {
    const res = this.ctx.model.Category
      .deleteOne({ name })
      .then(({ deletedCount }) => {
        if (deletedCount === 1) {
          return { code: 2000, msg: '删除了一个分类' }
        }
        return { code: 3000, msg: '无任何分类被删除' }
      })
    return res
  }
}

module.exports = CategoryService
