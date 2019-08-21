'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async login(data) {
    const { ctx, app } = this;
    const { user_name, password } = data;
    let res;

    try {
      res = await ctx.model.User.find({ user_name }).limit(1);
    } catch (err) {
      return { code: 3000, msg: err.message };
    }

    if (res.length === 1) {
      // 对比hash加密后的密码是否相等
      const isMatch = await ctx.compare(password, res[0].password);

      if (isMatch) {
        // 创建JWT，有效期为7天
        const token = app.jwt.sign(
          { id: res[0]._id },
          app.config.jwt.secret,
          { expiresIn: '7d' }
        );
        return { code: 2000, msg: '登录校验成功', data: { token } };
      }
      return { code: 3000, msg: '登录校验失败' };
    }
    return { code: 4004, msg: '该账号尚未注册' };
  }

  async createUser(data) {
    const { ctx } = this;
    const { user_name, password } = data;
    const hash = await ctx.genHash(password);
    let res;
    await ctx.model.User
      .init()
      .then(async () => {
        res = await ctx.model.User
          .create({
            user_name,
            password: hash,
            nick_name: data.nick_name,
            roles: data.roles,
          })
          .then(() => {
            return { code: 2001, msg: '创建用户成功' };
          })
          .catch(err => {
            if (err.message.includes('duplicate key error')) {
              return { code: 3000, msg: '该账号已注册，请前往登录' };
            }
            return { code: 3000, msg: err.message };
          });
      });
    return res;
  }

  async deleteUser(id) {
    const res = await this.ctx.model.User.deleteOne({ _id: id });
    if (res.deletedCount === 1) {
      return { code: 2004, msg: '删除用户成功' };
    }
    return { code: 3000, msg: '无删除任何用户' };
  }

  async getUsers() {
    const res = await this.ctx.model.User.find();
    return { code: 2000, msg: '查询所有用户', data: { users: res } };
  }

  async updateUser(id, data) {
    const res = await this.ctx.model.User
      .updateOne(
        { _id: id },
        { $set: data },
        { runValidators: true }
      )
      .then(res => {
        if (res.nModified === 1) {
          return { code: 2004, msg: '数据更新成功' };
        }
        return { code: 3000, msg: '无可更新的数据' };
      })
      .catch(err => {
        return { code: 3000, msg: err.message };
      });
    return res;
  }

  async getUserInfo(id) {
    const res = await this.ctx.model.User.findOne(
      { _id: id },
      { nick_name: 1, roles: 1 }
    );

    return { code: 2000, msg: '获取用户登录信息', data: { ...res._doc } };
  }
}

module.exports = UserService;
