const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: [
            {
                userId: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "User",
                },
                status: {
                    type: String,
                    enum: ["unread", "read", "deleted"],
                    default: "unread",
                },
            },
        ],
        title: {
            type: String,
            // required: true
        },
        message: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            // required: true
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
