const express = require('express')
const PostsController = require('../app/controllers/PostsController')
const PostsMiddleware = require('../app/middleware/posts')
const auth = require('../app/middleware/auth')
const Upload = require('../app/middleware/upload')
const PhotosController = require('../app/controllers/PhotosController')
const router = express.Router()

router.post('/store', Upload.upload, auth.verifyUserAuth, PostsMiddleware.store, PhotosController.store, PostsController.store)
router.put('/like/:pid', Upload.upload, auth.verifyUserAuth, PostsController.like)

router.get('/show/new', PostsController.new)
router.get('/show/hot', PostsController.hot)

router.use('/', PostsController.index)

module.exports = router