const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { validateInvoice, authJwt, objectId } = require('../middlewares');
// Create a new invoice
router.post('/', [authJwt.isAdmin, validateInvoice.checkInvoice], invoiceController.createInvoice);

// Get all invoices
router.get('/', invoiceController.getInvoices);

// Get a single invoice
router.get('/:id', [objectId.validId], invoiceController.getInvoice);

// Update an invoice
router.put('/:id', [authJwt.isAdmin, objectId.validId], invoiceController.updateInvoice);

// Delete an invoice
router.delete('/:id', [authJwt.isAdmin, objectId.validId], invoiceController.deleteInvoice);

module.exports = router;
