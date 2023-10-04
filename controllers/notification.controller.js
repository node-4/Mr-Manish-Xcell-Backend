const Notification = require("../models/notification.model");
const mongoose = require("mongoose");

exports.createNotificationForMultipleRecipients = async (req, res) => {
    try {
        const notification = new Notification({
            title: req.body.title,
            message: req.body.message,
            link: req.body.link,
            recipient: req.body.recipients,
        });

        const savedNotification = await notification.save();

        res.status(201).json({
            success: true,
            message: "notification sent successfully",
            data: savedNotification,
        });
    } catch (err) {
        res.status(500).json({
            status: 0,
            success: false,
            message: err.message,
        });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification({
            recipient: req.body.recipient,
            message: req.body.message,
            link: req.body.link,
        });

        const savedNotification = await notification.save();

        res.status(201).json({
            status: 1,
            success: true,
            message: "created notification",
            data: savedNotification,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 0,
            success: false,
            message: err.message,
        });
    }
};

// Get all notifications for one recipient
exports.getNotificationsForRecipient = async (req, res) => {
    try {
        const notifications = await Notification.findById(req.params.id);
        if (!notifications) {
            return res.status(200).json({
                status: 0,
                success: false,
                message: "Notification not found",
            });
        }

        res.status(200).json({ status: 1, success: true, data: notifications });
    } catch (err) {
        res.status(500).json({
            status: 0,
            success: false,
            message: err.message,
        });
    }
};
exports.getAllNotificationsForUser1 = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id);
        const notifications = await Notification.aggregate([
            { $match: { "recipient.userId": userId } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    message: 1,
                    createdAt: 1,
                    recipient: {
                        $filter: {
                            input: "$recipient",
                            as: "recipient",
                            cond: {
                                $eq: [
                                    "$$recipient.userId",
                                    new mongoose.Types.ObjectId(req.params.id),
                                ],
                            },
                        },
                    },
                },
            },
        ]);

        if (notifications.length === 0) {
            return res.status(200).json({
                status: 0,
                success: false,
                // message: "Notifications not found",
            });
        }

        res.status(200).json({ status: 1, success: true, data: notifications, length: notifications.length });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 0,
            success: false,
            message: err.message,
        });
    }
};

// Get all notifications for a user

exports.getAllNotificationsForUser = async (req, res) => {
    try {
        // let queryObj = {};
        // if (req.query.recipient) {
        //     queryObj.recipient.userId = req.query.recipient;
        // }
        const notifications = await Notification.find()
            .lean()
            .sort("-createdAt")
            .populate({ path: 'recipient.userId', select: 'firstName middleName lastName' });
        if (notifications.length === 0) {
            return res.status(200).json({
                status: 0,
                message: "Notifications not found",
            });
        }
        // console.log(notifications);
        res.status(200).json({ status: 1, data: notifications });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: err.message });
    }
};

exports.deleteNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(
            req.params.id
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a notification by ID
exports.updateNotificationById = async (req, res) => {
    try {
        const { message, read, title } = req.body;
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res
                .status(200)
                .json({ status: 0, message: "Notification not found" });
        }

        notification.read = read || false;
        notification.message = message || notification.message;
        notification.title = title || notification.title;

        const updatedNotification = await notification.save();

        res.status(200).json({ status: 1, success: true, updatedNotification });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: err.message });
    }
};

// Delete a notification by ID
exports.deleteNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(
            req.params.id
        );

        if (!notification) {
            return res
                .status(200)
                .json({ status: 0, message: "Notification not found" });
        }

        res.status(200).json({
            status: 1,
            success: true,
            message: "Notification deleted",
        });
    } catch (err) {
        res.status(500).json({ status: 0, message: err.message });
    }
};