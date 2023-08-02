const Reminder = require("../models/reminder.model");
const cron = require("node-cron");
// const { sendReminderNotification } = require("../utils/firebase-service");
const ReminderController = {
    createReminder: async (req, res) => {
        try {
            const { text, dueDate } = req.body;
            const user = req.user;
            const newDocument = await Reminder.create({ text, dueDate, user });
            return res.status(201).json({ message: "Reminder created successfully" });
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
