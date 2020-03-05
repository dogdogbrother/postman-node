const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { 
  create,
  remove
} = require('../controllers/folders')

const collectionsRouter = new Router({prefix:'/folder'})

collectionsRouter.post('/', auth, create)
collectionsRouter.delete('/:collectionId/:folderId', auth, remove)

module.exports = collectionsRouter