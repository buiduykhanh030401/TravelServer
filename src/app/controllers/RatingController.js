
const Rating = require('../models/Rating')
const mongoose = require('mongoose')
const Func = require('../../func')

const RatingController = {
    // [GET] /rating
    index(req, res) {
        return res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to go on!',
        })
    },

    // [POST] ~/rating/store
    store(req, res) {
        const { id, username } = req.user
        const { parent_id, content, rate } = req.body
        const rating = new Rating({
            username: username,
            parent_id: parent_id,
            content: content,
            rate: rate,
        })

        rating.save()
            .then(result => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You rating success!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You rating faild!',
                    err: err
                })
            })
    },

    // [GET] ~/rating/show/:parent_id
    show(req, res) {
        const { parent_id } = req.params
        console.log(parent_id);
        Rating.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'username',
                    foreignField: 'username',
                    as: 'profile',
                }
            },
            {
                $match: {
                    parent_id: mongoose.Types.ObjectId(parent_id)
                }
            }
        ])
            .then(result => {
                const avg = RatingController.funcAverageRating(result)
                Func.SimpleProfileInPosts(req, result)
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You show rating success!',
                    data: {
                        avg: avg,
                        ratings: [...result]
                    }
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You show rating faild!',
                    err: err
                })
            })
    },

    funcAverageRating(result) {
        let rate = 0
        result.forEach(e => {
            rate += e.rate
        });
        return rate / result.length
    },
}

module.exports = RatingController
