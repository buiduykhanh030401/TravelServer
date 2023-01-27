const express = require('express')
const EventController = require('../app/controllers/EventController')
const router = express.Router()
const AuthMiddleware = require('../app/middleware/auth')
const EventMiddleware = require('../app/middleware/event')

router.get('/update', AuthMiddleware.verifyAdminAuth, EventController.update)
router.get('/delete', AuthMiddleware.verifyAdminAuth, EventController.delete)
router.get('/show/all/:limit/:skip', EventMiddleware.all, EventController.all)
router.get('/show/details/:slug', EventMiddleware.details, EventController.details)
router.get('/show/all/location', EventMiddleware.getEventLocationRadius, EventController.getEventLocationRadius)
router.use('/', EventController.index)

module.exports = router