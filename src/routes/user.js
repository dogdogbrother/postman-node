const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { 
  login, 
  register,
  gist,
  list
} = require('../controllers/users')

const usersRouter = new Router({prefix:'/user'})

usersRouter.post('/login', login)
usersRouter.post('/register', register)
usersRouter.get('/gist', auth, gist) // 不是完全的用户模块
usersRouter.get('/list', auth, list)
module.exports = usersRouter