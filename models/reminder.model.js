const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReminderSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Reminder = mongoose.model("Reminder", ReminderSchema);

module.exports = Reminder;
