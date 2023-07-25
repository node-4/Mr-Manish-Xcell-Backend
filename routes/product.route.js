const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authJwt, objectId, bodies } = require('../middlewares');

// Create a new product
router.post('/admin/products', [authJwt.isAdmin, bodies.validateProductFields], productController.createProduct);

// Get all products
router.get('/products', productController.getAllProducts);

// Get a single product by ID
router.get('/products/:id', [objectId.validId], productController.getProductById);

// Update a product by ID
router.put('/admin/products/:id', [objectId.validId, authJwt.isAdmin], productController.updateProductById);

// Delete a product by ID
router.delete('/admin/products/:id', [objectId.validId, authJwt.isAdmin], productController.deleteProductById);

module.exports = router;
