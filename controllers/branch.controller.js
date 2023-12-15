const Branch = require("../models/branch.model");
exports.getAllBranchs = async (req, res, next) => {
    try {
        let queryObj = {};
        if (req.query.branch) {
            queryObj.branch = new RegExp(req.query.branch, "i");
        }
        const branchs = await Branch.find(queryObj).populate("members");
        if (branchs.length === 0) {
            return res.status(200).json({ status: 0, message: "Branch not found" });
        }
        return res.status(200).json({ status: 1, success: true, data: branchs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, success: false, error: error.message, });
    }
};
exports.createBranch = async (req, res, next) => {
    try {
        const { branch, gstId, address, licence, phone } = req.body;
        if (!branch || !gstId || !address || !licence || !phone) {
            return res.status(200).json({ status: 0, success: false, message: "Please enter all fields", });
        }
        const branchExists = await Branch.findOne({ branch });
        if (branchExists) {
            return res.status(200).json({ status: 0, success: false, message: "Branch already exists with name " + branch, });
        }
        const newBranch = await Branch.create(req.body);
        return res.status(201).json({ status: 1, success: true, data: newBranch });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, success: false, error: error.message, });
    }
};
exports.getBranchById = async (req, res, next) => {
    try {
        const branch = await Branch.findById(req.params.id).lean().populate("members");
        if (!branch) {
            return res.status(200).json({ status: 0, success: false, message: "Branch not found", });
        }
        return res.status(200).json({ status: 1, success: true, data: branch });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, success: false, error: error.message, });
    }
};
exports.updateBranchById = async (req, res, next) => {
    try {
        const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, });
        if (!branch) {
            return res.status(200).json({ status: 0, success: false, message: "Branch not found", });
        }
        return res.status(200).json({ status: 1, success: true, data: branch });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, success: false, error: error.message, });
    }
};
exports.deleteBranchById = async (req, res, next) => {
    try {
        const branch = await Branch.findByIdAndDelete(req.params.id);
        if (!branch) {
            return res.status(200).json({ status: 0, success: false, message: "Branch not found", });
        }
        return res.status(200).json({ status: 1, success: true, message: "deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, success: false, error: error.message, });
    }
};