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
      default: '',
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
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'School',
    },
    roles: {
      type: Array,
      required: true,
      default: ['user'],
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
    beans: {
      type: Number,
      default: 0,
    },
    default_address: Schema.Types.ObjectId,
    address_list: [{
      receiver: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      type: {
        type: String,
        required: true,
        enum: ['学校', '家庭', '公司'],
      },
    }],
    email: {
      type: String,
      match: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    },
    contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    carts: [new Schema({
      amount: { type: Number, required: true },
      goods: { type: Schema.Types.ObjectId, ref: 'Goods' },
    }, {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    })],
    notices: [new Schema({
      title: { type: String, required: true, maxlength: 30 },
      content: { type: String },
      type: { type: Number, enum: [1, 2, 3, 4] },
      is_read: { type: Boolean, default: false },
      time: Number,
    }, {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    })],
    chats: Array,
    fans: {
      type: [new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' },
      }, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
      })],
      default: [],
    },
    follows: {
      type: [new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' },
      }, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
      })],
      default: [],
    },
    collections: {
      type: [new Schema({
        goods: { type: Schema.Types.ObjectId, ref: 'Goods' },
      }, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
      })],
      default: [],
    },
    published_goods: [{ type: Schema.Types.ObjectId, ref: 'Goods' }],
    bought_goods: [{ type: Schema.Types.ObjectId, ref: 'Goods' }],
    check_in: Array,
  })

  UserSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('User', UserSchema)
}
