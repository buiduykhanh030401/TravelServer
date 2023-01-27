const Posts = require('../models/Posts')
const mongoose = require('mongoose')
const Func = require('../../func')


const PostsController = {
    index(req, res) {
        res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to keep going into Posts!'
        })
    },
    //  /store
    store(req, res) {
        const { id, username } = req.user
        const { address, content } = req.posts
        const images = req.keys

        const posts = new Posts({
            username: username,
            address: address,
            content: content,
            images: images,
        })

        posts.save()
            .then(() => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You have successfully posted!',
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                    err: err
                })
            })
    },
    // /show/new
    new(req, res) {
        Posts.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'username',
                    foreignField: 'username',
                    as: 'profile',
                }
            }
        ])
            .sort({ createdAt: -1 })
            .then(result => {
                Func.SimpleArrayPhotos(req, result)
                Func.SimpleProfileInPosts(req, result)
                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You retrieved the latest posts successfully!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                    err: err
                })
            })
    },
    // /show/hot
    hot(req, res) {
        Posts.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'username',
                    foreignField: 'username',
                    as: 'profile',
                }
            }
        ])
            .sort({ like: -1 })
            .then(result => {
                Func.SimpleArrayPhotos(req, result)
                Func.SimpleProfileInPosts(req, result)
                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You retrieved the hottest articles successfully!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                    err: err
                })
            })
    },
    // /like/:pid -> id
    like(req, res) {
        const { id, username } = req.user
        const { pid } = req.params
        // tim kiem
        Posts.findById(pid)
            .then(posts => {
                const isLike = posts.likes.some(e => e === username)
                if (!isLike) {
                    Posts.findByIdAndUpdate(pid, {
                        $inc: {
                            like: 1
                        },
                        $push: {
                            likes: username
                        }
                    })
                        .then(() => {
                            res.status(200).json({
                                code: 0,
                                status: true,
                                msg: 'You liked the post successfully!',
                            })
                        })
                        .catch(err => {
                            return res.status(500).json({
                                code: 0,
                                status: false,
                                msg: 'There is a problem with the system, please try again later!',
                                err: err
                            })
                        })
                } else {
                    Posts.findByIdAndUpdate(pid, {
                        $inc: {
                            like: -1
                        },
                        $pull: {
                            likes: username
                        }
                    })
                        .then(() => {
                            res.status(200).json({
                                code: 0,
                                status: true,
                                msg: 'You disliked the post successfully!',
                            })
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
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                })
            })
    },
    // comment ++
    comment(req, res) {
        const object = req.object
        Posts.findByIdAndUpdate(object.object_id, {
            $inc: {
                comment: 1
            }
        })
        .then().catch()
    }
}

module.exports = PostsController