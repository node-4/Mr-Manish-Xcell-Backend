const Document = require("../models/document.model");
const mongoose = require("mongoose");
exports.getAllDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find({ userId: req.user._id });
        if (documents.length === 0) {
            return res.status(200).json({
                status: 0,
                success: false,
                message: "documents not found",
                data: [],
            });
        }
        return res.status(200).json({ status: 1, success: true, data: documents });
    } catch (error) {
        res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};
exports.createDocument = async (req, res, next) => {
    try {
        let fileUrl;
        if (req.file) {
            fileUrl = req.file ? req.file.path : "";
        }
        let obj = {
            userId: req.user._id,
            document: fileUrl
        }
        const newDocument = await Document.create(obj);
        return res.status(201).json({ status: 1, success: true, data: newDocument });
    } catch (error) {
        return res.status(500).json({ status: 0, success: false, message: error.message, });
    }
};
exports.getDocumentById = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id).lean();
        if (!document) {
            return res.status(200).json({
                status: 0,
                success: false,
                message: "Document not found",
            });
        }
        return res.status(200).json({ status: 1, success: true, data: document });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};
exports.updateDocumentById = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id).lean();
        if (!document) {
            return res.status(404).json({ status: 0, success: false, message: "Document not found", });
        } else {
            let fileUrl;
            if (req.file) {
                fileUrl = req.file ? req.file.path : "";
            }
            let obj = {
                userId: req.user._id,
                document: fileUrl || document.document
            }
            const update = await Document.findByIdAndUpdate(document._id, obj, { new: true, runValidators: true, });
            return res.status(200).json({ status: 1, success: true, data: update });
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};
exports.deleteDocumentById = async (req, res, next) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        if (!document) {
            return res.status(404).json({
                status: 0,
                success: false,
                message: "Document not found",
            });
        }
        return res.status(200).json({ status: 1, success: true, data: {} });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};
exports.getMonthlyDocumentOfUser = async (req, res) => {
    try {
        const { id } = req.params;
        const docs = await Document.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                    documents: { $push: "$$ROOT" },
                },
            },
            {
                $project: {
                    month: "$_id.month",
                    year: "$_id.year",
                    documents: 1,
                    _id: 0,
                },
            },
        ]);
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        // console.log(docs);
        const data = docs.map((doc) => {
            return {
                month: monthNames[doc.month - 1],
                year: doc.year,
                documents: doc.documents,
            };
        });
        // console.log(data);
        return res.status(200).json({ status: 1, data: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};
