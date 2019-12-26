'use strict'

const Controller = require('egg').Controller

class AddressController extends Controller {
  /* GET
   * 获取用户的收货地址
   */
  async getAddressList() {
    const { ctx, service } = this
    const id = ctx.request.query._id || ctx.state.user.id
    const res = await service.address.getAddressList(id)
    ctx.reply(res)
  }

  /* POST
   * 添加用户的收货地址
   */
  async addAddress() {
    const { ctx, service } = this
    const data = ctx.request.body
    const id = data.user_id || ctx.state.user.id
    const res = await service.address.addAddress(id, data)
    ctx.reply(res)
  }

  /* DELETE
   * 删除用户的收货地址
   */
  async deleteAddress() {
    const { ctx, service } = this
    const data = ctx.request.body
    const id = data.user_id || ctx.state.user.id
    const res = await service.address.deleteAddress(id, data)
    ctx.reply(res)
  }

  /* PUT
   * 修改用户的收货地址
   */
  async updateAddress() {
    const { ctx, service } = this
    const data = ctx.request.body
    const id = data.user_id || ctx.state.user.id
    const res = await service.address.updateAddress(id, data)
    ctx.reply(res)
  }

  /* PUT
   * 设置用户的默认收货地址
   */
  async setDefaultAddress() {
    const { ctx, service } = this
    const data = ctx.request.body
    const id = data.user_id || ctx.state.user.id
    const res = await service.address.setDefaultAddress(id, data)
    ctx.reply(res)
  }
}

module.exports = AddressController