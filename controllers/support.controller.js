const SupportTicket = require("../models/support");

// GET /support-tickets
exports.getAllSupportTickets = async (req, res) => {
    try {
        const supportTickets = await SupportTicket.find().lean();
        if (supportTickets.length === 0) {
            return res
                .status(404)
                .json({ status: 0, message: "support ticket not found" });
        }
        res.status(200).json({
            status: 1,
            data: supportTickets[supportTickets.length - 1],
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: "Failed to get support tickets",
            error,
        });
    }
};

// GET /support-tickets/:id
exports.getSupportTicketById = async (req, res) => {
    const { id } = req.params;
    try {
        const supportTicket = await SupportTicket.findById(id);
        if (!supportTicket) {
            return res
                .status(404)
                .json({ status: 0, message: "Support ticket not found" });
        }
        res.status(200).json({ status: 1, data: supportTicket });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: "Failed to get support ticket",
            error,
        });
    }
};

// POST /support-tickets
exports.createSupportTicket = async (req, res) => {
    const { email, phone } = req.body;
    // const userId = req.user._id; // assuming user id is stored in req.user

    try {
        const supportTicket = new SupportTicket({
            email,
            phone,
            // user: userId,
        });

        await supportTicket.save();
        res.status(201).json({
            status: 1,
            message: "Support ticket submitted",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 0,
            message: "internal server error " + error.message,
        });
    }
};

exports.updateSupportTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedSupportTicket = await SupportTicket.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.status(200).json({
            status: 1,
            message: "Support ticket updated successfully",
            data: updatedSupportTicket,
        });
    } catch (err) {
        res.status(500).json({
            status: 0,
            message: "Error updating support ticket",
        });
    }
};

// API to delete a support ticket by ID
exports.deleteSupportTicket = async (req, res) => {
    try {
        const { id } = req.params;
        await SupportTicket.findByIdAndDelete(id);
        res.status(200).json({
            status: 1,
            message: "Support ticket deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            status: 0,
            message: "Error deleting support ticket",
        });
    }
};
