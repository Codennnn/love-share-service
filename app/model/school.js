'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const SchoolSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: String,
    level: String,
  })

  SchoolSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('School', SchoolSchema)
}
