const Product = require("../models/product.model");
const Catalogue = require("../models/catalogue.model");

const catalogueBodies = async (req, res, next) => {
    const {
        orderId,
        name,
        therapyName,
        packages,
        deliveryFee,
        tax_and_charges,
    } = req.body;
    // if (!orderId || !name || !therapyName || !packages || packages.length === 0 || !total || !deliveryFee || !tax_and_charges || !totalAmount) {
    //     return res.status(400).json({ error: "All fields are required." });
    // }

    const requiredFields = [
        "orderId",
        "name",
        "therapyName",
        "packages",
        "deliveryFee",
        "tax_and_charges",
    ];

    const missingFields = [];
    requiredFields.forEach((field) => {
        if (!req.body[field]) {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        return res.status(400).json({
            status: 0,
            message: ` ${missingFields.join(", ")} are required`,
        });
    }

    for (let i = 0; i < packages.length; i++) {
        if (
            packages[i].itemName === undefined ||
            packages[i].quantity == undefined ||
            packages[i].amount === undefined
        ) {
            return res.status(400).json({
                status: 0,
                message: "all fields are required in packages",
            });
        }
    }
    const existingProduct = await Catalogue.findOne({ orderId: orderId });
    console.log(existingProduct);
    if (existingProduct) {
        return res
            .status(400)
            .json({ status: 0, message: "Order ID already exists" });
    }
    next();
};
// middleware for validating product fields
const validateProductFields = async (req, res, next) => {
    const { image, productId, quantity, productName, price } = req.body;

    // Check if all required fields are present
    const requiredFields = [
        "image",
        "productId",
        "quantity",
        "productName",
        "price",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length) {
        const errorMessage = `The following fields are required: ${missingFields.join(
            ", "
        )}`;
        return res.status(400).json({ status: 0, message: errorMessage });
    }

    // Check that productId is unique
    const existingProduct = await Product.findOne({ productId: productId });
    // console.log(existingProduct);
    if (existingProduct) {
        return res
            .status(400)
            .json({ status: 0, message: "Product ID already exists" });
    }
    next();
};
const requiredFieldsMiddleware = (req, res, next) => {
    const { orderId, date, time, message } = req.body;

    if (!orderId || !date || !time || !message) {
        return res
            .status(400)
            .json({
                status: 0,
                message: "orderId, date, time or message is missing ",
            });
    }

    next();
};

module.exports = {
    catalogueBodies,
    validateProductFields,
    requiredFieldsMiddleware,
};
