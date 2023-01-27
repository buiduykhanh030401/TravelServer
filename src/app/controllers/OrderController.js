const Order = require('../models/Order')
const crypto = require('crypto')
const { default: axios } = require('axios')
const querystring = require('qs')
const moment = require('moment')
var sortObject = require('sort-object')
const Tour = require('../models/Tour')
const { default: mongoose } = require('mongoose')

const statusCodes = [
    {
        key: '00',
        value: 'Successful transaction'
    },
    {
        key: '02',
        value: 'Transaction failed due to: Customer cancels transaction'
    },
    {
        key: '07',
        value: 'Successful subtraction. Suspected transactions (related to fraud, unusual transactions)!'
    },
    {
        key: '09',
        value: `The transaction failed because: Customer's card/account has not registered for InternetBanking service at the bank!`
    },
    {
        key: '10',
        value: `The transaction failed due to: The customer did not verify the correct card/account information more than 3 times`
    },
    {
        key: '11',
        value: `Transaction failed due to: Expired pending payment. Please repeat the transaction`
    },
    {
        key: '12',
        value: `Transaction failed due to: Card/Customer's Account is locked.`
    },
    {
        key: '13',
        value: `The transaction failed because you entered the wrong password for transaction authentication (OTP). Please repeat the transaction.`
    },
    {
        key: '24',
        value: `Transaction failed due to: Customer cancels transaction`
    },
    {
        key: '51',
        value: `The transaction failed due to: Your account does not have enough balance to make the transaction.`
    },
    {
        key: '65',
        value: `The transaction failed due to: Your account has exceeded the daily transaction limit.`
    },
    {
        key: '75',
        value: `Payment bank is under maintenance.`
    },
    {
        key: '79',
        value: `Transaction failed due to: Customer entered wrong payment password more than specified number of times. Please repeat the transaction`
    },
    {
        key: '79',
        value: `Transaction failed due to: Customer entered wrong payment password more than specified number of times. Please repeat the transaction`
    },
]


