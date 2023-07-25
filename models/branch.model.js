const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        branch: {
            type: String,
        },
        address: {
            type: String,
            default: "",
        },
        licence: {
            type: String,
            default: "",
        },
        gstId: {
            type: String,
            default: "",
        },
        phone: {
            type: String,
            default: "",
        },
        members: {
            type: [mongoose.SchemaTypes.ObjectId],
            ref: "Admin",
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Branch", schema);
