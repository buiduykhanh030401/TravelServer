const mongoose = require('mongoose')

const Area = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        default: null
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Area", Area)