


const SiteMiddleware = {
    photos(req, res, next) {
        const slug = req.params.slug
        if (!slug) {
            return res.status(500).json({
                code: 0,
                status: false,
                msg: 'value is not exist!',
            })
        }

        const types = ['jpeg', 'jpg', 'jpe', 'jif', 'png', 'apng', 'avif', 'gif', 'jfif', 'pjpeg', 'pjp', 'svg', 'webp', 'bmp',
            'ico', 'cur', 'tif', 'tiff', 'avif']
        const type = slug.split('.')[1]
        if (!type) {
            return res.status(500).json({
                code: 0,
                status: false,
                msg: 'Type is not exist!',
            })
        }
        if (!types.includes(type)) {
            return res.status(500).json({
                code: 0,
                status: false,
                msg: 'Type is not valid!',
            })
        }

        next()
    },
    photosMongodb(req, res, next) {
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
    }
}

module.exports = SiteMiddleware