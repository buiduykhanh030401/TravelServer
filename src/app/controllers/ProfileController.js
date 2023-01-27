
const Profile = require('../models/Profile')
const Func = require('../../func')

const ProfileController = {
    // [GET] ~/profile
    index(req, res) {
        return res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to go on!',
        })
    },

    // [POST] ~/store
    store(req, res) {
        const { user_id, fullname, email, phone, birthday, sex, country, address } = req.body
        const { id, username } = req.user
        const profile = new Profile({
            user_id: id,
            username: username,
            fullname: fullname,
            email: email,
            phone: phone,
            birthday: birthday,
            sex: sex,
            country: country,
            address: address,
            images: req.keys,
        })

        profile.save()
            .then(result => {
                result = [result]
                Func.SimpleArrayPhotos(req, result)
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You update profile success!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You update profile faild!',
                })
            })
    },

    // [POST] ~/show/details/:username
    details(req, res) {
        const { username } = req.params

        Profile.findOne({
            username: username
        })
            .then(result => {
                result = [result]
                Func.SimpleArrayPhotos(req, result)
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You show profile success!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: true,
                    msg: 'You show profile faild!',
                    err: err
                })
            })
    },

    // [POST] ~/show/all/:limit/:skip
    all(req, res) {
        const { limit, skip } = req.params
        const url = req.protocol + '://' + req.get('host') + `/api/v1/profile/show/all/${limit}/${parseInt(skip) + parseInt(limit)}`

        Profile.find().limit(limit).skip(skip)
            .then(result => {
                Func.SimpleArrayPhotos(req, result)
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You show all profile success!',
                    next: url,
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: true,
                    msg: 'You show all profile faild!',
                    err: err
                })
            })
    },

    // [PUT] ~/update
    update(req, res) {
        const { fullname, phone, birthday, sex, country, address } = req.body
        const { id, username } = req.user

        Profile.findOneAndUpdate({
            user_id: id
        }, {
            fullname: fullname,
            phone: phone,
            birthday: birthday,
            sex: sex,
            country: country,
            address: address,
        })
            .then(result => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You update profile success!',
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You update profile faild!',
                })
            })
    },
}

module.exports = ProfileController