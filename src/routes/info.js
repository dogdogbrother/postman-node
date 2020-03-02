const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { 
  inviteMsg,
  list,
  read
} = require('../controllers/infos')

const infosRouter = new Router({prefix:'/info'})

infosRouter.post('/invite', inviteMsg)
infosRouter.get('/', auth, list)
infosRouter.put('/read/:id', auth, read)
module.exports = infosRouter