const doc = require('../controllers/catalogue.controller');
const { authJwt, objectId, bodies } = require('../middlewares');
const router = require('express').Router();

router.post('/admin/catalogues', [authJwt.isAdmin, bodies.catalogueBodies], doc.createCatalogue);
router.get('/catalogues', doc.getCatalogues);
router.get('/catalogues/:id', [objectId.validId], doc.getCatalogueById);
router.put('/admin/catalogues/:id', [authJwt.isAdmin, objectId.validId], doc.updateCatalogueById);
router.delete('/admin/catalogues/:id', [authJwt.isAdmin, objectId.validId], doc.deleteCatalogueById);

module.exports = router;