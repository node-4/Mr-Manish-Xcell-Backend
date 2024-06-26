const Catalogue = require("../models/catalogue.model");
const Order = require("../models/order.model");
exports.createCatalogue = async (req, res) => {
    try {
        const { orderId, name, therapyName, packages, deliveryFee, tax_and_charges, } = req.body;
        let totalSum = 0;
        packages.forEach((package) => { totalSum += package.amount * package.quantity; });
        let total = totalSum;
        let totalAmount = totalSum + deliveryFee + (totalSum * tax_and_charges) / 100;
        totalAmount = Math.round(totalAmount);
        const catalogueItem = new Catalogue({ orderId, name, therapyName, packages, total, deliveryFee, tax_and_charges, totalAmount, userId: req.body.userId });
        const savedCatalogueItem = await catalogueItem.save();
        await Order.create({ userId: req.body.userId, catalogueId: savedCatalogueItem._id, totalPackages: savedCatalogueItem.packages.length, placedOn: new Date(), });
        return res.status(201).json({ status: 1, message: "Catalogue item created successfully.", data: savedCatalogueItem, });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.getCatalogues = async (req, res) => {
    try {
        let queryObj = {};
        if (req.query.userId) {
            queryObj.userId = req.query.userId;
        }
        const catalogueItems = await Catalogue.find(queryObj);
        if (catalogueItems.length === 0) {
            return res.status(404).json({ status: 0, message: "catalogue items not found" });
        }
        return res.status(200).json({ status: 1, data: catalogueItems });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.getCatalogueById = async (req, res) => {
    try {
        const catalogueItem = await Catalogue.findById(req.params.id);
        if (!catalogueItem) {
            return res.status(200).json({ status: 0, message: "Catalogue item not found." });
        }
        return res.status(200).json({ data: catalogueItem });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.updateCatalogueById = async (req, res) => {
    try {
        const { orderId, name, therapyName, packages, total, deliveryFee, tax_and_charges, totalAmount, } = req.body;

        // Validation: Check if all required fields are present
        if (!orderId || !name || !therapyName || !packages || !total || !deliveryFee || !tax_and_charges || !totalAmount) {
            return res.status(200).json({ status: 0, message: "All fields are required." });
        }
        const catalogueItem = await Catalogue.findByIdAndUpdate(req.params.id, { orderId, name, therapyName, packages, total, deliveryFee, tax_and_charges, totalAmount, }, { new: true });
        if (!catalogueItem) {
            return res.status(404).json({ status: 0, message: "Catalogue item not found." });
        }
        return res.status(200).json({ message: "Catalogue item updated successfully.", data: catalogueItem, });
    } catch (err) {
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.deleteCatalogueById = async (req, res) => {
    try {
        const catalogueItem = await Catalogue.findByIdAndDelete(req.params.id);

        if (!catalogueItem) {
            return res.status(200).json({ status: 0, message: "Catalogue item not found." });
        }

        return res.status(200).json({ message: "Catalogue item deleted successfully.", data: catalogueItem, });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: "internal server error " + err.message, });
    }
};