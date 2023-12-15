const Invoice = require("../models/invoice.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const { v4: uuidv4 } = require("uuid");
// const Invoice = require('../models/invoice');
exports.createInvoice = async (req, res) => {
    try {
        let invoiceId = uuidv4();

        // Check if the invoice ID is already in use
        while (await Invoice.findOne({ invoiceId })) {
            invoiceId = uuidv4();
        }
        const order = await Order.findOne({ _id: req.body.orderId }).populate("catalogueId");
        if (!order) {
            return res.status(200).send({ status: 0, message: "order not found" });
        }
        const invoiceObj = {
            userId: req.body.userId,
            name: req.body.name,
            address: req.body.address,
            issuedBy: req.body.issuedBy,
            date: req.body.date,
            invoiceId: invoiceId,
            orderId: req.body.orderId,
            catalogueId: order.catalogueId,
            // product: req.body.product,
            // totalAmount: req.body.totalAmount,
            paymentStatus: order.paymentStatus,
            message: req.body.message,
        };
        let products = [];
        let totalAmount = 0;
        order.catalogueId.packages.forEach((package) => {
            let obj = {};
            obj.description = package.itemName;
            obj.rate = package.amount;
            obj.quantity = package.quantity;
            products.push(obj);
            totalAmount += package.amount * package.quantity;
        });
        console.log(products);
        invoiceObj.product = products;
        invoiceObj.totalAmount = totalAmount;

        const invoice = await Invoice.create(invoiceObj)
        return res.status(201).json({ status: 1, data: invoice });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 0, message: "Server Error" });
    }
};
exports.getInvoices = async (req, res) => {
    try {
        let queryObj = {};
        if (req.query.userId) {
            queryObj.userId = req.query.userId;
        }
        if (req.query.catalogueId) {
            queryObj.catalogueId = req.query.catalogueId;
        }
        if (req.query.orderId) {
            queryObj.orderId = req.query.orderId;
        }
        if (req.query.invoiceId) {
            queryObj.invoiceId = req.query.invoiceId;
        }
        const invoices = await Invoice.find(queryObj);
        if (invoices.length === 0) {
            return res.status(200).json({ status: 0, message: "invoice not found" });
        }
        return res.status(200).json({ status: 1, data: invoices });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 0, message: "Server Error" });
    }
};
exports.getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).lean();
        if (!invoice) {
            return res.status(404).json({ status: 0, message: "Invoice not found" });
        }
        return res.status(200).json({ status: 1, data: invoice });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 0, message: "Server Error" });
    }
};
exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        if (!invoice) {
            return res.status(200).json({ status: 0, message: "Invoice not found" });
        }
        return res.status(200).json({ status: 1, message: "Invoice updated", data: invoice, });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 0, message: "Server Error" });
    }
};
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) {
            return res.status(404).json({ status: 0, message: "Invoice not found" });
        }
        return res.status(204).json({ status: 1, message: "Invoice deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 0, message: "Server Error" });
    }
};