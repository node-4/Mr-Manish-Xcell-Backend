const mongoose = require('mongoose');
const docSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    document: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Document', docSchema);