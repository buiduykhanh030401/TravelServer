const express = require('express')
const Auth = require('../app/controllers/AuthController')
const middlewareAuth = require('../app/middleware/auth')
const MiddlewareVerify = require('../app/middleware/verify')
const router = express.Router()

router.delete('/user/delete/:id', middlewareAuth.verifyAdminAuth, Auth.delete)
router.get('/user/show/all', middlewareAuth.verifyAdminAuth, Auth.all)
router.post('/user/show/details/:username', middlewareAuth.verifyTokenUserAndAdminAuth, Auth.details)

// auth
router.post('/register', MiddlewareVerify.VERIFY_EMAIL, Auth.register)
router.post('/login', Auth.login)
router.post('/logout', middlewareAuth.verifyToken, Auth.logout)
router.post('/refresh', Auth.refresh)

module.exports = router