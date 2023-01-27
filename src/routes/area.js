const express = require('express')
const AreaController = require('../app/controllers/AreaController')
const router = express.Router()
const auth = require('../app/middleware/auth')

// router.put('/update/:slug', auth.verifyAdminAuth, AreaController.update)
// router.delete('/delete/:slug', auth.verifyAdminAuth, AreaController.delete)
// router.post('/store', auth.verifyAdminAuth, AreaController.store)

router.get('/show/details/:slug', AreaController.details)
router.get('/show/all/:type', AreaController.type)
router.get('/show/all', AreaController.all)
router.use('/', AreaController.index)

module.exports = router