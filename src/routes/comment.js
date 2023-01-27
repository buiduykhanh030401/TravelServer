const express = require('express')
const CommentController = require('../app/controllers/CommentController')
const PostsController = require('../app/controllers/PostsController')
const auth = require('../app/middleware/auth')
const CommentMiddleware = require('../app/middleware/comment')
const Upload = require('../app/middleware/upload')
const router = express.Router()

router.post('/store', Upload.upload, auth.verifyUserAuth, CommentMiddleware.store, CommentController.store, PostsController.comment)
router.post('/show/:object_id', CommentController.show)

router.use('/', CommentController.index)

module.exports = router