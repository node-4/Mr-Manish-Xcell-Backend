const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        trackingUpdatedBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Admin",
        },
        trackingUpdatedByRole: {
            type: String,
            default: "",
        },
        order_id: {
            type: String,
        },
        orderId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Order",
        },
        dispatchDate: {
            type: Date,
        },
        date: {
            type: String,
        },
        time: {
            type: String,
        },
        message: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderTracking", schema);
