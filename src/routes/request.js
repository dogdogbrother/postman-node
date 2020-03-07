const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { 
  create,
  remove,
  reName
} = require('../controllers/requests')

const collectionsRouter = new Router({prefix:'/request'})

collectionsRouter.post('/', auth, create)
collectionsRouter.delete('/:id', auth, remove)
collectionsRouter.put('/:id', auth, reName)

module.exports = collectionsRouter