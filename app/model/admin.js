'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const { timestamps } = app

  const AdminSchema = new Schema({
    account: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    gender: {
      type: Number,
      default: 0, // 0-男，1-女
    },
    email: {
      type: String,
      trim: true,
    },
    avatar_url: {
      type: String,
      default: '',
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 12,
    },
    real_name: {
      type: String,
      required: true,
    },
    todos: [new Schema({
      title: { type: String, required: true },
      content: { type: String, maxlength: 300, default: '' },
      is_done: { type: Boolean, default: false },
      is_important: { type: Boolean, default: false },
      is_starred: { type: Boolean, default: false },
      is_trashed: { type: Boolean, default: false },
      tags: { type: Array },
      complete_time: { type: Array, required: true },
    }, { timestamps })],
    roles: {
      type: Array,
      required: true,
      default: ['admin'],
    },
    lock_password: { type: String, minlength: 3, maxlength: 10 },
    sign_log: [new Schema({
      position: { type: Object, required: true },
      device: { type: String, required: true },
      ip: String,
    }, { timestamps })],
    notices: [new Schema({
      title: { type: String, required: true, maxlength: 30 },
      content: { type: String },
      type: { type: Number, enum: [1, 2, 3, 4] },
      is_read: { type: Boolean, default: false },
    }, { timestamps })],
    chats: Array,
    permissions: [new Schema({
      module: {
        type: String,
        required: true,
      },
      purview: {
        type: Array,
        required: true,
        default: [], // 格式： ['read', 'write', ...]
      },
    }, { timestamps })],
  }, { timestamps })

  return mongoose.model('Admin', AdminSchema)
}
