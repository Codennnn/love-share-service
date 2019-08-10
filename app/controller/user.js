'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  /*
   * 用户登录
   */
  async login() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.user.login(data);

    ctx.body = res;
    ctx.response.status = 200;
  }

  /*
   * 创建用户
   */
  async register() {
    const { ctx, service } = this;
    const userData = ctx.request.body;

    // 验证 post 过来的参数
    ctx.validate({
      user_name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    }, userData);

    const res = await service.user.createUser(userData);

    ctx.body = res;
    ctx.status = 200;
  }

  /*
   * 查询所有用户
   */
  async index() {
    const { ctx, service } = this;
    const res = await service.user.getUsers();

    ctx.body = res;
    ctx.status = 200;
  }

  /*
   * 删除用户
   */
  async destroy() {
    const { ctx, service } = this;
    const res = await service.user.deleteUser(ctx.request.body.id);

    ctx.body = res;
    ctx.status = 200;
  }

  /*
   * 更新用户
   */
  async update() {
    const { ctx, service } = this;
    const id = ctx.state.user.id;
    const data = ctx.request.body;
    const res = await service.user.updateUser(id, data);

    ctx.body = res;
    ctx.status = 200;
  }
}

module.exports = UserController;
