const mongoose = require('mongoose')

const Service = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    services: [{
        tour_id: mongoose.Schema.Types.ObjectId,
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Service', Service)