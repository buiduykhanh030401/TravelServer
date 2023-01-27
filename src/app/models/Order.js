const mongoose = require('mongoose')

const Order = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    info: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    items: {
        type: Array,
        default: null
    },
    type: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'Unpaid'
    },
    statusCode: {
        type: String,
        default: '-1'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', Order)