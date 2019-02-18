const Article = require('../Models/article')
const User = require('../Models/user')
const Comment = require('../Models/comment')
// const Schema = require('../Models/admin')

const fs = require('fs')
const { join } = require('path')

//
exports.index = async ctx => {
  if (ctx.session.isNew) {
    //没有登录
    ctx.status = 404
    return await ctx.render("404",{title:"404"})
  }
  const id = ctx.params.id

  const arr = fs.readdirSync(join(__dirname,"../views/admin"))
  // console.log(arr)
  let flag = false
  arr.forEach(v =>{
    const name = v.replace(/^(admin\-)|(\.pug)$/g,"")
    if (name === id) {
      flag = true
    }
  })

  if (flag) {
    await ctx.render("./admin/admin-"+ id,{
      role:ctx.session.role
    })
  }else{
    ctx.status = 404
    await ctx.render("404",{title:"404"})
  }
}

//获取所有的用户 名称,权限,发表文章数,发表评论数
exports.userslist = async ctx =>{

  const data = await User.find({role:'1'})
  // .populate('commentNum','articleNum')
  // console.log(data)
  ctx.body = {
    code:0,
    count:data.length,
    data
  }
  // await new Promise((resolve,reject) => {
  //   User.find({role:'1'},(err,data) => {
  //     console.log(data)
  //     if(err)return err;
      
  //   })
  // })
}

// 用户删除
exports.del = async ctx => {
  // console.log(ctx)
  // 用户 id
  const userId = ctx.params.id

  let res = {
    state:1,
    message:"成功"
  }
  await User.findById(userId)
    .then(data => {
      // console.log('a')
      // console.log(data)
      // console.log('f')
      data.remove()
    })
    .catch(err => {
      res = {
        state:0,
        message:err
      }
    })

  ctx.body = res
}