'use strict'

const Service = require('egg').Service

class GoodsService extends Service {
  async getGoodsList(data) {
    const page = Number(data.page)
    const pageSize = Number(data.pageSize)
    const [ total, goods_list ] = await Promise.all([
      this.ctx.model.Goods.find().count(),
      this.ctx.model.Goods
        .find({}, 'name category created_at')
        .skip((page - 1) * pageSize)
        .limit(pageSize),
    ])
    const pagination = {
      page,
      pageSize,
      total,
    }
    return { code: 2000, msg: '查询商品列表', data: { goods_list, pagination } }
  }
}

module.exports = GoodsService
