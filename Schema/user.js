const { Schema } = require('./config')

const UserSchema = new Schema({
  username:String,
  password:String,
  role: {
    type:String,
    default:1
  },
  avatar:{
    type:String,
    default:"/avatar/default.jpg"
  },
  articleNum: Number,
  commentNum:Number,
},{versionKey:false})

//设置 user 的 remove钩子
// UserSchema.pre("remove",(next) => {}) //前置钩子
UserSchema.post("remove",(doc) => {
  //当前这个回调函数 一定会在remove之后触发  钩子函数只能通过new触发
  // console.log(doc)
  const Article = require('../Models/article')
  const Comment = require('../Models/comment')
  const User = require('../Models/user')
  // console.log(Comment)
  //用户文章删除,下面评论删除,对应评论下的作者评论数相对应的减少
  //用户的评论删除,相对应的文章下的评论要删除 评论数要减少
  const { _id:userId } = doc
  // console.log(userId) //输出删除用户的id

  //通过用户id 查询用户所有的文章 及文章下的评论  进行删除
  Article.find({author:userId})
    .then(data => {
      // console.log(0)
      // console.log(data)
      // console.log(1)
      Comment.find({article:data[0]._id})
        .then(data=>{
          // console.log(2)
          // console.log(data)
          // console.log(3)
          data.forEach(com => com.remove())
        })

      data.forEach(art => art.remove())
    })

  //通过用户id 查询用户的所有评论 
  Comment.find({from:userId})
    .then(data=>{
      // console.log(4)
      // console.log(data)
      // console.log(5)
      data.forEach(com => {
        com.remove()
      })
    })
  // Comment.find({author:userId})
  //   .then(data => {
  //     data.forEach(v = v.remove())
  //   })
  
  // //只需要用户的articleNum -1
  // User.findByIdAndUpdate(authorId,{$inc:{articleNum:-1}}).exec()
  // //把当前需要删除的文章所关联的所有评论  一次调用 评论 remove
  // Comment.find({article:artId})
  //   .then(data =>{
  //     data.forEach(v = v.remove())
  //   })
})//后置钩子


module.exports = UserSchema