

const CommentMiddleware = {
    store(req, res, next) {
        const { id, username } = req.user
        const { object_id, parent_id, reply, content } = req.body

        if (!content) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Data cannot be empty or not valid!',
            })
        }

        req.comment = {
            object_id: object_id,
            parent_id: parent_id ? parent_id : null,
            reply: reply ? reply : '',
            content: content,
        }
        next()
    }
}

module.exports = CommentMiddleware