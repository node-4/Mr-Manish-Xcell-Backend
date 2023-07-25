// import mongoose module
const mongoose = require('mongoose');

// define the privacy policy schema
const privacyPolicySchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            // required: true
        }
    },
    {
        timestamps: true
    }
);

// create the privacy policy model
const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);

// export the model
module.exports = PrivacyPolicy;
