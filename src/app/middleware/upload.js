const Profile = require('../models/Profile')
const PhotosMini = require('../models/PhotosMini')
const multer = require("multer");

const Upload = {
    upload(req, res, next) {
        const upload = multer().array('photos')

        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return false
            } else if (err) {
                // An unknown error occurred when uploading.
                return false
            }
            // Everything went fine. save to database
            next()
        })
    },
    storage() {
        // SET STORAGE
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'src/public/uploads')
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
            }
        })
        return storage
    },
    updatePhotosProfile(req, res, next) {
        Profile.findOne({
            user_id: req.user.id
        })
            .then(result => {
                PhotosMini.findById(result.image)
                    .then(photos => {
                        const { title } = photos.data[0]
                        req.photos = title
                        next()
                    })
                    .catch(err => {
                        return res.status(500).json({
                            code: 0,
                            status: false,
                            msg: 'You have failed to updated the photo!',
                        })
                    })

            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You have failed to updated the photo!',
                })
            })
    }
}

module.exports = Upload


// const upload = multer({ storage: storage }).single('avatar')
        // upload(req, res, function (err) {
        //     if (err instanceof multer.MulterError) {
        //         // A Multer error occurred when uploading.
        //     } else if (err) {
        //         // An unknown error occurred when uploading.
        //     }
        //     // Everything went fine. save to database
            
        //     next()
        // })