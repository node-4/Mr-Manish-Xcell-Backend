const PrivacyPolicy = require("../models/privacy.model");
exports.getAllPrivacyPolicies = async (req, res) => {
    try {
        const policies = await PrivacyPolicy.find();
        if (policies.length === 0) {
            return res.status(200).json({ status: 0, message: "No privacy policy found" });
        }
        return res.status(200).json({ status: 1, data: policies[policies.length - 1], });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.getPrivacyPolicyById = async (req, res) => {
    try {
        const policy = await PrivacyPolicy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ status: 0, message: "Privacy policy not found" });
        }
        return res.status(200).json({ status: 1, data: policy });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.createPrivacyPolicy = async (req, res) => {
    try {
        const policy = new PrivacyPolicy(req.body);
        await policy.save();
        return res.status(201).json({ status: 1, data: policy });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ status: 0, message: err.message });
    }
};
exports.updatePrivacyPolicy = async (req, res) => {
    try {
        const policy = await PrivacyPolicy.findByIdAndUpdate(req.params.id, req.body, { new: true }
        );
        if (!policy) {
            return res.status(200).json({ status: 0, message: "Privacy policy not found" });
        }
        return res.status(200).json({ status: 1, data: policy });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ status: 0, message: err.message });
    }
};
exports.deletePrivacyPolicy = async (req, res) => {
    try {
        const policy = await PrivacyPolicy.findByIdAndDelete(req.params.id);
        if (!policy) {
            return res.status(200).json({ status: 0, message: "Privacy policy not found" });
        }
        return res.status(200).json({ status: 1, message: "Privacy policy deleted" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};