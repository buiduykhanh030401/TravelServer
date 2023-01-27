

const PostsMiddleware = {
    store(req, res, next) {
        const { address, content } = req.body
        const photos = req.files

        if (!content) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Data cannot be empty or not valid!',
            })
        }


        if (!photos || photos.length === 0) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Image cannot be blank!',
            })
        }

        var AR = ''
        if (address) {
            AR = address
        }

        req.posts = {
            address: AR,
            content: content,
        }
        next()
    }
}

module.exports = PostsMiddleware