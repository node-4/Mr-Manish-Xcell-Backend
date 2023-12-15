const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    }, middleName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    customerId: {
        type: Number,
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    otp: {
        type: Number,
    },
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: String,
    },
    bloodGroup: {
        type: String,
    },
    doctorName: {
        type: String,
    },
    hospitalName: {
        type: String,
    },
    maritalStatus: {
        type: String,
    },
    father_spouseName: {
        type: String,
    },
    relationship: {
        type: String,
    },
    firstLineAddress: {
        type: String,
    },
    secondLineAddress: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    district: {
        type: String,
    },
    pincode: {
        type: String,
    },
    deviceToken: {
        type: String,
    },
    refferalCode: {
        type: String,
    },
    image: {
        type: String,
    },
    refferalUser: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);