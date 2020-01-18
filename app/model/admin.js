'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

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
    gender: {
      type: Number,
      default: 0,
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
      content: { type: String, required: true },
      is_done: { type: Boolean, default: false },
      is_important: { type: Boolean, default: false },
      is_starred: { type: Boolean, default: false },
      is_trashed: { type: Boolean, default: false },
      tags: { type: Array },
    }, {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    })],
    roles: {
      type: Array,
      required: true,
      default: ['admin'],
    },
    permissions: [new Schema({
      module: {
        type: String,
        required: true,
      },
      purview: {
        type: Array,
        required: true,
        default: [],
      },
    }, {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    })],
  })

  AdminSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Admin', AdminSchema)
}
