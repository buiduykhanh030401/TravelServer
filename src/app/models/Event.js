const mongoose = require('mongoose')

const Event = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    rank: {
        type: Number,
        required: true,
    },
    time_start: {
        type: Date,
        required: true,
    },
    time_end: {
        type: Date,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Event', Event)