const Payment = require("../models/payment.model");
const Razorpay = require("razorpay");
const Catalogue = require("../models/catalogue.model");
const uuid = require("uuid");
const id = uuid.v4();
const Order = require("../models/order.model");
const instance = new Razorpay({
    key_id: "rzp_test_OJAbuBbGYpIuLb",
    // "rzp_live_oe2m9rifPN1OM5",
    key_secret: "ocOG1gtUtzit5honzLu66OuF",
    // "lVgPoYfEbRchEnFISM6yJAdr",
});
exports.create = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("catalogueId");
        if (!order) {
            return res.status(404).send({ message: "order order not found" });
        }
        // const catalogue = await Catalogue.findOne({ _id: order.catalogueId });
        const options = {
            amount: order.catalogueId.totalAmount * 100, currency: "INR",
            receipt: id,
            partial_payment: false,
        };
        const result = await instance.orders.create(options);
        const paymentObj = {
            amount: req.body.amount,
            razorPayOrder_id: result.id,
            currency: "INR",
            receipt: result.receipt,
            partial_payment: false,
            userId: req.user._id,
            orderId: order._id,
            paymentStatus: req.body.paymentStatus.toLowerCase(),
            paymentMethod: req.body.paymentMethod,
        };
        const payment = await Payment.create(paymentObj);
        order.paymentStatus = payment.paymentStatus == "success" || payment.paymentStatus == "complete" ? "completed" : "due";
        await order.save();
        return res.status(200).send({ status: 1, message: "payment created", data: payment, });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: 0, message: "internal error", error: err.message, });
    }
};
exports.get = async (req, res) => {
    try {
        let q = {};
        if (req.query.userId) {
            q.userId = req.query.userId;
        }
        if (req.query.orderId) {
            q.orderId = req.query.orderId;
        }
        const payment = await Payment.find(q).populate(["userId"]);
        if (!payment) {
            return res.status(404).send({ status: 0, message: "not found" });
        }
        return res.status(201).send({ status: 1, data: payment });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: 0, message: "internal error", error: err.message, });
    }
};
exports.getById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate(["userId",
        ]);
        if (!payment) {
            return res.status(404).send({ status: 0, message: "not found" });
        }
        return res.status(201).send({ status: 1, data: payment });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: 0, message: "internal error", error: err.message, });
    }
};
exports.update = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).send({ status: 0, message: "not found" });
        }
        const order = await Order.findById(payment.orderId).populate("catalogueId"
        );
        payment.paymentStatus = req.body.paymentStatus.toLowerCase();
        const updated = await payment.save();
        order.paymentStatus = updated.paymentStatus == "success" || updated.paymentStatus == "complete" ? "completed" : "due";
        await order.save();
        return res.status(200).send({ status: 1, message: "updated successfully", data: payment, });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: 0, message: "internal error", error: err.message, });
    }
};