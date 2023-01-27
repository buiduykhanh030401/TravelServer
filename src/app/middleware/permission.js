

const Permission = {
    store(req, res, next) {
        const title = req.body.title
        if (!title) return res.status(404).json({
            code: 0,
            status: true,
            msg: 'Title is not valid!',
        })
        const roles = req.body.roles
        if (!roles) return res.status(404).json({
            code: 0,
            status: true,
            msg: 'Roles is not valid!',
        })
        const description = req.body.description
        if (!description) return res.status(404).json({
            code: 0,
            status: true,
            msg: 'Description is not valid!',
        })

        req.permission = {
            title,
            roles,
            description,
        }

        next()
    }
}

module.exports = Permission