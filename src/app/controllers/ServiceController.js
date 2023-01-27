const Service = require("../models/Service")
const Tour = require('../models/Tour')
const Photos = require('../models/Photos')
const Rating = require('../models/Rating')


const ServiceController = {
    index(req, res) {
        return res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to go on API service!',
        })
    },
    // [PUT] ~/store
    store(req, res) {
        const { id, username } = req.user
        Service.findOne({
            user_id: id
        })
            .then(result => {
                if (!result) {
                    ServiceController.create(req, res)
                } else {
                    ServiceController.insert(req, res)
                }
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You have added the service to the system failed!',
                    err: err
                })
            })
    },
    create(req, res) {
        const { id, username } = req.user
        const service = new Service({
            user_id: id,
            username: username,
            services: [{
                tour_id: req.tour_id
            }],
        })
        service.save()
            .then(() => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You have successfully added the service to the system!',
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You have added the service to the system failed!',
                    err: err
                })
            })
    },
    insert(req, res) {
        const { id, username } = req.user
        Service.findOneAndUpdate({ user_id: id }, {
            '$push': {
                services: {
                    tour_id: req.tour_id,
                }
            }
        })
            .then(() => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You have successfully added the service to the system!',
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You have added the service to the system failed!',
                    err: err
                })
            })
    },
    // [GET] ~/:usernam -> khong dung toi
    forUsernme(req, res, next) {
        const { username } = req.params
        // Service.findOne({
        //     username: username
        // })
        // .then(result => {
        //     req.tours = result.services
        //     next()
        // })
        // .catch(err => {
        //     return res.status(500).json({
        //         code: 0,
        //         status: false,
        //         msg: 'You have failed to retrieve tour data!',
        //     })
        // })
    },
    // [DELETE] ~/delete
    delete(req, res) {
        const { id, username } = req.user
        const tid = req.tid

        // delete tour
        Tour.findByIdAndDelete(tid)
            .then(result => {
                const { images } = result
                // delete photos
                images.forEach(img => {
                    Photos.findOneAndDelete({
                        title: img
                    }).then().catch()
                })
                // delete rating
                Rating.deleteMany({
                    parent_id: tid
                }).then().catch()
                // delete tour in service
                Service.findOneAndUpdate({
                    username: username
                }, {
                    $pull: {
                        services: {
                            tour_id: tid
                        }
                    }
                })
                    .then(result => {
                        return res.status(200).json({
                            code: 0,
                            status: true,
                            msg: 'You have successfully removed the service from the system. Best regards!',
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
}

module.exports = ServiceController