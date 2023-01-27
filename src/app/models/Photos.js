const mongoose = require('mongoose');

const Photos = new mongoose.Schema({
    title: String,
    typeof: String,
    img: Buffer,
})

module.exports = mongoose.model('Photos', Photos)