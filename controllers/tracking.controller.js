const OrderTracking = require("../models/tracking.model");
const mongoose = require("mongoose");
const Notification = require("../models/notification.model");
const Order = require("../models/order.model");
const Catalogue = require("../models/catalogue.model");
// Get all order tracking records
const getOrderTrackings = async (req, res) => {
    try {
        let queryObj = {};
        if (req.query.orderId) {
            queryObj.orderId = req.query.orderId;
        }
        if (req.query.order_id) {
            queryObj.order_id = req.query.order_id;
        }
        const orderTrackings = await OrderTracking.find(queryObj);
        if (orderTrackings.length === 0) {
            return res
                .status(200)
                .json({ status: 0, message: "no tracking records" });
        }
        res.status(200).json({ status: 1, data: orderTrackings });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 0, message: error.message });
    }
};

const getOrderTrackingById = async (req, res) => {
    try {
        const orderId = req.params.id;

        const orderTrackings = await OrderTracking.aggregate([
            { $match: { orderId: new mongoose.Types.ObjectId(orderId) } },
            // { $project: { _id: 1, date: 1, time: 1, message: 1, orderId: 1 } }
        ]);
        // console.log(orderTrackings);
        if (orderTrackings.length === 0) {
            return res
                .status(200)
                .json({ status: 0, message: "no tracking records" });
        }
        res.status(200).json({ status: 1, data: orderTrackings });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 0, message: error.message });
    }
};
// Create a new order tracking record
const createOrderTracking = async (req, res) => {
    const trackingUpdatedBy = req.user._id;
    const trackingUpdatedByRole = "updated by " + req.user.role;
    const { message, orderId, date, city, state, time } = req.body;
    const order = await Order.findById(orderId);
    console.log(order);
    if (!order) {
        return res.status(200).json({
            status: 0,
            message: "Order not found",
        });
    }

    console.log({
        message,
        orderId,
        order_id: order.orderId,
        city,
        state,
        date,
        time,
        trackingUpdatedByRole,
        trackingUpdatedBy,
    });
    const orderTracking = new OrderTracking({
        message,
        orderId,
        order_id: order.orderId,
        city,
        state,
        date,
        time,
        trackingUpdatedByRole,
        trackingUpdatedBy,
    });
    try {
        const newOrderTracking = await orderTracking.save();
        const order = await Order.findById(orderId);
        if (order.userId !== "undefined") {
            await Notification.create({
                recipient: [{ userId: order.userId }],
                title: `${message}`,
                orderId,
                message: ` ${message}.Order  reached ${city} ${state} on ${date} at ${time}`,
            });
        }
        // console.log(notification);
        res.status(201).json({ status: 1, data: newOrderTracking });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 0, message: error.message });
    }
};

// Update an existing order tracking record
const updateOrderTracking = async (req, res) => {
    try {
        const {
            message,
            orderId,
            date,
            time,
            trackingUpdatedByRole,
            trackingUpdatedBy,
            expectedDelivered
        } = req.body;
        const orderTracking = await OrderTracking.findById(req.params.id);
        if (!orderTracking) {
            return res.status(200).json({
                status: 0,
                message: "Order tracking record not found",
            });
        }
        // orderTracking.trackingUpdatedBy = req.body.trackingUpdatedBy;
        orderTracking.trackingUpdatedByRole = trackingUpdatedByRole || orderTracking.trackingUpdatedByRole;
        orderTracking.orderId = orderId || orderTracking.orderId;
        orderTracking.date = date || orderTracking.date;
        orderTracking.time = time || orderTracking.time;
        orderTracking.message = message || orderTracking.message;
        orderTracking.expectedDelivered = expectedDelivered || orderTracking.expectedDelivered;
        const updatedOrderTracking = await orderTracking.save();
        res.status(200).json({
            status: 1,
            message: "order tracking updated",
            data: updatedOrderTracking,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 0, message: error.message });
    }
};

// Delete an order tracking record by ID
const deleteOrderTracking = async (req, res) => {
    try {
        const orderTracking = await OrderTracking.findById(req.params.id);
        if (!orderTracking) {
            return res.status(200).json({
                status: 0,
                message: "Order tracking record not found",
            });
        }
        await orderTracking.remove();
        res.status(200).json({
            status: 1,
            message: "Order tracking record deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 0, message: error.message });
    }
};
const trackingForAdmin = async (req, res) => {
    try {
        const orderTrackings = await OrderTracking.aggregate([
            { $match: { orderId: new mongoose.Types.ObjectId(req.params.id) } },
        ]);
        if (orderTrackings.length === 0) {
            return res
                .status(200)
                .json({ status: 0, message: "no tracking records" });
        }
        console.log(orderTrackings);
        res.status(200).json({ status: 1, data: orderTrackings });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 0, message: error.message });
    }
};

module.exports = {
    getOrderTrackings,
    getOrderTrackingById,
    createOrderTracking,
    updateOrderTracking,
    deleteOrderTracking,
    trackingForAdmin,
};
