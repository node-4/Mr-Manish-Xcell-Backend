const Terms = require("../models/terms.model");

exports.getTerms = async (req, res) => {
    try {
        const terms = await Terms.find().sort({ updatedAt: -1 });
        if (!terms || terms.length === 0) {
            return res.status(404).json({ status: 0, message: "terms not found" });
        }
        return res.status(200).json({ status: 1, success: true, data: terms[0] });
    } catch (err) {
        console.log(err);
        err;
        return res.status(500).json({ status: 0, success: false, message: "Error getting terms and conditions", error: err.message, });
    }
};
exports.createTerms = async (req, res) => {
    try {
        const content = req.body.content;
        const newTerms = new Terms({ content });
        await newTerms.save();
        return res.status(200).json({ status: 1, success: true, message: "Terms and conditions created successfully", });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, success: false, message: "Error creating terms and conditions", error: err.message, });
    }
};
exports.updateTerms = async (req, res) => {
    try {
        const id = req.params.id;
        const content = req.body.content;
        const terms = await Terms.findById(id);
        if (!terms) {
            return res.status(404).json({ status: 0, success: false, message: "Terms and conditions not found", });
        }
        terms.content = content;
        await terms.save();
        return res.status(200).json({ status: 1, success: true, message: "Terms and conditions updated successfully", });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, success: false, message: "Error updating terms and conditions", error: err.message, });
    }
};
exports.deleteTerms = async (req, res) => {
    try {
        const id = req.params.id;
        const terms = await Terms.findById(id);
        if (!terms) {
            return res.status(404).json({ status: 0, success: false, message: "Terms and conditions not found", });
        } else {
            await Terms.findByIdAndDelete({ _id: terms._id }); return res.status(200).json({ status: 1, success: true, message: "Terms and conditions deleted successfully", });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, success: false, message: "Error updating terms and conditions", error: err.message, });
    }
};
