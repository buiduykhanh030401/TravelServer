const mongoose = require('mongoose');

const PhotosMini = new mongoose.Schema({
    data: [
        {
            title: String,
            typeof: String,
        }
    ]
})

module.exports = mongoose.model('PhotosMini', PhotosMini)