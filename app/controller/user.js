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
   * 获取用户列表
   */
  async getUserList() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.user.getUserList(data)

    ctx.body = res
    ctx.status = 200
  }

  /* GET
   * 获取用户信息
   */
  async getUserInfo() {
    const { ctx, service } = this
    const id = ctx.request.query._id || ctx.state.user.id
    const res = await service.user.getUserInfo(id)

    ctx.body = res
    ctx.status = 200
  }

  /* PUT
   * 更新用户
   */
  async updateUser() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.user.updateUser(data)

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

  /*
   * 获取用户的收货地址
   */
  async getAddressList() {
    const { ctx, service } = this
    const id = ctx.request.query._id || ctx.state.user.id
    const res = await service.user.getAddressList(id)

    ctx.body = res
    ctx.status = 200
  }

  /*
   * 添加用户的收货地址
   */
  async addAddress() {
    const { ctx, service } = this
    const id = ctx.request.query._id || ctx.state.user.id
    const data = ctx.request.body
    const res = await service.user.addAddress(id, data)

    ctx.body = res
    ctx.status = 200
  }

  /*
   * 添加用户的收货地址
   */
  async deleteAddress() {
    const { ctx, service } = this
    const id = ctx.request.query._id || ctx.state.user.id
    const data = ctx.request.body
    const res = await service.user.deleteAddress(id, data)

    ctx.body = res
    ctx.status = 200
  }
}

module.exports = UserController
