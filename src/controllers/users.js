const User = require('../models/users');
const Project = require('../models/projects');
const Info = require('../models/infos');
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')

class UsersCtl {

  async login(ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const { username, password } = ctx.request.body;
    // 这个地方能and优化下
    const findUser1 = await User.findOne({ username }).select("+password");
    const findUser2 = await User.findOne({ email: username }).select("+password");
    // 因为不知道用户输入的是用户名还是邮箱，所以查询2次
    if (!findUser1 && !findUser2) ctx.throw(403, '用户名邮箱或密码错误')
    const findUser3 = findUser1 || findUser1
    if (!bcrypt.compareSync(password, findUser3.password)) {
      ctx.throw(403, '用户名邮箱或密码错误')
    }
    const token = jsonwebtoken.sign({ id: findUser3._id, username  }, secret, { expiresIn: '7d' })
    
    await ctx.cookies.set('jwt', token, { maxAge: 604800000, httpOnly: false })

    const noReadNumber = await Info.find({ $and: [{ addressee: id }, { isRead: false}] }).countDocuments()

    ctx.body = {
      userInfo: findUser3,
      noReadNumber
    }
    // ctx.body = findUser3
  }

  async register(ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
      email: { type: 'string', required: true }
    })
    const { username, password, email } = ctx.request.body;

    let findUser = await User.findOne({ username });

    if (findUser) { ctx.throw(409, '用户已经存在,请更换用户名') }
    findUser = await User.findOne({ email });
    if (findUser) { ctx.throw(409, '邮箱已经存在,请更换邮箱') }

    const salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(password, salt);
    const user = await new User({ 
      username,
      password: hashPassword,
      email
    }).save();

    delete user.password
    // 注册等于登录
    const token = jsonwebtoken.sign({ id: user._id, username }, secret, { expiresIn: '7d' })
    ctx.cookies.set('jwt', token, { maxAge: 604800000, httpOnly: false  })
    // ctx.body = '注册成功,已登录'
    ctx.body = user
  }

  // 这个就是把个人信息啊，创建的项目列表啊等等都放在一起
  async gist(ctx) {
    
    const { id } = ctx.state.user

    // 首选要拿到user表中的个人信息
    const userInfo = await User.findById(id);
    
    // 再拿我创建的项目list，用 founder 匹配
    const founders = await Project.find({ founder: id });

    // 在所有项目中找到members字段数组里面有我的项目
    const members = await Project.find({ members: id });

    // 再拿到未读信息数量
    const noReadNumber = await Info.find({ $and: [{ addressee: id }, { isRead: false}] }).countDocuments()

    ctx.body = {
      userInfo,
      founders,
      noReadNumber,
      members
    }
  }

  // 用于邀请用户时
  async list(ctx) {
    const { username, limit } = ctx.query
    const { id } = ctx.state.user
    const userList = await User.find({ username: new RegExp(username), _id: { $ne: id } }).limit(Number(limit));
    ctx.body = userList || []
  }
}
module.exports = new UsersCtl()
