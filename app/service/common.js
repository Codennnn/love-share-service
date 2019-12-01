'use strict'

const Service = require('egg').Service

class CommonService extends Service {
  async checkPhoneNumber(phone) {
    const count = await this.ctx.model.User.countDocuments({ phone })
    if (count >= 1) {
      return { code: 4003, msg: '手机号码已被注册' }
    }
    return { code: 2000, msg: '手机号可使用' }
  }

  async getVerificationCode() {
    const code = await new Promise(resolve => {
      setTimeout(() => {
        const code = Math
          .random()
          .toFixed(6)
          .toString()
          .slice(-6)
        resolve(code)
      }, 200)
    })
    return { code: 2000, msg: '获取验证码', data: { code } }
  }
}

module.exports = CommonService
