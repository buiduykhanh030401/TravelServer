const express = require('express')
const OrderController = require('../app/controllers/OrderController')
const router = express.Router()
const auth = require('../app/middleware/auth')

router.post('/checkout/:oid', auth.verifyUserAuth, OrderController.checkout, OrderController.requestCheckout)
// vnpay
router.use('/payment/return/vnpay', OrderController.returnUrlVnpay)
router.use('/payment/ipn/vnpay', OrderController.IpnVnpay)

router.post('/create', auth.verifyUserAuth, OrderController.create)
router.post('/show/one/:oid', auth.verifyUserAuth, OrderController.showOne)
router.post('/show/all', auth.verifyUserAuth, OrderController.showAll)

// super
router.post('/show/all/super', auth.verifySuperAuth, OrderController.showAllBySuper)


router.use('/', OrderController.index)

module.exports = router

