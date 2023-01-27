const Tour = require('../models/Tour')

const CartMiddleware = {
    validId(req, res, next) {
        const tid = req.params.tid

        if (!tid) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Data cannot be empty or not valid!',
            })
        }

        Tour.findById(tid)
            .then(result => {
                if (result) {
                    req.tid = tid
                    next()
                } else {
                    return res.status(404).json({
                        code: 0,
                        status: false,
                        msg: 'Service does not exist, please try again later',
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There was a problem with the system, please try again!',
                    err: err
                })
            })
    }
}

module.exports = CartMiddleware