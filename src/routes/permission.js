const express = require('express')
const router = express.Router()
const PerMiddleware = require('../app/middleware/permission')
const Permission = require('../app/controllers/PermissionController')
const Auth = require('../app/middleware/auth')

router.post('/store', Auth.verifyAdminAuth, PerMiddleware.store, Permission.store)
router.use('/', Permission.index)

module.exports = router