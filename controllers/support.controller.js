const SupportTicket = require("../models/support");
exports.getAllSupportTickets = async (req, res) => {
    try {
        const supportTickets = await SupportTicket.find().lean();
        if (supportTickets.length === 0) {
            return res.status(404).json({ status: 0, message: "support ticket not found" });
        }
        return res.status(200).json({ status: 1, data: supportTickets });
    } catch (error) {
        return res.status(500).json({ status: 0, message: "Failed to get support tickets", error, });
    }
};
exports.getSupportTicketById = async (req, res) => {
    const { id } = req.params;
    try {
        const supportTicket = await SupportTicket.findById(id);
        if (!supportTicket) {
            return res.status(404).json({ status: 0, message: "Support ticket not found" });
        }
        return res.status(200).json({ status: 1, data: supportTicket });
    } catch (error) {
        return res.status(500).json({ status: 0, message: "Failed to get support ticket", error, });
    }
};
exports.createSupportTicket = async (req, res) => {
    const { email, phone, location } = req.body;
    try {
        const supportTicket = new SupportTicket({ email, phone, location });
        await supportTicket.save();
        return res.status(201).json({ status: 1, message: "Support ticket submitted", });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 0, message: "internal server error " + error.message, });
    }
};
exports.updateSupportTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedSupportTicket = await SupportTicket.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({ status: 1, message: "Support ticket updated successfully", data: updatedSupportTicket, });
    } catch (err) {
        return res.status(500).json({ status: 0, message: "Error updating support ticket", });
    }
};
exports.deleteSupportTicket = async (req, res) => {
    try {
        const { id } = req.params;
        await SupportTicket.findByIdAndDelete(id);
        return res.status(200).json({ status: 1, message: "Support ticket deleted successfully", });
    } catch (err) {
        return res.status(500).json({ status: 0, message: "Error deleting support ticket", });
    }
};
