const express = require('express');
const router = express.Router();
const termsController = require('../controllers/agreement.controller');
const { authJwt, objectId } = require('../middlewares');
// Route for getting the current terms and conditions
router.get('/admin/agreements/:id', termsController.getAgreementsByUser);

// Route for creating a new set of terms and conditions
router.post('/agreements', [authJwt.verifyToken], termsController.createAgreement);

// Route for updating a set of terms and conditions
// router.put('/admin/terms/:id', [authJwt.isAdmin, objectId.validId, authJwt.userAdmin], termsController.updateTerms);

// // Route for deleting a set of terms and conditions
// router.delete('/admin/terms/:id', [authJwt.isAdmin, objectId.validId, authJwt.userAdmin], termsController.deleteTerms);

module.exports = router;
