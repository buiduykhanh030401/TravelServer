const express = require('express')
const ServiceController = require('../app/controllers/ServiceController')
const middlewareAuth = require('../app/middleware/auth')
const UploadMiddleware = require('../app/middleware/upload')
const TourMiddleware = require('../app/middleware/tour')
const PhotosController = require('../app/controllers/PhotosController')
const TourController = require('../app/controllers/TourController')
const ServiceMiddleware = require('../app/middleware/service')
const router = express.Router()

router.put('/store', UploadMiddleware.upload, middlewareAuth.verifyUserAuth, middlewareAuth.verifySuperAuth, TourMiddleware.store, PhotosController.store, TourController.store, ServiceController.store)
router.delete('/delete/:tid', UploadMiddleware.upload, middlewareAuth.verifyUserAuth, middlewareAuth.verifySuperAuth, ServiceMiddleware.validServiceAndTour, ServiceController.delete)
router.put('/update/:tid', UploadMiddleware.upload, middlewareAuth.verifyUserAuth, middlewareAuth.verifySuperAuth, ServiceMiddleware.validServiceAndTour, TourMiddleware.store, TourController.update)

router.get('/:username', TourController.forUsername)

router.use('/', ServiceController.index)

module.exports = router 