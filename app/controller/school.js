'use strict'

const Controller = require('egg').Controller

class SchoolController extends Controller {
  /* POST
   * 添加学校
   */
  async addSchool() {
    const { ctx, service } = this
    const res = await service.school.addSchool(ctx.request.body.name)
    ctx.reply(res)
  }

  /* DELETE
   * 删除学校
   */
  async deleteSchool() {
    const { ctx, service } = this
    const res = await service.school.deleteSchool(ctx.request.body.name)
    ctx.reply(res)
  }

  /* GET
   * 获取学校列表
   */
  async getSchoolList() {
    const { ctx, service } = this
    const res = await service.school.getSchoolList()
    ctx.reply(res)
  }

  /* PUT
   * 修改学校名称
   */
  async updateSchool() {
    const { ctx, service } = this
    const res = await service.school.updateSchool(ctx.request.body)
    ctx.reply(res)
  }
}

module.exports = SchoolController
