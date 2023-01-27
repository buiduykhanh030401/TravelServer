const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        unique: true
    },
    messages: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', Admin)