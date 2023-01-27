const Rating = require('../models/Rating')
const Profile = require('../models/Profile')

const RatingMiddleware = {
    insert(req, res, next) {
        const { parent_id, content, rate } = req.body
        const { id, username } = req.user
        if (!parent_id || !content || !rate) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Data cannot be empty or not valid!',
            })
        }
        Profile.findOne({
            username: username
        })
            .then(result => {
                if (!result) {
                    return res.status(404).json({
                        code: 0,
                        status: false,
                        msg: 'Profile information data does not exist',
                    })
                }
                Rating.find({
                    $and: [
                        {
                            parent_id: parent_id
                        },
                        {
                            username: username
                        }
                    ]
                })
                    .then(result => {
                        if (result.length !== 0) {
                            return res.status(404).json({
                                code: 0,
                                status: false,
                                msg: 'You have already rated it, best regards!',
                            })
                        }
                        next()
                    })
                    .catch(err => {
                        return res.status(500).json({
                            code: 0,
                            status: false,
                            msg: 'The server is having problems, please try again!',
                            err: err
                        })
                    })
            })

    },
    show(req, res, next) {
        const { parent_id } = req.params

        if (!parent_id) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Data cannot be empty or not valid!',
            })
        }

        next()
    }
}

module.exports = RatingMiddleware