const express = require('express')
const CartController = require('../app/controllers/CartController')
const router = express.Router()
const auth = require('../app/middleware/auth')
const CartMiddleware = require('../app/middleware/cart')

router.post('/store/:tid', auth.verifyUserAuth, CartMiddleware.validId, CartController.store)
router.delete('/delete/:tid', auth.verifyUserAuth, CartMiddleware.validId, CartController.delete)

router.post('/show', auth.verifyUserAuth, CartController.show)

router.use('/', CartController.index)

module.exports = router