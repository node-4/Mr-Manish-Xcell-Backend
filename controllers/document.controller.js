const Document = require("../models/document.model");
// const Document = require('../models/Document');
const mongoose = require("mongoose");
const createResponse = require("../utils/response");
// Get all documents
exports.getAllDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find();
        if (documents.length === 0) {
            return res.status(200).json({
                status: 0,
                success: false,
                message: "documents not found",
                data: [],
            });
        }
        res.status(200).json({ status: 1, success: true, data: documents });
    } catch (error) {
        res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};

// Create a new document
exports.createDocument = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { document } = req.body;
        const newDocument = await Document.create({ userId, document });
        res.status(201).json({ status: 1, success: true, data: newDocument });
    } catch (error) {
        res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};

// Get a single document by ID
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
        res.status(200).json({ status: 1, success: true, data: document });
    } catch (error) {
        res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};

// Update a document by ID
exports.updateDocumentById = async (req, res, next) => {
    try {
        const document = await Document.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!document) {
            return res.status(404).json({
                status: 0,
                success: false,
                message: "Document not found",
            });
        }
        res.status(200).json({ status: 1, success: true, data: document });
    } catch (error) {
        res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};

// Delete a document by ID
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
        res.status(200).json({ status: 1, success: true, data: {} });
    } catch (error) {
        res.status(500).json({
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
        res.status(200).json({ status: 1, data: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
