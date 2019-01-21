const { Schema } = require('./config')

const ArticleSchema = new Schema({
  title:String,
  content:String,
  author:String,
  tips:String,
},{versionKey:false,timestamps:{
  createAt:"created",
  // updateAt:"0"
}})

module.exports = ArticleSchema