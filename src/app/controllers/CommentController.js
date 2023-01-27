const Comment = require('../models/Comment')
const mongoose = require('mongoose')
const Func = require('../../func')

const CommentController = {
    index(req, res) {
        res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to keep going into Comment!'
        })
    },
    // [POST] ~/store
    store(req, res, next) {
        const { id, username } = req.user
        const { object_id, parent_id, reply, content } = req.comment

        const comment = new Comment({
            username: username,
            object_id: object_id,
            parent_id: parent_id,
            reply: reply,
            content: content,
        })

        comment.save()
            .then(result => {
                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You have commented successfully!',
                    data: result
                })
                req.object = result
                next()
            })
            .catch(err => {
                res.status(500).json({
                    code: 0,
                    status: true,
                    msg: 'There was a problem with the system, please try again!',
                    err: err
                })
            })
    },
    // [GET] ~/show/:object_id
    show(req, res) {
        const { object_id } = req.params

        Comment.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'username',
                    foreignField: 'username',
                    as: 'profile',
                }
            },
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'reply',
                    foreignField: 'username',
                    as: 'profileReply',
                }
            },
            {
                $match: {
                    object_id: mongoose.Types.ObjectId(object_id)
                }
            }
        ])
            .then(result => {
                if (result.length === 0) {
                    return res.status(200).json({
                        code: 0,
                        status: true,
                        msg: 'You successfully retrieved all comments!',
                        data: result
                    })
                } else {
                    Func.SimpleProfileInPosts(req, result)
                    return res.status(200).json({
                        code: 0,
                        status: true,
                        msg: 'You successfully retrieved all comments!',
                        data: result
                    })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                    err: err
                })
            })
    }
}

module.exports = CommentController