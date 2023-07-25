const mongoose = require("mongoose");

// Define schema for Support Ticket
const supportTicketSchema = new mongoose.Schema(
    {
        email: {
            type: String,
        },
        phone: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
