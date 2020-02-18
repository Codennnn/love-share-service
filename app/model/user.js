'use strict'

module.exports = ({ mongoose, timestamps }) => {
  const Schema = mongoose.Schema
  const refUser = { type: Schema.Types.ObjectId, ref: 'User' }
  const refGoods = { type: Schema.Types.ObjectId, ref: 'Goods' }

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
      maxlength: 12,
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
    balance: {
      type: Number,
      default: 0,
    },
    bill: [new Schema({
      balance: { type: Number, required: true },
      payment: { type: String, required: true },
    }, { timestamps })],
    credit_value: {
      type: Number,
      default: 500,
      min: 0,
    },
    share_value: {
      type: Number,
      default: 0,
      min: 0,
    },
    beans: {
      type: Number,
      default: 0,
      min: 0,
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
    contacts: [refUser],
    chats: Array,
    carts: [new Schema({
      amount: { type: Number, required: true },
      goods: refGoods,
    }, { timestamps })],
    notices: [new Schema({
      title: { type: String, required: true, maxlength: 30 },
      content: { type: String },
      type: { type: Number, enum: [1, 2, 3, 4] }, // 1-系统 2-成功 3-提示 4-重要
      is_read: { type: Boolean, default: false },
      time: Number,
    }, { timestamps })],
    fans: {
      type: [new Schema({ user: refUser }, { timestamps })],
      default: [],
    },
    follows: {
      type: [new Schema({ user: refUser }, { timestamps })],
      default: [],
    },
    collections: {
      type: [new Schema({ goods: refGoods }, { timestamps })],
      default: [],
    },
    published_goods: [refGoods],
    bought_goods: [refGoods],
    check_in: Array,
  }, { timestamps })

  return mongoose.model('User', UserSchema)
}
