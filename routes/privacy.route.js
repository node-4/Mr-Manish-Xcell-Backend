const express = require('express');
const router = express.Router();
const privacyPolicyController = require('../controllers/privacy.controller');

// Create a new privacy policy
router.post('/privacy', privacyPolicyController.createPrivacyPolicy);

// Get all privacy policies
router.get('/privacy', privacyPolicyController.getAllPrivacyPolicies);

// Get a specific privacy policy by ID
router.get('/privacy/:id', privacyPolicyController.getPrivacyPolicyById);

// Update a specific privacy policy by ID
router.patch('/privacy/:id', privacyPolicyController.updatePrivacyPolicy);

// Delete a specific privacy policy by ID
router.delete('/privacy/:id', privacyPolicyController.deletePrivacyPolicy);

module.exports = router;
