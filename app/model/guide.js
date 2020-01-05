'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const GuideSchema = new Schema({
    guides: [new Schema({
      title: {
        type: String,
        require: true,
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
      })],
    })],
  })

  GuideSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Guide', GuideSchema)
}
