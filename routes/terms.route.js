const express = require('express');
const router = express.Router();
const termsController = require('../controllers/terms.controller');
const { authJwt, objectId } = require('../middlewares');
// Route for getting the current terms and conditions
router.get('/terms', termsController.getTerms);

// Route for creating a new set of terms and conditions
router.post('/admin/terms', [authJwt.isAdmin, authJwt.userAdmin], termsController.createTerms);

// Route for updating a set of terms and conditions
router.put('/admin/terms/:id', [authJwt.isAdmin, objectId.validId, authJwt.userAdmin], termsController.updateTerms);

// Route for deleting a set of terms and conditions
router.delete('/admin/terms/:id', [authJwt.isAdmin, objectId.validId, authJwt.userAdmin], termsController.deleteTerms);

module.exports = router;
