const Koa = require('koa')
const mongoose = require('mongoose')
const error = require("koa-json-error")
const parameter = require('koa-parameter')
const koaBody = require('koa-body')
const path = require('path')
const koaStatic = require('koa-static')
const _ = require('underscore')

const routing = require('./routes')

const app = new Koa()
const io = require('socket.io')(app)

const { connectionStr } = require('./config')

mongoose.set('useFindAndModify', false)
mongoose.connect(connectionStr, { useUnifiedTopology: true,  useNewUrlParser: true }, () => {
  console.log('链接成功');
})
mongoose.connection.on('error', console.error)

app.use(koaStatic(path.join(__dirname, '../public')))

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname,'../public'),
    keepExtensions: true
  }
}))
app.use(parameter(app))
app.use(error({
  postFormat: (e, {stack, ...rest})=> process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))

routing(app)


app.listen(3019, () => {console.log('3019端口已经开启')})

io.on('connection', function (socket) {
  console.log('新加入一个连接。');
  // 不管是服务器还是客户端都有 emit 和 on 这两个函数，socket.io 的核心就是这两个函数
  socket.on('test', function (data) {
    console.log('我就测试下');
    
      // var name = data.roomId;
      // // 储存上线的用户
      // hashName[name] = socket.id;
  });
  /**
   * on ：用来监听一个 emit 发送的事件
   * 'sayTo' 为要监听的事件名
   * 匿名函数用来接收对方发来的数据
   * 这个匿名函数的第一个参数为接收的数据，如果有第二个参数，则是要返回的函数。
   */
  socket.on('send', function (data) {
      var toName = data.to;
      var toId = data.id;
      if (toId = hashName[toName]) {
          // nodejs的underscore扩展中的findWhere方法，可以在对象集合中，通过对象的属性值找到该对象并返回。
          var toSocket = _.findWhere(io.sockets.sockets, {id: toId});

          // socket.emit() ：向建立该连接的客户端广播
          // socket.broadcast.emit() ：向除去建立该连接的客户端的所有客户端广播
          // io.sockets.emit() ：向所有客户端广播，等同于上面两个的和

          // 通过该连接对象（toSocket）与链接到这个对象的客户端进行单独通信
          toSocket.emit('message', data.msg);
      }
  });

  // 当关闭连接后触发 disconnect 事件
  socket.on('disconnect', function () {
      console.log('断开一个连接。');
  });
});
io.listen(3018, () => {console.log('3018端口已经开启')})