const OrderController = {
    index(req, res) {
        res.status(200).json({
            code: 0,
            status: true,
            msg: 'You need something to keep going into Order!'
        })
    },

    // ~/checkout
    checkout(req, res, next) {
        const { username } = req.user
        const { type } = req.body
        const { oid } = req.params

        Order.findByIdAndUpdate(oid, {
            type: type
        })
            .then(result => {
                if (!result) {
                    return res.status(500).json({
                        code: 0,
                        status: false,
                        msg: 'There is a problem with the system, please try again later!',
                    })
                }
                req.order = result
                req.order.type = type
                next()
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                    err: err
                })
            })
    },
    // request
    requestCheckout(req, res) {
        const { type } = req.order

        switch (type) {
            case 'vnpay':
                OrderController.requesVnpay(req, res)
                break;
            default:
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                    err: err
                })
        }
    },
    // create
    create(req, res) {
        const { username } = req.user
        const { items } = req.body
        var _amount = 0
        const info = 'Thanh toán dịch vụ của BKK Travel'

        const ObjectIds = items.map(mongoose.Types.ObjectId)

        Tour.find({
            _id: {
                $in: ObjectIds
            }
        })
            .then(result => {
                result.map(e => {
                    _amount += e.sale
                })

                const order = new Order({
                    username: username,
                    info: info,
                    amount: _amount,
                    items: ObjectIds,
                })

                order.save()
                    .then(result => {
                        if (!result) {
                            return res.status(500).json({
                                code: 0,
                                status: false,
                                msg: 'There is a problem with the system, please try again later!',
                            })
                        }
                        return res.status(200).json({
                            code: 0,
                            status: true,
                            msg: 'Your order has been successfully placed!',
                            data: result
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            code: 0,
                            status: false,
                            msg: 'There is a problem with the system, please try again later!',
                            err: err
                        })
                    })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                    err: err
                })
            })
    },
    // show one
    showOne(req, res) {
        const { oid } = req.params

        Order.aggregate([
            {
                $lookup: {
                    from: "tours",
                    localField: "items",
                    foreignField: "_id",
                    as: "tours"
                }
            },
            {
                $lookup: {
                    from: "profiles",
                    localField: "username",
                    foreignField: "username",
                    as: "user"
                }
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(oid)
                }
            }
        ])
            .then(result => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'You successfully retrieved order data!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                    err: err
                })
            })
    },
    // show
    showAll(req, res) {
        const { username } = req.user

        Order.find({
            username: username
        }).sort({ createdAt: -1 })
            .then(result => {
                return res.status(200).json({
                    code: 0,
                    status: true,
                    msg: 'Your order has been successfully placed!',
                    data: result
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                    err: err
                })
            })
    },

    // ------------------------------- MOMO --------------------------------
    requestMomo(req, res) {
        const { _id, info, amount } = req.order
        const partnerCode = 'MOMOBKUN20180529'
        const requestId = 'f7a8f62f4234-0bba-405f-8178-1a516ea1fe3b'
        // const amount = amount
        const orderId = '1629181466064:0123456778'
        const orderInfo = 'Thanh toán qua ví MoMo'
        const redirectUrl = 'http://localhost/api/v1'
        const ipnUrl = 'http://localhost/api/v1'
        const requestType = 'captureWallet'
        const extraData = ''
        const lang = 'vi'

        // sha256
        const secret = 'momo';
        const data = 'amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType'
        const signature = crypto.createHmac('sha256', secret).update(data).digest('hex')

        axios.post('https://test-payment.momo.vn/v2/gateway/api/create', {
            partnerCode: partnerCode,
            requestType: requestType,
            ipnUrl: ipnUrl,
            redirectUrl: redirectUrl,
            orderId: orderId,
            amount: amount,
            lang: lang,
            orderInfo: orderInfo,
            requestId: requestId,
            extraData: extraData,
            signature: signature,
        })
            .then(result => {
                res.json({ result })
            })
            .catch(err => {
                res.json({ err })
            })
    },

    // ------------------------------- VNPAY --------------------------------
    requesVnpay(req, res) {
        const order = req.order

        // var ipAddr = req.headers['x-forwarded-for'] ||
        //     req.connection.remoteAddress ||
        //     req.socket.remoteAddress ||
        //     req.connection.socket.remoteAddress;
        var ipAddr = '127.0.0.1'//'14.160.87.124'


        var tmnCode = process.env.VNP_TMN_CODE
        var secretKey = process.env.VNP_SECRET_KEY
        var vnpUrl = process.env.VNP_URL
        var returnUrl = process.env.VNP_RETURN_URL

        var createDate = moment().format('yyyyMMDDHHmmss')
        // var orderId = moment().format('HHmmss')
        var orderId = order._id.toString()
        var amount = order.amount
        var bankCode = ''

        var orderInfo = order.info
        var orderType = 'other';
        var locale = req.body.language;
        if (!locale) {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        function sortObjectVNpay(obj) {
            var sorted = {};
            var str = [];
            var key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    str.push(encodeURIComponent(key));
                }
            }
            str.sort();
            for (key = 0; key < str.length; key++) {
                sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
            }
            return sorted;
        }

        vnp_Params = sortObjectVNpay(vnp_Params);

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return res.status(200).json({
            code: 0,
            status: false,
            msg: 'OK!',
            data: vnpUrl
        })
    },
    // return url
    returnUrlVnpay(req, res) {
        var vnp_Params = req.query;

        var status = ''
        statusCodes.forEach(e => {
            if (e.key === vnp_Params['vnp_TransactionStatus']) {
                status = e.value
                return
            }
        });
        if (status === '') {
            status = 'An unknown error'
        }

        Order.findByIdAndUpdate(vnp_Params['vnp_TxnRef'], {
            statusCode: vnp_Params['vnp_TransactionStatus'],
            status: status
        }).then().catch()

        res.redirect(`${req.protocol}://${req.get('host')}/order/${vnp_Params['vnp_TxnRef']}`)
    },
    // ipn
    IpnVnpay(req, res) {
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        var tmnCode = process.env.VNP_TMN_CODE
        var secretKey = process.env.VNP_SECRET_KEY

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        if (vnp_Params['vnp_ResponseCode'] === '00') {
            Order.findByIdAndUpdate(vnp_Params['vnp_TxnRef'], {
                info: 'Thanh toán dịch vụ của BKK Travel --> ipn'
            }).then().catch()
        }

        if (secureHash === signed) {
            var orderId = vnp_Params['vnp_TxnRef'];
            var rspCode = vnp_Params['vnp_ResponseCode'];
            //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
            res.status(200).json({ RspCode: '00', Message: 'success' })
        }
        else {
            res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
        }
    },

    // ------------------------------- ADMIN --------------------------------
    showAllBySuper(req, res) {
        const { username } = req.user
        Tour.find({
            username: username
        })
            .then(result => {
                if (result) {
                    var tourIds = []
                    result.map(tour => {
                        const { _id } = tour
                        tourIds.push(_id)
                    })
                    const tourObjectIds = tourIds.map(mongoose.Types.ObjectId)
                    Order.find({
                        items: {
                            $in: tourObjectIds
                        }
                    })
                        .then(rs => {
                            return res.status(200).json({
                                code: 0,
                                status: true,
                                msg: 'Your order has been successfully placed!',
                                data: rs
                            })
                        })
                        .catch(err => {
                            return res.status(500).json({
                                code: 0,
                                status: false,
                                msg: 'There is a problem with the system, please try again later!',
                                err: err
                            })
                        })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    code: 0,
                    status: false,
                    msg: 'There is a problem with the system, please try again later!',
                    err: err
                })
            })
    }
}

module.exports = OrderController