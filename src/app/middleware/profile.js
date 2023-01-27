const Profile = require('../models/Profile')

const ProfileMiddleware = {
    store(req, res, next) {
        const { user_id, fullname, email, phone, birthday, sex, country, address } = req.body

        if (!user_id || !fullname || !email || !phone || !birthday || !sex || !country || !address) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Data cannot be empty or not valid!',
            })
        }

        Profile.findOne({
            user_id: user_id
        })
            .then(result => {
                if (result) {
                    return res.status(501).json({
                        code: 0,
                        status: false,
                        msg: 'Profile information already exists!',
                    })
                }
                next()
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There was a problem adding information, please try again!',
                })
            })

    },
    update(req, res, next) {
        const { user_id, fullname, email, phone, birthday, sex, country, address } = req.body

        if (!user_id || !fullname || !email || !phone || !birthday || !sex || !country || !address) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Data cannot be empty or not valid!',
            })
        }

        Profile.findOne({
            user_id: user_id
        })
            .then(result => {
                if (!result) {
                    return res.status(501).json({
                        code: 0,
                        status: false,
                        msg: 'Profile information is not exists!',
                    })
                }
                next()
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There was a problem adding information, please try again!',
                })
            })
    }
}

module.exports = ProfileMiddleware