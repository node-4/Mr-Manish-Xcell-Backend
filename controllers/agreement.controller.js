const Agreement = require("../models/agreement.model");
const User = require("../models/user.model");
const Terms = require("../models/terms.model");

const createAgreement = async (req, res) => {
    try {
        const { termsId } = req.body;
        // Find the user and terms for the agreement
        const userId = req.user._id;
        const terms = await Terms.findById(termsId);
        if (!terms) {
            return res
                .status(400)
                .json({ status: 0, message: "User or terms not found" });
        }
        // Create a new agreement
        const agreement = new Agreement({
            userId,
            termsId,
            agreed_at: new Date(),
        });
        // Save the agreement
        const updatedAgreement = await agreement.save();
        return res.status(201).json({
            status: 1,
            message: "agreed terms and conditions",
            data: updatedAgreement,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ status: 0, message: "Internal server error" });
    }
};

const getAgreementsByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const agreements = await Agreement.find({ userId }).populate("termsId");
        if (agreements.length === 0) {
            return res.status(200).json({
                status: 0,
                message: "agreed terms and conditions not found",
            });
        }
        return res.status(200).json({ status: 1, data: agreements });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ status: 0, message: "Internal server error" });
    }
};
module.exports = { createAgreement, getAgreementsByUser };
