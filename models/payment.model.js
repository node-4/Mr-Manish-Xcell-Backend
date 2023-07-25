const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
        },
        orderId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Order",
        },
        amount: {
            type: Number,
        },
        razorPayOrder_id: {
            type: String,
        },
        receipt: {
            type: String,
        },
        paymentMethod: {
            type: String,
        },
        paymentStatus: {
            type: String,
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
