const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notification.controller");

router.post("/admin/notifications", notificationController.createNotificationForMultipleRecipients);
router.get("/notifications1/:id", notificationController.getNotificationsForRecipient);
router.patch("/notifications/:id", notificationController.updateNotificationById);
router.delete("/notifications/:id", notificationController.deleteNotificationById);
router.get("/notification/:id", notificationController.getAllNotificationsForUser1);
router.get("/notifications", notificationController.getAllNotificationsForUser);
module.exports = router;
