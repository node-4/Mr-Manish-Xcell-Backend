const Reminder = require("../models/reminder.model");
const cron = require("node-cron");
const { sendReminderNotification } = require("../utils/firebase-service");
const ReminderController = {
    // Create a new reminder
    createReminder: async (req, res) => {
        try {
            const { text, dueDate } = req.body;
            const user = req.user;

            const reminder = new Reminder({
                text,
                dueDate,
                user,
            });

            await reminder.save();

            res.status(201).json({ message: "Reminder created successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update an existing reminder
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

            res.status(200).json({ message: "Reminder updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a reminder
    deleteReminder: async (req, res) => {
        try {
            const { id } = req.params;

            const reminder = await Reminder.findById(id);

            if (!reminder) {
                return res.status(404).json({ error: "Reminder not found" });
            }

            await reminder.remove();

            res.status(200).json({ message: "Reminder deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    sendRemainder: job.start(),

    // Start the cron job
};

module.exports = { ReminderController };
const job = cron.schedule("* * * * *", async () => {
    // Find all reminders that are due
    const reminders = await Reminder.find({
        dueDate: { $lte: new Date() },
    });

    // Send reminder notifications for each reminder
    reminders.forEach(sendReminderNotification);
});
