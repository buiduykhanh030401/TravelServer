const mongoose = require('mongoose');

const Verify = new mongoose.Schema({
    status: {
        type: Boolean,
        default: false,
    },
    body: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Verify', Verify)