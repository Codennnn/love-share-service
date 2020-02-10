'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const GoodsSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    original_price: {
      type: Number,
      default: 0,
    },
    img_list: {
      type: Array,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    degree: {
      type: Number,
      default: 50,
    },
    category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    description: {
      type: String,
      maxlength: 400,
      default: '',
    },
    delivery: {
      type: String,
      enum: ['1', '2', '3'], // 1-包邮, 2-自费, 3-自提
      default: '1',
    },
    delivery_charge: {
      type: Number,
      default: 0,
    },
    can_bargain: {
      type: Boolean,
      default: false,
    },
    can_return: {
      type: Boolean,
      default: false,
    },
    collect_num: {
      type: Number,
      default: 0,
    },
    seller: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: {
      type: [new Schema({
        content: { type: String, minlength: 1, maxlength: 50 },
        sender: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        replies: [new Schema({
          sender: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
          },
          at: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
          },
          content: { type: String, minlength: 1, maxlength: 50 },
        }, {
          timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        })],
        time: Number,
      }, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
      })],
      default: [],
    },
    review: {
      type: new Schema({
        content: {
          type: String,
          minlength: 1,
          maxlength: 200,
          required: true,
        },
        star: {
          type: Number,
          required: true,
        },
      }, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
      }),
    },
    status: {
      type: Number,
      // 1-待出售，2-进行中，3-已下架, 4-已出售, 5-派送中
      enum: [1, 2, 3, 4, 5],
      default: 1,
    },
    sell_time: Number,
  })

  GoodsSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Goods', GoodsSchema)
}
