'use strict'

const Service = require('egg').Service

class SchoolService extends Service {
  getSchoolList() {
    return this.ctx.model.School
      .find({})
      .then(school_list => {
        return { code: 2000, msg: '获取学校列表', data: { school_list } }
      })
  }

  async addSchool({ school_list }) {
    try {
      await this.ctx.model.School.insertMany(school_list)
      return { code: 2000, msg: '成功添加学校' }
    } catch (err) {
      if (err.message.includes('duplicate key')) {
        return { code: 4003, msg: '不能重复添加学校' }
      }
      return { code: 5000, msg: err.message }
    }
  }

  deleteSchool(name) {
    return this.ctx.model.School
      .deleteOne({ name })
      .then(({ deletedCount }) => {
        if (deletedCount === 1) {
          return { code: 2000, msg: '删除了一间学校' }
        }
        return { code: 3000, msg: '无任何学校被删除' }
      })
  }

  updateSchool({ _id, name }) {
    return this.ctx.model.School
      .updateOne(
        { _id },
        { name },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '修改学校名称成功' }
        }
        return { code: 3000, msg: '无任何学校名称被修改' }
      })
  }
}

module.exports = SchoolService
