const Product = require("../models/product.model");

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json({
            status: 1,
            message: "product added",
            data: savedProduct,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ status: 0, message: err.message });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        let queryObj = {};
        if (req.query.productName) {
            queryObj.productName = new RegExp(req.query.productName, "i");
        }
        const products = await Product.find(queryObj);
        if (products.length === 0) {
            return res
                .status(200)
                .json({ status: 0, message: "no product found" });
        }
        res.status(200).json({ status: 1, data: products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: err.message });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res
                .status(200)
                .json({ status: 0, message: "Product not found" });
        }
        res.status(200).json({ status: 1, data: product });
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message });
    }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        if (!product) {
            return res
                .status(200)
                .json({ status: 0, message: "Product not found" });
        }
        res.status(200).json({
            status: 1,
            message: "Product successfully updated",
        });
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message });
    }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res
                .status(200)
                .json({ status: 0, message: "Product not found" });
        }
        res.status(200).json({
            status: 1,
            message: "Product deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 0, message: err.message });
    }
};
