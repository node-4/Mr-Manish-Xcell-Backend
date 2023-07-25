const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the terms schema
const termsSchema = new Schema({
    content: { type: String, required: true },

}, { timestamps: true });

// Define the terms model
module.exports = mongoose.model('Terms', termsSchema);

// Export the model for use in other modules
;
