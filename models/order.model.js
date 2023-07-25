const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        catalogueId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Catalogue",
        },
        orderId: {
            type: String,
        },
        name: {
            type: String,
        },
        orderType: {
            type: String,
            default: "catalogue",
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
        },
        customerId: {
            type: String,
        },
        totalPackages: {
            type: Number,
            default: 0,
        },
        placedOn: {
            type: Date,
            default: new Date(),
        },
        address: {
            type: String,
            default: "",
        },
        deliveryDate: {
            type: Date,
            default: new Date(),
        },
        totalAmount: {
            type: Number,
        },
        orderStatus: {
            type: String,
            default: "ongoing",
            enum: ["due", "ongoing", "delivered", "completed", "cancelled"],
        },
        paymentStatus: {
            type: String,
            default: "due",
            enum: ["due", "pending", "cancelled", "completed", "success"],
        },
        city: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", schema);
