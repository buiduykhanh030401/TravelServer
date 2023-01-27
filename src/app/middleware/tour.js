const axios = require('axios').default;

const Tour = {
    store(req, res, next) {
        const title = req.body.title
        const description = req.body.description
        const price = req.body.price
        const sale = req.body.price
        const area_slug = req.body.area_slug
        const time_start = req.body.time_start
        const time_end = req.body.time_end
        const address_start = req.body.address_start
        const address_end = req.body.address_end
        const schedule = req.body.schedule


        if (!title || !description || !price || !sale || !area_slug || !time_start
            || !time_end || !address_start || !address_end || !schedule) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Data cannot be empty!',
            })
        }
        if (isNaN(price)) {
            return res.status(200).json({
                code: 0,
                status: false,
                msg: 'Value price is not valid',
            })
        }

        req.tour = {
            title,
            description,
            price,
            sale,
            area_slug,
            time_start,
            time_end,
            address_start,
            address_end,
            schedule: JSON.parse(schedule),
        }
        next()
    },
    lastTour(req, res, next) {
        const distance = req.params.distance
        if (!distance) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'value is not exist!',
            })
        }
        if (isNaN(distance)) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'value is not number!',
            })
        }
        if (distance <= 0) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'value is not valid!',
            })
        }

        req.distance = distance
        next()
    },
    slug(req, res, next) {
        const slug = req.params.slug
        if (!slug) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'value is not exist!',
            })
        }

        req.slug = slug
        next()
    },
    keyword(req, res, next) {
        const keyword = req.params.keyword
        if (!keyword) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'value is not exist!',
            })
        }

        req.keyword = '\"' + keyword + '\"'
        // req.keyword = keyword
        next()
    },
    limitskip(req, res, next) {
        const limit = req.params.limit
        const skip = req.params.skip

        if (!limit || !skip) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'value is not exist!',
            })
        }
        if (isNaN(limit) || isNaN(skip)) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'value is not char!',
            })
        }

        req.limit = limit
        req.skip = skip
        next()
    },
}

module.exports = Tour