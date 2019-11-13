'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  /* POST
   * 用户登录
   */
  async login() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.user.login(data)

    ctx.body = res
    ctx.status = 200
  }

  /* POST
   * 创建用户
   */
  async register() {
    const { ctx, service } = this
    const data = ctx.request.body

    const res = await service.user.createUser(data)

    ctx.body = res
    ctx.status = 200
  }

  /* DELETE
   * 删除用户
   */
  async delete() {
    const { ctx, service } = this
    const res = await service.user.deleteUser(ctx.request.body._id)

    ctx.body = res
    ctx.status = 200
  }

  /* GET
   * 查询所有用户
   */
  async index() {
    const { ctx, service } = this
    const res = await service.user.getUsers()

    ctx.body = res
    ctx.status = 200
  }

  /* PUT
   * 更新用户
   */
  async update() {
    const { ctx, service } = this
    const id = ctx.state.user.id
    const data = ctx.request.body
    const res = await service.user.updateUser(id, data)

    ctx.body = res
    ctx.status = 200
  }

  /*
   * 更新用户
   */
  async info() {
    const { ctx, service } = this
    const id = ctx.state.user.id
    const res = await service.user.getUserInfo(id)

    ctx.body = res
    ctx.status = 200
  }
}

module.exports = UserController
