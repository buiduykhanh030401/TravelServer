const validatePhoneNumber = require('validate-phone-number-node-js');
const jwt = require('jsonwebtoken')
const emailValidator = require('deep-email-validator');


const axios = require('axios');
const apiURL = 'https://phonevalidation.abstractapi.com/v1/'
const apiKey = process.env.ABSTRACT_API_KEY;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);

const Verify = require('../models/Verify')


const MiddlewareVerify = {
    // phone
    VALIDATION_NPM(req, res, next) {
        const result = validatePhoneNumber.validate('0326447480');
        console.log(result);
    },
    VALIDATION_ABSTRACT(req, res, next) {
        axios.get(`${apiURL}?api_key=${apiKey}&phone=840326447480`)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    },
    SMS_TWILIO(req, res, next) {
        const OTP = MiddlewareVerify.GENERATE_OTP()
        const msgOTP = `CUNS: Your OTP ${OTP} is valid for 3 minutes, use for authentication. For security reasons, please do not give this OTP to anyone. Best regards!`

        const { phoneNumber } = req.phoneValidation //'+84326447480'
        client.messages
            .create({
                body: msgOTP,
                messagingServiceSid: serviceSid,
                to: phoneNumber
            })
            .then(message => {
                req.otps = {
                    otp: OTP,
                    body: message.to
                }
                next()
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'Something went wrong, please try again!',
                })
            })
    },
    VALIDATION_TWILIO(req, res, next) {
        const { phone } = req.body

        if (!phone) {
            return res.status(404).json({
                code: 0,
                status: false,
                msg: 'Your phone number does not exist!',
            })
        }

        client.lookups.v1.phoneNumbers(phone)
            .fetch()
            .then(result => {
                result.valid = true
                req.phoneValidation = result
                next()
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'Your phone number is not valid, please try again later!',
                })
            })
    },
    GENERATE_OTP() {
        let OTP = 0
        do {
            OTP = (Math.random() * 1000000).toFixed(0)
        } while (OTP < 100000);
        return OTP
    },
    VERIFY_TOKEN_OTP(req, res, next) {
        let otp = req.body.otp
        let otp_id = req.body.otp_id
        if(!otp) {
            otp = req.params.otp
        }
        if(!otp_id) {
            otp_id = req.params.otp_id
        }

        Verify.findById(otp_id)
            .then(result => {
                if (!result) {
                    return res.status(501).json({
                        code: 0,
                        status: false,
                        msg: 'OTP information is not exists!',
                    })
                }
                // verify token
                jwt.verify(result.token, process.env.OTP_ACCESS_KEY, (err, OTPToken) => {
                    if (err) return res.status(403).json({
                        code: 0,
                        status: false,
                        msg: 'The token is invalid or has expired. Please try again!',
                        err: err
                    })
                    // verify otp
                    if (OTPToken.otp === otp) {
                        req.verify = result
                        next()
                    } else {
                        return res.status(404).json({
                            code: 0,
                            status: false,
                            msg: 'Invalid OTP code. Please try again!',
                        })
                    }
                })

            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'Something went wrong, please try again!',
                })
            })
    },

    // email
    VERIFY_EMAIL(req, res, next) {
        const { email } = req.body

        emailValidator.validate(email)
            .then(result => {
                const { valid, reason, validators } = result
                if (!valid) {
                    return res.status(400).json({
                        code: 0,
                        status: false,
                        msg: 'Please provide a valid email address!',
                        reason: validators[reason].reason
                    })
                }
                next()
            })
            .catch(err => {
                return res.status(400).json({
                    code: 0,
                    status: false,
                    msg: 'Please provide a valid email address!',
                    err: err
                })
            })
    },
    VERIFY_EMAIL_OTP(req, res, next) {
        const { email } = req.body
        const OTP = MiddlewareVerify.GENERATE_OTP()
        req.otps = {
            otp: OTP,
            body: email
        }
        next()
    },
}

module.exports = MiddlewareVerify

// client.messages
//     .create({ body: 'Hi there', from: process.env.TWILIO_PHONE_NUMBER, to: '+84326447480' })
//     .then(message => console.log(message.sid));

// {
//     callerName: null,
//     countryCode: 'VN',
//     phoneNumber: '+84375116408',
//     nationalFormat: '0375 116 408',
//     carrier: null,
//     addOns: null,
//     url: 'https://lookups.twilio.com/v1/PhoneNumbers/+84375116408'
//   }

// {
//     phone: '840326447480',
//     valid: true,
//     format: { international: '+84326447480', local: '0326 447 480' },
//     country: { code: 'VN', name: 'Viet Nam', prefix: '+84' },
//     location: 'Vietnam',
//     type: 'mobile',
//     carrier: 'Viettel Mobile'
//   }


// {
//     body: 'CUNS: Your OTP: 387988 is valid for 5 minutes, use for authentication. For security reasons, please do not give this OTP to anyone. Best regards!',
//     numSegments: '0',
//     direction: 'outbound-api',
//     from: null,
//     to: '+84326447480',
//     dateUpdated: 2022-10-29T09:35:35.000Z,
//     price: null,
//     errorMessage: null,
//     uri: '/2010-04-01/Accounts/AC0a0ca84d26c12c956d2538b12765bfeb/Messages/SM29de901d4f0ecae6431a1d86c5c8d181.json',
//     accountSid: 'AC0a0ca84d26c12c956d2538b12765bfeb',
//     numMedia: '0',
//     status: 'accepted',
//     messagingServiceSid: 'MG7cb2691e2d337a34ec358000578787e5',
//     sid: 'SM29de901d4f0ecae6431a1d86c5c8d181',
//     dateSent: null,
//     dateCreated: 2022-10-29T09:35:35.000Z,
//     errorCode: null,
//     priceUnit: null,
//     apiVersion: '2010-04-01',
//     subresourceUris: {
//       media: '/2010-04-01/Accounts/AC0a0ca84d26c12c956d2538b12765bfeb/Messages/SM29de901d4f0ecae6431a1d86c5c8d181/Media.json'
//     }
//   }