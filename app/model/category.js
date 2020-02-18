'use strict'

module.exports = ({ mongoose, timestamps }) => {
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
  }, { timestamps })

  return mongoose.model('Category', CategorySchema)
}
