'use strict'

const Service = require('egg').Service

class SchoolService extends Service {
  getBeggingList({ page, page_size: pageSize }) {
    return this.ctx.model.Begging
      .find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('announcer', 'avatar_url nickname')
      .populate('category', 'name')
      .then(begging_list => {
        return { code: 2000, msg: '获取求购列表', data: { begging_list } }
      })
  }

  async addBegging(_id, data) {
    data.announcer = _id
    try {
      const begging = new this.ctx.model.Begging(data)
      await begging.save()
      return { code: 2000, msg: '成功添加一条求购信息' }
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }
}

module.exports = SchoolService
