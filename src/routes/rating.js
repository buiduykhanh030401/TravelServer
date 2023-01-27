const express = require('express')
const RatingController = require('../app/controllers/RatingController')
const RatingMiddleware = require('../app/middleware/rating')
const middlewareAuth = require('../app/middleware/auth')

const router = express.Router()

router.post('/store', middlewareAuth.verifyUserAuth, RatingMiddleware.insert, RatingController.store)
router.get('/show/:parent_id', RatingMiddleware.show, RatingController.show)

router.use('/', RatingController.index)

module.exports = router