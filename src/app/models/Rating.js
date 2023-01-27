const mongoose = require('mongoose')

const Rating = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    rate: {
        type: Number,
        require: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Rating', Rating)