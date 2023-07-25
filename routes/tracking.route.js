const express = require("express");
const router = express.Router();
const orderTrackingController = require("../controllers/tracking.controller");
const { authJwt, objectId, bodies } = require("../middlewares");
// GET all order tracking records
router.get("/orderTrackings", orderTrackingController.getOrderTrackings);

// GET a single order tracking record by ID
router.get("/orderTrackings/:id", orderTrackingController.getOrderTrackingById);

// POST a new order tracking record
router.post(
    "/admin/orderTrackings/",
    [authJwt.isAdmin, bodies.requiredFieldsMiddleware],
    orderTrackingController.createOrderTracking
);

// PUT/UPDATE an existing order tracking record
router.patch(
    "/admin/orderTrackings/:id",
    [authJwt.isAdmin, objectId.validId],
    orderTrackingController.updateOrderTracking
);

// DELETE an order tracking record by ID
router.delete(
    "/admin/orderTrackings/:id",
    [authJwt.isAdmin, objectId.validId],
    orderTrackingController.deleteOrderTracking
);
router.get(
    "/admin-orderTrackings/:id",
    orderTrackingController.trackingForAdmin
);
module.exports = router;
