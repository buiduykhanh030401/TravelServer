const mongoose = require('mongoose')

const Cart = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    carts: { //tour id
        type: Array,
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Cart', Cart)