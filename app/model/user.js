'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    phone: {
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
    real_name: {
      type: String,
      required: true,
      maxlength: 6,
    },
    school: {
      type: String,
      required: true,
    },
    roles: {
      type: Array,
      required: true,
      default: [ 'user' ],
    },
    gender: {
      type: String,
      default: '0',
    },
    introduction: {
      type: String,
    },
    wechat: {
      type: String,
    },
    qq: {
      type: String,
    },
    fans_num: {
      type: Number,
    },
    follow_num: {
      type: Number,
    },
    collect_num: {
      type: Number,
    },
    credit_value: {
      type: Number,
      default: 500,
    },
    share_value: Number,
    address_list: {
      type: Array,
    },
  })

  UserSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('User', UserSchema)
}
