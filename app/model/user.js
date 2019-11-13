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
      default: '',
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
      default: '',
    },
    wechat: {
      type: String,
    },
    qq: {
      type: String,
    },
    credit_value: {
      type: Number,
      default: 500,
    },
    share_value: {
      type: Number,
      default: 0,
    },
    address_list: [
      {
        receiver: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        address_type: {
          type: String,
          required: true,
          enum: [ '学校', '家庭', '公司' ],
        },
      },
    ],
    fans: Array,
    follows: Array,
    collects: Array,
    published_goods: Array,
    bought_goods: Array,
  })

  UserSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('User', UserSchema)
}
