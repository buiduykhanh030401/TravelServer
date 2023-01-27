const Permission = require('../models/Permission')

const PermissionController = {
    // [GET/POST] /
    index(req, res) {
        res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need a permission something to go on!'
        })
    },

    // [POST] /store
    store(req, res) {
        const permission = new Permission({
            title: req.permission.title,
            roles: req.permission.roles,
            description: req.permission.description,
        })

        permission.save()
            .then(() => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You insert permission successfully!',
                })
            })
            .catch(err => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You insert permission failde!',
                    err: err
                })
            })
    }
    // 
}

module.exports = PermissionController