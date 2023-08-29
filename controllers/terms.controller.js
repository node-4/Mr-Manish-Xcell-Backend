const Terms = require("../models/terms.model");

// Controller function for getting the terms and conditions
exports.getTerms = async (req, res) => {
    try {
        // Find the most recent terms and conditions document
        const terms = await Terms.find().sort({ updatedAt: -1 });
        if (!terms || terms.length === 0) {
            return res
                .status(404)
                .json({ status: 0, message: "terms not found" });
        }
        // Send the terms and conditions to the client
        res.status(200).json({ status: 1, success: true, data: terms[0] });
    } catch (err) {
        console.log(err);
        err;
        // Send an error response to the client
        res.status(500).json({
            status: 0,
            success: false,
            message: "Error getting terms and conditions",
            error: err.message,
        });
    }
};

// Controller function for creating a new set of terms and conditions
exports.createTerms = async (req, res) => {
    try {
        const content = req.body.content; // Get the content from the request body

        // Create a new terms document with the specified content
        const newTerms = new Terms({ content });

        // Save the new terms document to the database
        await newTerms.save();

        // Send a success response to the client
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

// Controller function for updating the terms and conditions
exports.updateTerms = async (req, res) => {
    try {
        const id = req.params.id; // Get the ID of the terms and conditions to update
        const content = req.body.content; // Get the new content from the request body

        // Find the terms and conditions document to update
        const terms = await Terms.findById(id);
        if (!terms) {
            // If the document doesn't exist, send a 404 error response to the client
            return res.status(404).json({
                status: 0,
                success: false,
                message: "Terms and conditions not found",
            });
        }
        // Update the terms and conditions document with the new content and save it to the database
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
