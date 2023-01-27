
const slug = require('slug')

const EventMiddleware = {

    // [GET] /show/all/limit/skip
    all(req, res, next) {
        const limit = req.params.limit
        const skip = req.params.skip

        if (isNaN(limit)) {
            return res.status(401).json({
                code: 0,
                status: false,
                msg: 'limit in not number',
            })
        }
        if (isNaN(skip)) {
            return res.status(401).json({
                code: 0,
                status: false,
                msg: 'skip in not number',
            })
        }

        if (!limit || limit <= 0 || limit > 20) {
            return res.status(401).json({
                code: 0,
                status: false,
                msg: 'limit in not valid',
            })
        }
        if (!skip || skip < 0) {
            return res.status(401).json({
                code: 0,
                status: false,
                msg: 'skip in not valid',
            })
        }
        next()
    },

    // [GET] /show/details/:slug
    details(req, res, next) {
        const key_slug = req.params.slug

        if (!key_slug) {
            return res.status(401).json({
                code: 0,
                status: false,
                msg: 'slug in not valid',
            })
        }

        req.params.slug = slug(key_slug)
        next()
    },

    // [GET] /show/all/location?diameter=50&longitude=?&latitude=?&limi=?&skip=?
    getEventLocationRadius(req, res, next) { // 50KM - 0.4494 : 0.8985
        const diameter = req.query.diameter
        const longitude = req.query.longitude
        const latitude = req.query.latitude
        const limit = req.query.limit
        const skip = req.query.skip

        if (isNaN(diameter) || isNaN(longitude) || isNaN(latitude) || isNaN(limit) || isNaN(skip)) {
            return res.status(401).json({
                code: 0,
                status: false,
                msg: 'value in not number',
            })
        }

        if (diameter <= 0 || longitude <= 0 || latitude <= 0 || limit <= 0 || skip < 0 || diameter > 100 || limit > 50) {
            return res.status(401).json({
                code: 0,
                status: false,
                msg: 'value in not valide',
            })
        }

        const longitude_max = parseFloat(longitude) + parseFloat(((diameter / 50) * 0.4494).toFixed(5))
        const longitude_min = parseFloat(longitude) - parseFloat(((diameter / 50) * 0.4494).toFixed(5))
        const latitude_max = parseFloat(latitude) + parseFloat(((diameter / 50) * 0.8985).toFixed(5))
        const latitude_min = parseFloat(latitude) - parseFloat(((diameter / 50) * 0.8985).toFixed(5))

        req.location = {
            diameter,
            limit,
            skip,
            longitude,
            latitude,
            longitude_max,
            longitude_min,
            latitude_max,
            latitude_min,
        }
        next()
    }
}

module.exports = EventMiddleware