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
    email: {
      type: String,
      trim: true,
    },
    avatar_url: {
      type: String,
      default: 'https://gitee.com/chinesee/images/raw/master/img/img_012.jpg',
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 8,
    },
    roles: {
      type: Array,
      required: true,
      default: ['admin'],
    },
    gender: {
      type: String,
      default: '0',
    },
  })

  AdminSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Admin', AdminSchema)
}
