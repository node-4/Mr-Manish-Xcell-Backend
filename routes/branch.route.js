const doc = require('../controllers/branch.controller');
const { authJwt, objectId } = require('../middlewares');
const router = require('express').Router();

router.post('/admin/branches', [authJwt.isAdmin], doc.createBranch);
router.get('/branches', doc.getAllBranchs);
router.get('/branches/:id', [objectId.validId], doc.getBranchById);
router.put('/admin/branches/:id', [authJwt.isAdmin, objectId.validId], doc.updateBranchById);
router.delete('/admin/branches/:id', [authJwt.isAdmin, objectId.validId], doc.deleteBranchById);

module.exports = router;