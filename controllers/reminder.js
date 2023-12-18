const Reminder = require("../models/reminder.model");
const cron = require("node-cron");
const User = require("../models/user.model");
var FCM = require('fcm-node');
const axios = require("axios");

const ReminderController = {
    createReminder: async (req, res) => {
        try {
            const { text, dueDate } = req.body;
            const user = req.user;
            const user1 = await User.findById(req.user).lean();
            if (user1) {
                if (req.body.sendType == "sms") {
                    const mobile = "91" + user1.phone;
                    console.log(user1.phone);
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
                            otp: `Message: ${req.body.text} DueDate: ${req.body.dueDate}`,
                            mobile: mobile,
                        },
                    };
                    axios.request(options).then(function (response) {
                        console.log(response);
                    }).catch(function (error) { console.error(error); });
                }
                if (req.body.sendType == "push") {
                    if (user1.deviceToken != (null || undefined)) {
                        let x = await pushNotificationforUser(user1.deviceToken, req.body.text, req.body.dueDate)
                    }
                }
                if (req.body.sendType == "Both") {
                    if (user1.deviceToken != (null || undefined)) {
                        let x = await pushNotificationforUser(user1.deviceToken, req.body.text, req.body.dueDate)
                    }
                    const mobile = "91" + user1.phone;
                    console.log(user1.phone);
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
                            otp: `Message: ${req.body.text} DueDate: ${req.body.dueDate}`,
                            mobile: mobile,
                        },
                    };
                    axios.request(options).then(function (response) {
                        console.log(response);
                    }).catch(function (error) { console.error(error); });
                }
            }
            const newDocument = await Reminder.create({ text, dueDate, user });
            return res.status(201).json({ message: "Reminder created successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getReminder: async (req, res) => {
        try {
            const user = req.user;
            const newDocument = await Reminder.find({ user });
            return res.status(200).json({ message: "Reminder created successfully", data: newDocument });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    updateReminder: async (req, res) => {
        try {
            const { text, dueDate } = req.body;
            const { id } = req.params;
            const reminder = await Reminder.findById(id);
            if (!reminder) {
                return res.status(404).json({ error: "Reminder not found" });
            }
            reminder.text = text;
            reminder.dueDate = dueDate;
            await reminder.save();
            return res.status(200).json({ message: "Reminder updated successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    deleteReminder: async (req, res) => {
        try {
            const { id } = req.params;
            const reminder = await Reminder.findById(id);
            if (!reminder) {
                return res.status(404).json({ error: "Reminder not found" });
            }
            await reminder.remove();

            return res.status(200).json({ message: "Reminder deleted successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    // sendRemainder: job.start(),
};
module.exports = { ReminderController };
// const job = cron.schedule("* * * * *", async () => {
//     const reminders = await Reminder.find({ dueDate: { $lte: new Date() }, });
//     reminders.forEach(sendReminderNotification);
// });
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
