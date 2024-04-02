const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    orderId: {
        type: String,
    },
    name: {
        type: String,
    },
    therapyName: {
        type: String,
    },
    document: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Document'
    },
    packages: [{
        itemName: {
            type: String,
        }, quantity: {
            type: Number,
        }, amount: {
            type: Number
        }
    }],
    total: {
        type: Number
    },
    deliveryFee: {
        type: Number
    },
    tax_and_charges: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    }
}, { timestamps: true });

module.exports = mongoose.model('Catalogue', schema);

