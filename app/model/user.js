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
      match: /^1[3456789]\d{9}$/,
    },
    password: {
      type: String,
      required: true,
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
      type: mongoose.Schema.Types.ObjectId,
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
    default_address: mongoose.Schema.Types.ObjectId,
    address_list: [{
      receiver: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      type: {
        type: String,
        required: true,
        enum: [ '学校', '家庭', '公司' ],
      },
    }],
    email: {
      type: String,
      match: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    },
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
