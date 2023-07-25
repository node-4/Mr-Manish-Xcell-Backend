const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    city: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('HubCity', schema);