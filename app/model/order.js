'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const OrderSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  })

  OrderSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Order', OrderSchema)
}
