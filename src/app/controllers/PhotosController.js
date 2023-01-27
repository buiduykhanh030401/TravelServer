const Func = require('../../func')
const Photos = require('../models/Photos')


const PhotosController = {
    // [GET] ~/
    index(req, res) {
        return res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to get into photos!',
        })
    },
    // [POST] -> save photos next [parent] store
    store(req, res, next) {
        // generate key photos
        const keys = PhotosController.generateKeyPhotos(req.files)

        req.files.map((file, index) => {
            const photos = new Photos({
                title: keys[index],
                typeof: file.mimetype,
                img: file.buffer,
            })
            photos.save().then().catch()
        })
        req.keys = keys
        next()
    },
    delete(req, res, next) {
        const { title } = req.photos
        Photos.findOneAndDelete({
            title: title
        })
            .then(() => {
                req.deletePhotos = true
                next()
            })
            .catch(() => {
                req.deletePhotos = false
                next()
            })
    },
    generateKeyPhotos(files) {
        let keys = []
        files.map((e, index) => {
            const key = `photos-${Date.now()}${index}`
            keys.push(key)
        })
        return keys
    },
}

module.exports = PhotosController