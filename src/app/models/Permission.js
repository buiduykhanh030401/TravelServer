const mongoose = require('mongoose')

const Permission = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    roles: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Permission', Permission)