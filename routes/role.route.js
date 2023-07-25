const doc = require('../controllers/role.controller');
const { authJwt, objectId } = require('../middlewares');
const router = require('express').Router();

router.post('/admin/roles', [authJwt.isAdmin], doc.createRole);
router.get('/roles', doc.getAllRoles);
router.get('/roles/:id', [objectId.validId], doc.getRoleById);
router.put('/admin/roles/:id', [authJwt.isAdmin, objectId.validId], doc.updateRoleById);
router.delete('/admin/roles/:id', [authJwt.isAdmin, objectId.validId], doc.deleteRoleById);

module.exports = router;