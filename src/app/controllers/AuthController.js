
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const TokenController = require('./TokenController')

const Auth = {
    generateAccessToken(user) {
        return jwt.sign({
            id: user.id,
            username: user.username,
            permissions: user.permissions,
        },
            process.env.JWT_ACCESS_KEY, {
            expiresIn: "365d"
        })
    },
    generateRefreshToken(user) {
        return jwt.sign({
            id: user.id,
            username: user.username,
            permissions: user.permissions,
        },
            process.env.JWT_REFRESH_KEY, {
            expiresIn: "365d"
        })
    },
    // [POST] ~/auth/register
    async register(req, res) {
        const salt = await bcrypt.genSalt(10)
        const hashpass = await bcrypt.hash(req.body.password, salt)

        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashpass,
        })

        user.save()
            .then(user => {
                const { password, _id, __v, createdAt, updatedAt, ...others } = user._doc;
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Register success!',
                    data: {
                        ...others,
                    }
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: true,
                    msg: 'Register faild!',
                    err: err
                })
            })
    },

    // [POST] ~/auth/login
    login(req, res) {
        // clear token old
        res.clearCookie('refreshToken')
        const oldToken = req.cookies.refreshToken
        oldToken && TokenController.delete(oldToken)

        // login
        User.findOne({
            username: req.body.username,
        })
            .then(async user => {
                if (!user) {
                    return res.status(404).json({
                        code: 0,
                        status: false,
                        msg: 'Username is no valid!'
                    })
                }

                const validPassword = await bcrypt.compare(req.body.password, user.password)

                if (!validPassword) {
                    return res.status(404).json({
                        code: 0,
                        status: false,
                        msg: 'Password is no valid!'
                    })
                }

                if (user && validPassword) {
                    const accessToken = Auth.generateAccessToken(user)
                    const refreshToken = Auth.generateRefreshToken(user)

                    // save token
                    TokenController.store(refreshToken)

                    // refresh token to cookie
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: false,
                        path: '/',
                        sameSite: 'strict',
                    })

                    const { password, __v, createdAt, updatedAt, ...others } = user._doc;
                    return res.status(200).json({
                        code: 0,
                        status: true,
                        msg: 'Login success!',
                        data: {
                            ...others,
                            accessToken,
                        }
                    })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'Login faild!',
                    err: err
                })
            })
    },
    // [POST] ~/auth/logout
    logout(req, res) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(404).json({
            code: 0,
            status: false,
            msg: 'You not athenticated, not refreshToken!'
        })
        // check refreshToken in db
        if (!TokenController.find(refreshToken)) {
            return res.status(403).json({
                code: 0,
                status: false,
                msg: 'Refresh TokenController in not valid!'
            })
        }
        try {
            res.clearCookie('refreshToken')
            TokenController.delete(req.cookies.refreshToken)
            // refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken)
            return res.status(200).json({
                code: 0,
                status: true,
                msg: 'Logout success!'
            })
        } catch (error) {
            return res.status(500).json({
                code: 0,
                status: false,
                msg: 'Logout faild!',
                err: error
            })
        }

    },
    // [POST] ~/auth/refresh
    refresh(req, res) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(404).json({
            code: 0,
            status: false,
            msg: 'You not athenticated!'
        })

        // check refreshToken
        if (!TokenController.find(refreshToken)) {
            return res.status(403).json({
                code: 0,
                status: false,
                msg: 'Refresh TokenController in not valid!'
            })
        }

        // verify refreshToken
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {

            // delete token old
            TokenController.delete(refreshToken)
            // refreshTokens = refreshTokens.filter(token => token !== refreshToken)

            const newAccessToken = Auth.generateAccessToken(user)
            const newRefreshToken = Auth.generateRefreshToken(user)

            // save refresh token
            TokenController.store(newRefreshToken)

            // refresh refreshToken to store
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            })
            return res.status(200).json({
                code: 0,
                status: false,
                msg: 'Refresh Token success!',
                data: {
                    accessToken: newAccessToken
                }
            })
        })
    },

    // ------------------

    // [GET] ~/auth/user/show/all
    all(req, res, next) {
        User.find()
            .then(users => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You get all user success!',
                    data: users
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'You get all user faild!',
                    err: err
                })
            })
    },
    // [GET] ~/auth/user/show/all
    details(req, res) {
        User.findOne({
            username: req.params.username
        })
            .then(user => {
                const { password, ...others } = user._doc;
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You get details user success!',
                    data: {
                        ...others
                    }
                })
            })
            .catch(err => {
                return res.status(404).json({
                    code: 0,
                    status: false,
                    msg: 'You do not have permission to perform this operation!',
                    err: err
                })
            })
    },

    // [DELETE] ~/auth/user/delete
    delete(req, res, next) {
        User.findById(req.params.id)
            .then(user => res.status(200).json({ auth: 'admin', msg: 'Delete user successfully!' }))
            .catch(next)
    },
}

module.exports = Auth