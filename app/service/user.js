'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async login(data) {
    const { ctx, app } = this;
    const { user_name, password } = data;

    const res = await ctx.model.User.findOne({ user_name });
    if (res) {
      // 创建JWT，有效期为7天
      const token = app.jwt.sign(
        { id: res._id },
        app.config.jwt.secret,
        { expiresIn: '30d' }
      );

      // 对比hash加密的密码是否相等
      const isMatch = await ctx.compare(password, res.password);

      return { token, isMatch };
    }
  }

  async createUser(data) {
    const { ctx } = this;
    const { user_name, password } = data;
    const count = await ctx.model.User.count({ user_name });
    if (count === 0) {
      const hash = await ctx.genHash(password);
      const result = await ctx.model.User
        .create({
          user_name,
          password: hash,
        })
        .then(res => {
          if (res._id) {
            return { isCreated: true };
          }
        })
        .catch(err => {
          console.log(err);
          return err;
        });
      return result;
    }
    return { isExist: true };
  }

  async deleteUser(id) {
    const result = await this.ctx.model.User.deleteOne({ _id: id });
    return result;
  }

  async getUsers() {
    const result = await this.ctx.model.User.find();
    return result;
  }

  async updateUser(id, data) {
    const result = await this.ctx.model.User.updateOne(
      { _id: id },
      { $set: data }
    );
    return result;
  }
}

module.exports = UserService;
