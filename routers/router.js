const Router = require('koa-router')
//拿到操作 user 表的逻辑对象
const user = require('../control/user')

const router = new Router();

//设计主页 
router.get("/",async (ctx) => {
  //需要title属性
  await ctx.render('index',{
    title:"这是一个正经的title"
  });
})
//主要用来处理返回 用户登录 用户注册
router.get(/^\/user\/(?=reg|login)/,async (ctx) =>{
  //show 为true 则显示注册 false 显示登录
  const show = /reg$/.test(ctx.path)
  await ctx.render("register",{show:show})

})

//注册用户
router.post("/user/reg", user.reg)

//登录用户
router.post("/user/login",user.login)


module.exports = router;

//RESTful
// 对用户的动作: /user
// 登录  /user/login
// 注册  /user/reg
// 退出  /user/logout

// 新增用户 POST > /user --->新增的用户信息
// 删除用户 DEL > /user ---> 带上需要删除的用户id
// 修改用户资料
// 查询用户信息

// 超级管理员 ---> 用户:
// 删除某一id用户
// 新增一个用户