const express = require('express');
const router = express.Router();
const hubCityController = require('../controllers/city.controller');
const { authJwt, objectId } = require('../middlewares');
router.post('/admin/hub-cities', [authJwt.isAdmin], hubCityController.createCity);
router.get('/hub-cities', hubCityController.getCities);
router.get('/hub-cities/:id', hubCityController.getCityById);
router.put('/admin/hub-cities/:id', [authJwt.isAdmin, objectId.validId], hubCityController.updateCity);
router.delete('/admin/hub-cities/:id', [authJwt.isAdmin, objectId.validId], hubCityController.deleteCity);

module.exports = router;
