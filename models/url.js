const mongoose = require('mongoose')
const Schema = mongoose.Schema  //建構一個新的 Schema
const urlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
  }
})
module.exports = mongoose.model('url', urlSchema) 