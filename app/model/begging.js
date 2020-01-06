'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const BeggingSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    min_price: { type: Number, required: true, min: 0 },
    max_price: { type: Number, required: true, min: 0 },
    category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    announcer: { type: Schema.Types.ObjectId, ref: 'User' },
  })

  BeggingSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Begging', BeggingSchema)
}
