'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const GuideSchema = new Schema({
    section: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    articles: [new Schema({
      title: {
        type: String,
        require: true,
      },
      content: {
        type: String,
        require: true,
      },
    }, {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    })],
  })

  GuideSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Guide', GuideSchema)
}
