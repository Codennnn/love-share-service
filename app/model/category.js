'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const CategorySchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    activation: {
      type: Boolean,
      default: false,
    },
    hit: {
      type: Number,
      default: 0,
    },
  })

  CategorySchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Category', CategorySchema)
}
