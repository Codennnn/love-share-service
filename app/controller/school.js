'use strict'

const Controller = require('egg').Controller

class SchoolController extends Controller {
  /* POST
   * 添加学校
   */
  async addSchool() {
    const { ctx, service } = this
    const res = await service.school.addSchool(ctx.request.body)

    ctx.body = res
    ctx.status = 200
  }

  /* DELETE
   * 删除学校
   */
  async deleteSchool() {
    const { ctx, service } = this
    const res = await service.school.deleteSchool(ctx.request.body.name)

    ctx.body = res
    ctx.status = 200
  }

  /* GET
   * 获取学校列表
   */
  async getSchoolList() {
    const { ctx, service } = this
    const res = await service.school.getSchoolList()

    ctx.body = res
    ctx.status = 200
  }
}

module.exports = SchoolController
