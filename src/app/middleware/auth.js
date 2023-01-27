const jwt = require('jsonwebtoken')
const emailValidator = require('deep-email-validator');
const nodemailer = require('nodemailer');

const auth = {
    // verify token
    verifyToken(req, res, next) {
        const token = req.headers.token
        if (token) {
            // Cuns 12345 | key[Cuns], token[12345]
            const key = token.split(" ")[0]
            if (key !== 'Travel') return res.status(403).json({
                code: 0,
                status: false,
                msg: 'Key in not invalid!'
            })
            // token
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) return res.status(403).json({
                    code: 0,
                    status: false,
                    msg: 'The token is invalid or has expired. Please try again!',
                    err: err
                })
                req.user = user
                next()
            })
        }
        else {
            return res.status(401).json({
                code: 0,
                status: false,
                msg: 'You not authenticated!',
            })
        }
    },

    // verify token admin and current user
    verifyTokenUserAndAdminAuth(req, res, next) {
        const role = 'Admin'
        const username = req.params.username
        const uid = req.body.user_id
        const user_id = req.headers.user_id
        const _id = req.headers._id

        auth.verifyToken(req, res, () => {
            if (req.user.username === username || req.user.permissions === role || req.user.id === uid || req.user.id === _id || req.user.id === user_id) {
                next()
            } else {
                return res.status(403).json({
                    code: 0,
                    status: false,
                    msg: 'You do not have permission to perform this operation!',
                })
            }
        })
    },

    // verify permission admin
    verifyAdminAuth(req, res, next) {
        auth.verifyToken(req, res, () => {
            if (req.user.permissions === 'Admin') {
                next()
            } else {
                return res.status(403).json({
                    code: 0,
                    status: false,
                    msg: 'You do not have permission to perform this operation!'
                })
            }
        })
    },

    // verify permission super
    verifySuperAuth(req, res, next) {
        auth.verifyToken(req, res, () => {
            if (req.user.permissions === 'Super') {
                next()
            } else {
                return res.status(403).json({
                    code: 0,
                    status: false,
                    msg: 'You do not have permission to perform this operation!'
                })
            }
        })
    },

    // verify permission user
    verifyUserAuth(req, res, next) {
        const username = req.params.username
        const uid = req.body.user_id
        const user_id = req.headers.user_id
        const _id = req.headers._id
        auth.verifyToken(req, res, () => {
            if (req.user.username === username || req.user.id === uid || req.user.id === _id || req.user.id === user_id) {
                next()
            } else {
                return res.status(403).json({
                    code: 0,
                    status: false,
                    msg: 'You do not have permission to perform this operation!'
                })
            }
        })
    },
}

module.exports = auth