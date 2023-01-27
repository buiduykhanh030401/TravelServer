const Area = require('../models/Area')
const slug = require('slug')
const Func = require('../../func')

const AreaController = {
    index(req, res) {
        res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to go on!'
        })
    },

    // [GET] /show/all
    all(req, res) {
        Area.find()
            .then(result => {
                Func.SimpleArrayPhotos(req, result)
                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Get all area successfully!',
                    data: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'Get all area failed!',
                    err: err
                })
            })
    },

    // [GET] /show/details/:slug
    details(req, res) {
        Area.findOne({
            slug: req.params.slug
        })
            .then(result => {
                result = [result]
                Func.SimpleArrayPhotos(req, result)
                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Get details area success!',
                    data: result
                })
            })
            .catch(err => {
                res.status(404).json({
                    code: 0,
                    status: false,
                    msg: 'Get details area failed!',
                    err: err
                })
            })
    },

    // [GET] /show/all/:type
    type(req, res) {
        Area.find({
            type: req.params.type
        })
            .then(result => {
                Func.SimpleArrayPhotos(req, result)
                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Get all area type region success!',
                    data: result
                })
            })
            .catch(err => {
                res.status(404).json({
                    code: 0,
                    status: false,
                    msg: 'Get all type region area failed!',
                    err: err
                })
            })
    },

    // [POST] /store
    store(req, res) {

        const area = new Area({
            title: req.body.title,
            region: req.body.region,
            type: slug(req.body.region),
            slug: slug(req.body.title),
            images: req.keys
        })

        area.save()
            .then(area => {
                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Insert area successfully!',
                    data: area
                })
            })
            .catch(err => {
                res.status(404).json({
                    code: 0,
                    status: false,
                    msg: 'Insert area failed!',
                    err: err
                })
            })
    },

    // [DELETE] /delete/:slug
    delete(req, res) {
        Area.findOneAndDelete({
            slug: req.params.slug
        })
            .then(area => {
                if (!area) {
                    return res.status(404).json({
                        code: 0,
                        status: false,
                        msg: 'Delete area failed!',
                        data: area
                    })
                }

                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Delete area successfully!',
                    data: area
                })
            })
            .catch(err => {
                res.status(404).json({
                    code: 0,
                    status: false,
                    msg: 'Delete area failed!',
                    err: err
                })
            })
    },

    // [PUT] /update/:slug
    update(req, res) {
        Area.findOneAndUpdate({
            slug: req.params.slug
        }, {
            title: req.body.title,
            region: req.body.region,
            type: slug(req.body.region),
            slug: slug(req.body.title),
        })
            .then(area => {
                if (!area) {
                    return res.status(404).json({
                        code: 0,
                        status: false,
                        msg: 'Update area failed!',
                        data: area
                    })
                }

                res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Update area successfully!',
                    data: area
                })
            })
            .catch(err => {
                res.status(404).json({
                    code: 0,
                    status: false,
                    msg: 'Update area failed!',
                    err: err
                })
            })
    },
}

module.exports = AreaController

// updateMany({}, {
//     $unset: { image: 1 }
// }, { multi: true })