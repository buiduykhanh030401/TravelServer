
const Photos = require('../models/Photos')
const PhotosMini = require('../models/PhotosMini')
const path = require('path');
const multer = require("multer");
const Profile = require('../models/Profile')

const Photo = {
    // [POST] /upload
    upload(req, res, next) {
        const upload = multer({ storage: req.storage }).array('photos')
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return false
            } else if (err) {
                // An unknown error occurred when uploading.
                return false
            }
            // Everything went fine. save to database
            const photos = new Photos({
                data: []
            })
            photos.save()
                .then(result => {
                    req.files.map(e => {
                        Photos.findByIdAndUpdate(result._id, {
                            "$push": {
                                data: {
                                    img: e.filename
                                }
                            }
                        }).then().catch()
                    })
                    req.photos = result
                    req.images = req.files[0]
                    next()
                })
                .catch(err => {
                    res.status(404).json({ err })
                })
        })
    },

    // save to database
    storePhotos(req, res, next) {
        const photosmini = new PhotosMini({
            data: []
        })

        photosmini.save()
            .then(result => {
                req.files.map((e, index) => {
                    setTimeout(() => {
                        const title = e.fieldname + '-' + Date.now() + index
                        const photos = new Photos({
                            title: title,
                            typeof: e.mimetype,
                            img: e.buffer
                        })
                        photos.save().then().catch()
                        PhotosMini.findByIdAndUpdate(result._id, {
                            "$push": {
                                data: {
                                    title: title,
                                    typeof: e.mimetype,
                                }
                            }
                        }).then().catch()
                    }, 100)
                })
                req.photos = result
                next()
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'An error occurred, please try again!',
                    err: err
                })
            })
    },

    // delete photo
    delete(req, res) {
        const { title } = req.body
        Photos.findOneAndDelete({ title: title })
            .then(result => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You have successfully deleted the photo!',
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You have failed to delete the photo!',
                })
            })
    },

    // update
    update(req, res, next) {
        req.files.map(e => {
            Photos.findOneAndUpdate({ title: req.photos }, {
                img: e.buffer
            })
                .then(() => {
                    return res.status(200).json({
                        code: 0,
                        status: true,
                        msg: 'You have successfully updated the photo!'
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        code: 0,
                        status: false,
                        msg: 'You have failed to updated the photo!',
                    })
                })
        })

    }
}

module.exports = { Photo }