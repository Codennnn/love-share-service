'use strict'

const Service = require('egg').Service

class LogService extends Service {
  getLogList() {
    return this.ctx.model.Log
      .find({})
      .sort({ created_at: -1 })
      .then(log_list => {
        return {
          code: 2000,
          msg: '获取日志列表',
          data: { log_list },
        }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async addLog(data) {
    const log = new this.ctx.model.Log(data)
    await log.save()
    return { code: 2000, msg: '日志已上报' }
  }

  deleteLog({ log_id_list }) {
    return this.ctx.model.Log
      .deleteMany({ _id: { $in: log_id_list } })
      .then(({ deletedCount }) => {
        if (deletedCount === log_id_list.length) {
          return { code: 2000, msg: '日志已清除' }
        }
      })
  }
}

module.exports = LogService
