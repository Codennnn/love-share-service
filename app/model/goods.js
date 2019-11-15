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
    },
    img_list: {
      type: Array,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    category: {
      type: Array,
    },
    description: {
      type: String,
      maxlength: 400,
    },
    delivery: {
      type: String,
      enum: [ '1', '2', '3' ],
    },
    delivery_charge: {
      type: Number,
      default: 0,
    },
    returnable: {
      type: Boolean,
      default: true,
    },
    collect_num: {
      type: Number,
      default: 0,
    },
  })

  GoodsSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Goods', GoodsSchema)
}
