const Koa = require('koa');
const static = require('koa-static');
const views = require('koa-views');
const router = require('./routers/router');
const logger = require('koa-logger');
const body = require('koa-body')
const { join } = require('path');
const session = require('koa-session')
const compress = require('koa-compress')

//生成Koa实例
const app = new Koa();

app.keys = ["风雨是个大帅比"];

//session 的配置对象
const CONFIG = {
  key:"Sid",
  maxAge:36e5,//毫秒
  overwrite:true,
  httpOnly:true,
  // signed:true,
  rolling:true
}

//注册日志模块
app.use(logger());

//注册资源压缩模块
app.use(compress({
  // filter: function (content_type) {
  //   return /text/i.test(content_type)
  // },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))

//注册session
app.use(session(CONFIG,app))

//配置 koa-body 处理 post 请求数据
app.use(body())

//设置静态资源目录
app.use(static(join(__dirname,'public')))

//配置视图模块
app.use(views(join(__dirname,'views'), { extension:'pug' }))

// 注册路由信息
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000,() => {
  console.log("项目启动成功,监听在3000端口")
})


//创建管理员用户  如果管理员用户已经存在 则返回
{
  // admin admin
  const { db } = require("./Schema/config")
  const UserSchema = require("./Schema/user")
  const encrypt = require('./util/encrypt')
  const User = db.model("users",UserSchema)

  //查找管理员是否存在
  User
  .find({username:"admin"})
  .then(data => {
    if (data.length === 0) {
      //管理员不存在  创建
      new User({
        username:"admin",
        password:encrypt("admin"),
        role:666,
        commentNum:0,
        articleNum:0
      })
        .save()
        .then(data => {console.log('管理员用户名 -> admin, 密码 -> admin')})
        .catch(err => {
          console.log('管理员账号检查失败')
        })
    }else{
      //在控制台输出
      console.log('管理员用户名 -> admin, 密码 -> admin')
    }
  })


}