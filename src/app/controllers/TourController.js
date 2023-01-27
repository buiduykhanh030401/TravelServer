
const Tour = require('../models/Tour')
const slug = require('slug')
const Func = require('../../func')

const TourController = {
    // [GET] /tour
    index(req, res) {
        return res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to go on!',
        })
    },

    // [POST] /tour/store
    store(req, res, next) {
        // upload photos
        const tour = new Tour({
            username: req.user.username,
            title: req.tour.title,
            description: req.tour.description,
            price: req.tour.price,
            sale: req.tour.sale,
            area_slug: req.tour.area_slug,
            images: req.keys,
            time_start: req.tour.time_start,
            time_end: req.tour.time_end,
            address_start: req.tour.address_start,
            address_end: req.tour.address_end,
            schedule: req.tour.schedule,
            slug: slug(req.tour.title) + '-' + Date.now()
        })

        tour.save()
            .then(tour => {
                req.tour_id = tour._id
                next()
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

    // [GET] ~/service/:username/:limit/:skip
    forUsername(req, res) {
        const { username } = req.params
        const { limit, skip } = req.params
        const url = req.protocol + '://' + req.get('host') + `/api/v1/tour/${username}/${limit}/${parseInt(skip) + parseInt(limit)}`
        Tour.find({
            username: username
        }).limit(limit).skip(skip)
            .then(result => {
                Func.SimpleArrayPhotos(req, result)
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You successfully retrieved tour data.',
                    next: url,
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: true,
                    msg: 'You have failed to retrieve tour data!',
                    err: err
                })
            })
    },

    // [GET] /tour/show/all/:limit/:skip
    all(req, res) {
        const { limit, skip } = req.params
        const url = req.protocol + '://' + req.get('host') + `/api/v1/tour/show/all/${limit}/${parseInt(skip) + parseInt(limit)}`

        Tour.find({
            time_start: {
                $gte: new Date(),
            }
        }).limit(limit).skip(skip)
            .then(result => {
                Func.SimpleArrayPhotos(req, result)
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You get all tour success!',
                    next: url,
                    data: result,
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You get all tour faild!',
                    err: err,
                })
            })
    },

    // [GET] /tour/show/last-tour/:distance | 5
    lastTour(req, res) {
        const day = Func.BetweenTwoDays.nextDays(Date.now(), req.distance)

        Tour.find({
            $and: [
                {
                    time_start: {
                        $lte: day,
                    }
                },
                {
                    time_start: {
                        $gte: new Date(),
                    }
                }
            ]
        })
            .then(result => {
                Func.SimpleArrayPhotos(req, result)
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You get last tour near now success!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You get last tour near now faild!',
                    err: err
                })
            })
    },

    // [GET] /tour/show/details/:slug
    details(req, res) {
        Tour.findOne({
            slug: req.slug
        })
            .then(result => {
                result = [result]
                Func.SimpleArrayPhotos(req, result)
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You get details tour success!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: true,
                    msg: 'You get details tour faild!',
                    err: err
                })
            })
    },

    // [GEt] /tour/show/all/area/:slug
    forArea(req, res) {
        Tour.find({
            $and: [
                {
                    area_slug: req.slug
                },
                {
                    time_start: {
                        $gte: new Date(),
                    }
                }
            ]
        })
            .then(result => {
                Func.SimpleArrayPhotos(req, result)
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You get tour for area success!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: true,
                    msg: 'You get tour for area faild!',
                    err: err
                })
            })
    },

    // [GET] /tour/show/all/search/:keyword
    search(req, res) {
        Tour.find({
            $and: [
                {
                    $text: {
                        $search: req.keyword
                    },
                },
                {
                    time_start: {
                        $gte: new Date(),
                    }
                }
            ]
        })
            .then(result => {
                Func.SimpleArrayPhotos(req, result)
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You search tour success!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You search tour faild!',
                    err: err
                })
            })
    },
    // [PUT] ~/update/:tid -> info 
    update(req, res) {
        const { id, username } = req.user
        const tid = req.tid

        Tour.findByIdAndUpdate(tid, {
            $set: {
                title: req.tour.title,
                description: req.tour.description,
                price: req.tour.price,
                sale: req.tour.sale,
                area_slug: req.tour.area_slug,
                time_start: req.tour.time_start,
                time_end: req.tour.time_end,
                address_start: req.tour.address_start,
                address_end: req.tour.address_end,
                schedule: req.tour.schedule,
                slug: slug(req.tour.title) + '-' + Date.now(),
            }
        })
            .then(() => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You have successfully updated the service!',
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
    // [PUT] ~/update/:tid/photos
    // updatePhotos(req, res) {

    // }
}

module.exports = TourController