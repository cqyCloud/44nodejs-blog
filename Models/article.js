const { db } = require("../Schema/config")

//通过 db 对象创建操作 article 数据库的模型对象
const ArticleSchema = require("../Schema/article")
const Article = db.model("articles",ArticleSchema)

module.exports = Article