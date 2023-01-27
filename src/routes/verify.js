const express = require('express')
const VerifyController = require('../app/controllers/VerifyController')
const MiddlewareVerify = require('../app/middleware/verify')
const UploadMiddleware = require('../app/middleware/upload')
const router = express.Router()

router.put('/phone', UploadMiddleware.upload, MiddlewareVerify.VALIDATION_TWILIO, MiddlewareVerify.SMS_TWILIO, VerifyController.store)
router.put('/validation', UploadMiddleware.upload, MiddlewareVerify.VERIFY_TOKEN_OTP, VerifyController.updateStatus)

router.get('/validation/email/:otp/:otp_id', MiddlewareVerify.VERIFY_TOKEN_OTP, VerifyController.updateStatus)
router.put('/email', UploadMiddleware.upload, MiddlewareVerify.VERIFY_EMAIL, MiddlewareVerify.VERIFY_EMAIL_OTP, VerifyController.storeEmail, VerifyController.sendOTPEmail)

router.use('/', VerifyController.index)

module.exports = router