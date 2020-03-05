const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { 
  create,
  queryList,
  remove,
  reName
} = require('../controllers/collections')

const collectionsRouter = new Router({prefix:'/collection'})

collectionsRouter.post('/:id', auth, create)
collectionsRouter.get('/:id', auth, queryList)
collectionsRouter.delete('/:id', auth, remove)
collectionsRouter.put('/:id', auth, reName)

module.exports = collectionsRouter