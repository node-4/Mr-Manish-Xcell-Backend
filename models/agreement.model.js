// Import the necessary libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user agreement schema
const agreementSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    termsId: { type: Schema.Types.ObjectId, ref: 'Terms' },
    agreed_at: { type: Date, default: Date.now }
});

// Define the user agreement model
const Agreement = mongoose.model('Agreement', agreementSchema);

// Export the model for use in other modules
module.exports = Agreement;
