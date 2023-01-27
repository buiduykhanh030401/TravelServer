const Service = require("../models/Service")
const mongoose = require('mongoose')
const { json } = require("express")

const ServiceMiddleware = {
    // ~/:tid
    validServiceAndTour(req, res, next) {
        const { tid } = req.params
        const { id, username } = req.user

        if (!tid) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Data cannot be empty!',
            })
        }

        // check server
        Service.findOne({
            username: username
        })
            .then(result => {

                if (!result) {
                    return res.status(502).json({
                        code: 0,
                        status: false,
                        msg: 'The user has not subscribed to any service, please try again later!',
                    })
                }
                const { services } = result

                if (services.some(sv => sv.tour_id.equals(mongoose.Types.ObjectId(tid)))) {
                    req.tid = mongoose.Types.ObjectId(tid)
                    next()
                } else {
                    return res.status(502).json({
                        code: 0,
                        status: false,
                        msg: 'Your service has not been added to the system, please try again later!',
                    })
                }
            })
    }
}

module.exports = ServiceMiddleware