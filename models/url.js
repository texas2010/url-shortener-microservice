const mongoose = require('mongoose');

const Url = mongoose.model('Url', {
    original_url: {
        type: String,
        required: true,
        unique: true
    },
    short_url: {
        type: String,
        required: true,
        unique: true
    }
});
module.exports = { Url }
