'use strict'

const Controller = require('egg').Controller

class TodoController extends Controller {
  constructor(ctx) {
    super(ctx)
    if (ctx.state && ctx.state.user) {
      this._id = ctx.state.user.id
    }
  }

  /* GET
   * 获取任务列表
   */
  async getTodoList() {
    const { ctx, service, _id } = this
    const res = await service.todo.getTodoList(_id)
    ctx.reply(res)
  }

  /* POST
   * 添加任务
   */
  async addTodo() {
    const { ctx, service, _id } = this
    ctx.validate({
      title: 'string',
      content: 'string?',
      is_done: 'boolean',
      is_important: 'boolean',
      is_starred: 'boolean',
      is_trashed: 'boolean',
      tags: 'array',
    })
    const res = await service.todo.addTodo(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 移除任务
   */
  async deleteTodo() {
    const { ctx, service, _id } = this
    ctx.validate({ todo_id: 'string' })
    const res = await service.todo.deleteTodo(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* PUT
   * 更新任务
   */
  async updateTodo() {
    const { ctx, service, _id } = this
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
    const res = await service.todo.updateTodo(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* PUT
   * 更新任务类型
   */
  async updateTodoType() {
    const { ctx, service, _id } = this
    ctx.validate({
      todo_id: 'string',
      type: 'string',
      flag: 'boolean',
    })
    const res = await service.todo.updateTodoType(_id, ctx.request.body)
    ctx.reply(res)
  }
}

module.exports = TodoController
