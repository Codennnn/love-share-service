'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const OrderSchema = new Schema({
    goods_list: [{ type: Schema.Types.ObjectId, ref: 'Goods' }],
    buyer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  })

  OrderSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Order', OrderSchema)
}
