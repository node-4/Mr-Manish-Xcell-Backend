const Terms = require("../models/terms.model");

exports.getTerms = async (req, res) => {
    try {
        const terms = await Terms.find().sort({ updatedAt: -1 });
        if (!terms || terms.length === 0) {
            return res
                .status(404)
                .json({ status: 0, message: "terms not found" });
        }
        res.status(200).json({ status: 1, success: true, data: terms[0] });
    } catch (err) {
        console.log(err);
        err;
        res.status(500).json({
            status: 0,
            success: false,
            message: "Error getting terms and conditions",
            error: err.message,
        });
    }
};

exports.createTerms = async (req, res) => {
    try {
        const content = req.body.content; 
        const newTerms = new Terms({ content });
        await newTerms.save();
        res.status(200).json({
            status: 1,
            success: true,
            message: "Terms and conditions created successfully",
        });
    } catch (err) {
        console.log(err);
        // Send an error response to the client
        res.status(500).json({
            status: 0,
            success: false,
            message: "Error creating terms and conditions",
            error: err.message,
        });
    }
};
exports.updateTerms = async (req, res) => {
    try {
        const id = req.params.id; // Get the ID of the terms and conditions to update
        const content = req.body.content; // Get the new content from the request body
        const terms = await Terms.findById(id);
        if (!terms) {
            return res.status(404).json({
                status: 0,
                success: false,
                message: "Terms and conditions not found",
            });
        }
        terms.content = content;
        await terms.save();

        // Send a success response to the client
        res.status(200).json({
            status: 1,
            success: true,
            message: "Terms and conditions updated successfully",
        });
    } catch (err) {
        console.log(err);
        // Send an error response to the client
        res.status(500).json({
            status: 0,
            success: false,
            message: "Error updating terms and conditions",
            error: err.message,
        });
    }
};

// Controller function for deleting a set of terms and conditions
exports.deleteTerms = async (req, res) => {
    try {
        const id = req.params.id; // Get the ID of the terms and conditions to delete

        // Find the terms and conditions document to delete
        const terms = await Terms.findById(id);
        if (!terms) {
            return res.status(404).json({ status: 0, success: false, message: "Terms and conditions not found", });
        } else {
            await Terms.findByIdAndDelete({ _id: terms._id });
            return res.status(200).json({ status: 1, success: true, message: "Terms and conditions deleted successfully", });
        }
    } catch (err) {
        console.log(err);
        // Send an error response to the client
        return res.status(500).json({ status: 0, success: false, message: "Error updating terms and conditions", error: err.message, });
    }
};
