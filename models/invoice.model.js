const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: String,
        },
        address: {
            type: String,
        },
        issuedBy: {
            type: String,
        },
        date: {
            type: String,
        },
        invoiceId: {
            type: String,
        },
        orderId: {
            type: mongoose.Types.ObjectId,
            ref: "Order",
        },
        catalogueId: {
            type: mongoose.Types.ObjectId,
            ref: "Catalogue",
        },

        product: [
            {
                description: {
                    type: String,
                },
                quantity: {
                    type: Number,
                },
                rate: {
                    type: Number,
                },
                amount: {
                    type: Number,
                },
            },
        ],
        totalAmount: {
            type: Number,
        },
        paymentStatus: {
            type: String,
            enum: ["completed", "due", "canceled", "Due", "completed"],
        },
        message: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Invoice", schema);
