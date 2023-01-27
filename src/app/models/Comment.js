const mongoose = require('mongoose')

const Comment = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    object_id: { //object id: tour, posts,...
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    parent_id: { //comment id
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    reply: {//username reply
        type: String,
        default: '',
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Comment', Comment)