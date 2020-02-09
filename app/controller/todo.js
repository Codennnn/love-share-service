'use strict'

const Controller = require('egg').Controller

class TodoController extends Controller {
  /* GET
   * 获取任务列表
   */
  async getTodoList() {
    const { ctx, service } = this
    const id = ctx.state.user.id
    const res = await service.todo.getTodoList(id)
    ctx.reply(res)
  }

  /* POST
   * 添加任务
   */
  async addTodo() {
    const { ctx, service } = this
    try {
      ctx.validate({
        title: 'string',
        content: 'string?',
        is_done: 'boolean',
        is_important: 'boolean',
        is_starred: 'boolean',
        is_trashed: 'boolean',
        tags: 'array',
      })
      const id = ctx.state.user.id
      const res = await service.todo.addTodo(id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 移除任务
   */
  async deleteTodo() {
    const { ctx, service } = this
    try {
      ctx.validate({ todo_id: 'string' })
      const id = ctx.state.user.id
      const res = await service.todo.deleteTodo(id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 更新任务
   */
  async updateTodo() {
    const { ctx, service } = this
    try {
      ctx.validate({
        _id: 'string',
        title: 'string',
        content: 'string?',
        is_done: 'boolean',
        is_important: 'boolean',
        is_starred: 'boolean',
        is_trashed: 'boolean',
        tags: 'array',
      })
      const id = ctx.state.user.id
      const res = await service.todo.updateTodo(id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 更新任务类型
   */
  async updateTodoType() {
    const { ctx, service } = this
    try {
      ctx.validate({
        todo_id: 'string',
        type: 'string',
        flag: 'boolean',
      })
      const id = ctx.state.user.id
      const res = await service.todo.updateTodoType(id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = TodoController
