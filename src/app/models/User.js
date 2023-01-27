const mongoose = require('mongoose')

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    permissions: {
        type: String,
        default: 'User',
    },
    verify: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", User)