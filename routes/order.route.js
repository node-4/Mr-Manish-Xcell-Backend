const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authJwt, objectId } = require("../middlewares");
const { upload, upload1 } = require("../utils/upload");
// Get all orders
router.get("/orders", orderController.getAllOrders);
router.get("/ordersforSubAdmin", [authJwt.isAdmin], orderController.getAllOrdersforSubAdmin);

// Create a new order
router.post("/orders", orderController.createOrder);

// Get an order by ID
router.get("/orders/:id", orderController.getOrderById);

// Update an order
router.patch(
    "/admin/orders/:id",
    [authJwt.isAdmin, objectId.validId],
    orderController.updateOrder
);

// Delete an order
router.delete(
    "/admin/orders/:id",
    [authJwt.isAdmin, objectId.validId],
    orderController.deleteOrder
);

router.get("/download", orderController.download);
router.post("/upload", upload1.single("file"), orderController.import);
router.get("/countorders", orderController.getOrderCountsByMonth);
router.post("/order-add", orderController.addOrder);
module.exports = router;
