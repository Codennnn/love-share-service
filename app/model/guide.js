'use strict'

module.exports = ({ mongoose, timestamps }) => {
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
    }, { timestamps })],
  }, { timestamps })

  return mongoose.model('Guide', GuideSchema)
}
