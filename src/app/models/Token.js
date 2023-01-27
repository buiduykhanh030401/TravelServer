const mongoose = require('mongoose')

const Token = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Token", Token)