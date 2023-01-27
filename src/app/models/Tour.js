const mongoose = require('mongoose')

const Tours = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    sale: {
        type: Number,
        require: true,
    },
    ordered: {
        type: Number,
        default: 0
    },
    area_slug: {
        type: String,
        require: true,
    },
    follow_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    thumb: {
        type: String,
        default: ''
    },
    images: {
        type: Array,
        default: null
    },
    time_start: {
        type: Date,
        require: true,
    },
    time_end: {
        type: Date,
        require: true,
    },
    address_start: {
        type: String,
        require: true,
    },
    address_end: {
        type: String,
        require: true,
    },
    schedule: [{
        title: String,
        date: Date,
        details: String,
    }],
    slug: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
})

Tours.index({
    title: 'text',
    description: 'text',
    area_slug: 'text',
    address_start: 'text',
    address_end: 'text',
    details: 'text',
})

const Tour = mongoose.model('Tour', Tours)

Tour.watch().on('change', data => {
    console.log(data);
})


module.exports = Tour