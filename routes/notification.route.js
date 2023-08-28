const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notification.controller");

// Create a new notification for multiple recipients
router.post(
    "/admin/notifications",
    notificationController.createNotificationForMultipleRecipients
);

// Get all notifications for one recipient
router.get(
    "/notifications1/:id",
    notificationController.getNotificationsForRecipient
);

// Update a notification by ID
router.patch(
    "/notifications/:id",
    notificationController.updateNotificationById
);
router.delete(
    "/notifications/:id",
    notificationController.deleteNotificationById
);
router.get(
    "/notification/:id",
    notificationController.getAllNotificationsForUser1
);
router.get("/notifications", notificationController.getAllNotificationsForUser);
module.exports = router;
