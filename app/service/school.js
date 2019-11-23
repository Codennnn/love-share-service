'use strict'

const Service = require('egg').Service

class SchoolService extends Service {
  getSchoolList() {
    const res = this.ctx.model.School
      .find({}, '_id name')
      .then(school_list => {
        return { code: 2000, msg: '获取学校列表', data: { school_list } }
      })
    return res
  }

  async addSchool(name) {
    try {
      const school = new this.ctx.model.School({ name })
      await school.save()
      return { code: 2001, msg: '成功添加学校' }
    } catch (err) {
      if (err.message.includes('duplicate key')) {
        return { code: 4003, msg: '不能重复添加学校' }
      }
      return { code: 5000, msg: err.message }
    }
  }

  deleteSchool(name) {
    const res = this.ctx.model.School
      .deleteOne({ name })
      .then(res => {
        if (res.deletedCount === 1) {
          return { code: 2000, msg: '删除了一间学校' }
        }
        return { code: 3000, msg: '无任何学校被删除' }
      })
    return res
  }
}

module.exports = SchoolService
