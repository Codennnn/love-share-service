'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const BillboardSchema = new Schema({
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  })

  BillboardSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Billboard', BillboardSchema)
}
