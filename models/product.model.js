const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    image: {
        type: String,
        // required: true
    },
    productId: {
        type: Number,
        required: true,
        unique: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: String,
        default: "In Stock",
    },
});

module.exports = mongoose.model("Product", productSchema);
