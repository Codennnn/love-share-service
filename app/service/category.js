'use strict'

const Service = require('egg').Service

class CategoryService extends Service {
  async getCategoryList() {
    const category_list = []
    return { code: 2000, msg: '获取商品分类列表', data: { category_list } }
  }
}

module.exports = CategoryService
