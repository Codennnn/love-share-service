'use strict'

const Service = require('egg').Service

class TodoService extends Service {
  getTodoList(_id) {
    return this.ctx.model.Admin
      .findOne({ _id }, 'todos')
      .then(({ todos: todo_list }) => {
        return {
          code: 2000,
          msg: '获取任务列表',
          data: { todo_list },
        }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  addTodo(_id, data) {
    return this.ctx.model.Admin
      .updateOne(
        { _id },
        { $push: { todos: { $each: [data], $position: 0 } } },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功添加一个任务' }
        }
        return { code: 3000, msg: '没有添加任何任务' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  updateTodo(_id, { _id: todo_id, title, content, is_done, is_important, is_starred, is_trashed, tags }) {
    return this.ctx.model.Admin
      .updateOne(
        { _id, 'todos._id': todo_id },
        {
          $set: {
            'todos.$.title': title,
            'todos.$.content': content,
            'todos.$.is_done': is_done,
            'todos.$.is_important': is_important,
            'todos.$.is_starred': is_starred,
            'todos.$.is_trashed': is_trashed,
            'todos.$.tags': tags,
          },
        },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功更新一个任务' }
        }
        return { code: 3000, msg: '没有更新任何任务' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  updateTodoType(_id, { todo_id, type, flag }) {
    return this.ctx.model.Admin
      .updateOne(
        { _id, 'todos._id': todo_id },
        {
          $set: {
            [`todos.$.${type}`]: flag,
          },
        },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功更新一个任务' }
        }
        return { code: 3000, msg: '没有更新任何任务' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }
}

module.exports = TodoService
