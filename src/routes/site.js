const express = require('express')
const router = express.Router()

const siteController = require('../app/controllers/SiteController')

// router.get('/admin/:name', siteController.admin)
// router.use('/store', siteController.store)
// router.use('/admin', siteController.index)
router.use('/', siteController.index)


module.exports = router