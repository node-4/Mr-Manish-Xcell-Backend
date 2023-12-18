const Notification = require("../models/notification.model");
const mongoose = require("mongoose");
var FCM = require('fcm-node');
const User = require("../models/user.model");
const axios = require("axios");

exports.createNotificationForMultipleRecipients = async (req, res) => {
    try {
        for (let i = 0; i < req.body.recipients.length; i++) {
            const user = await User.findById(req.body.recipients[i].userId).lean();
            if (user) {
                if (req.body.sendType == "Both") {
                    if (user.deviceToken != (null || undefined)) {
                        let x = await pushNotificationforUser(user.deviceToken, req.body.title, req.body.message)
                    }
                    const mobile = "91" + user.phone;
                    console.log(user.phone);
                    const options = {
                        method: "POST",
                        url: "https://control.msg91.com/api/v5/otp?mobile=&template_id=",
                        headers: {
                            accept: "application/json",
                            "content-type": "application/json",
                            authkey: "392665AOfokrdImEwF64130f11P1",
                        },
                        data: {
                            template_id: "6458d399d6fc052d7350be62",
                            sender: "fromapi",
                            otp: req.body.message,
                            mobile: mobile,
                        },
                    };
                    axios.request(options).then(function (response) {
                        console.log(response);
                    }).catch(function (error) { console.error(error); });
                }
                if (req.body.sendType == "push") {
                    if (user.deviceToken != (null || undefined)) {
                        let x = await pushNotificationforUser(user.deviceToken, req.body.title, req.body.message)
                    }
                }
                if (req.body.sendType == "sms") {
                    const mobile = "91" + user.phone;
                    console.log(user.phone);
                    const options = {
                        method: "POST",
                        url: "https://control.msg91.com/api/v5/otp?mobile=&template_id=",
                        headers: {
                            accept: "application/json",
                            "content-type": "application/json",
                            authkey: "392665AOfokrdImEwF64130f11P1",
                        },
                        data: {
                            template_id: "6458d399d6fc052d7350be62",
                            sender: "fromapi",
                            otp: req.body.message,
                            mobile: mobile,
                        },
                    };
                    axios.request(options).then(function (response) {
                        console.log(response);
                    }).catch(function (error) { console.error(error); });
                }
            }
        }
        const notification = new Notification({
            title: req.body.title,
            message: req.body.message,
            link: req.body.link,
            recipient: req.body.recipients,
        });
        const savedNotification = await notification.save();
        return res.status(201).json({ success: true, message: "notification sent successfully", data: savedNotification, });
    } catch (err) {
        return res.status(500).json({ status: 0, success: false, message: err.message, });
    }
};
exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification({ recipient: req.body.recipient, message: req.body.message, link: req.body.link, });
        const savedNotification = await notification.save();
        return res.status(201).json({ status: 1, success: true, message: "created notification", data: savedNotification, });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, success: false, message: err.message, });
    }
};
exports.getNotificationsForRecipient = async (req, res) => {
    try {
        const notifications = await Notification.findById(req.params.id);
        if (!notifications) {
            return res.status(200).json({ status: 0, success: false, message: "Notification not found", });
        }

        return res.status(200).json({ status: 1, success: true, data: notifications });
    } catch (err) {
        return res.status(500).json({ status: 0, success: false, message: err.message, });
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
            return res.status(200).json({ status: 0, success: false, });
        }
        return res.status(200).json({ status: 1, success: true, data: notifications, length: notifications.length });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, success: false, message: err.message, });
    }
};
exports.getAllNotificationsForUser = async (req, res) => {
    try {
        const notifications = await Notification.find().lean().sort("-createdAt").populate({ path: 'recipient.userId', select: 'firstName middleName lastName' });
        if (notifications.length === 0) {
            return res.status(200).json({ status: 0, message: "Notifications not found", });
        }
        // console.log(notifications);
        return res.status(200).json({ status: 1, data: notifications });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.deleteNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        return res.status(200).json({ message: "Notification deleted" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
exports.updateNotificationById = async (req, res) => {
    try {
        const { message, read, title } = req.body;
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(200).json({ status: 0, message: "Notification not found" });
        }
        notification.read = read || false;
        notification.message = message || notification.message;
        notification.title = title || notification.title;
        const updatedNotification = await notification.save();
        return res.status(200).json({ status: 1, success: true, updatedNotification });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.deleteNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(200).json({ status: 0, message: "Notification not found" });
        }
        return res.status(200).json({ status: 1, success: true, message: "Notification deleted", });
    } catch (err) {
        return res.status(500).json({ status: 0, message: err.message });
    }
};
const pushNotificationforUser = async (deviceToken, title, body) => {
    return new Promise((resolve, reject) => {
        var serverKey = 'AAAAi1BaRK0:APA91bG-u_2XA8ajhS1OKz419UX_OeW-TM5ezKnYXh9LNMVz9ZYt939FGdcfJiqfBtRPSNwzb3CXU4wpVq9BjVp9TULFjfGgRtly6ao03JMusFyyf3u9McMh8LT6wj9YQxjP2RSqYleo';
        var fcm = new FCM(serverKey);
        var message = {
            to: deviceToken,
            "content_available": true,
            notification: { title: title, body: body }
        };
        fcm.send(message, function (err, response) {
            if (err) {
                console.log(">>>>>>>>>>", err)
                return reject(err)
            } else {
                console.log(">>>>>>>>>response", response)
                return resolve(response);

            }
        });
    });
}
