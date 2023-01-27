const Verify = require('../models/Verify')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const verifyTemplate = require('../mail/verify.js')


const VerifyController = {
    // [GET] ~/verify
    index(req, res) {
        return res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to go on!',
        })
    },

    // [PUT] save token otp to db
    store(req, res) {
        const body = req.otps.body

        Verify.findOne({
            body: body
        })
            .then(result => {
                if (!result) {
                    VerifyController.create(req, res)
                } else {
                    // reset verify
                    VerifyController.reset(req, res, result)
                }
            })
            .catch(() => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'An incident has occurred. Please try again!',
                })
            })
    },

    // [PUT] ~/validation
    updateStatus(req, res) {
        Verify.findByIdAndUpdate(req.verify._id, {
            status: true
        })
            .then(() => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You have successfully submitted verification!',
                })
            })
            .catch(() => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'An incident has occurred. Please try again!',
                })
            })
    },

    // new verify
    create(req, res) {
        const tokenVerifyOTP = VerifyController.generateOTPToken(req.otps)

        const verify = new Verify({
            status: false,
            body: req.otps.body,
            token: tokenVerifyOTP,
        })
        verify.save()
            .then(result => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You have sent OTP successfully. Please enter the OTP to complete the authentication!',
                    data: {
                        otp_id: result._id
                    }
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There was a problem sending the OTP. Please try again!',
                })
            })
    },

    // reset verify
    reset(req, res, result) {
        const tokenVerifyOTP = VerifyController.generateOTPToken(req.otps)
        Verify.findByIdAndUpdate(result._id, {
            status: false,
            token: tokenVerifyOTP,
        })
            .then(result => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You have sent OTP successfully. Please enter the OTP to complete the authentication!',
                    data: {
                        otp_id: result._id
                    }
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There was a problem sending the OTP. Please try again!',
                })
            })
    },

    // token - otp - 5 phút
    generateOTPToken(otps) {
        return jwt.sign({
            otp: otps.otp,
            body: otps.body,
        },
            process.env.OTP_ACCESS_KEY, {
            expiresIn: "3m"
        })
    },

    // emaiil
    storeEmail(req, res, next) {
        const body = req.otps.body

        Verify.findOne({
            body: body
        })
            .then(result => {
                if (!result) {
                    const tokenVerifyOTP = VerifyController.generateOTPToken(req.otps)

                    const verify = new Verify({
                        status: false,
                        body: body,
                        token: tokenVerifyOTP,
                    })
                    verify.save()
                        .then(result => {
                            req.otp_id = result._id
                            next()
                        })
                        .catch(err => {
                            return res.status(500).json({
                                code: 0,
                                status: false,
                                msg: 'There was a problem sending the OTP. Please try again!',
                            })
                        })
                } else {
                    // reset verify
                    const tokenVerifyOTP = VerifyController.generateOTPToken(req.otps)
                    Verify.findByIdAndUpdate(result._id, {
                        status: false,
                        token: tokenVerifyOTP,
                    })
                        .then(result => {
                            req.otp_id = result._id
                            next()
                        })
                        .catch(err => {
                            return res.status(500).json({
                                code: 0,
                                status: false,
                                msg: 'There was a problem sending the OTP. Please try again!',
                            })
                        })
                }
            })
            .catch(() => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'An incident has occurred. Please try again!',
                })
            })
    },

    sendOTPEmail(req, res) {
        const link_verify = `${req.protocol}://${req.get('host')}/api/v1/verify/validation/email/${req.otps.otp}/${req.otp_id}`

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            }
        });

        const mailOptions = {
            from: `BKK Travels <${process.env.MAIL_USERNAME}>`,
            to: req.otps.body,
            subject: 'BKK Travels Verify Email',
            html: verifyTemplate(link_verify, req.otps.otp),
        };

        transporter.sendMail(mailOptions)
            .then(() => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Please visit email to verify!',
                })
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There was a problem sending the OTP. Please try again!',
                    err: err
                })
            })
    }
}

module.exports = VerifyController