const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
            minLength: 10,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
        },
        confirmPassword: {
            type: String,
        },
        branch: {
            type: String,
            default: "",
        },
        role: {
            type: String,
        },
        userId: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", schema);
