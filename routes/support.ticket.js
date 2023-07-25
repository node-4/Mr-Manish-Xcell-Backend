const express = require("express");
const router = express.Router();
const supportTicketController = require("../controllers/support.controller");
const { authJwt, objectId } = require("../middlewares");

// Route to create a new support ticket
router.post("/support-tickets", supportTicketController.createSupportTicket);

// Route to get all support tickets
router.get("/support-tickets", supportTicketController.getAllSupportTickets);
router.get(
    "/support-tickets/:id",
    [objectId.validId],
    supportTicketController.getSupportTicketById
);

// Route to update a support ticket by ID
router.patch(
    "/support-tickets/:id",
    [objectId.validId],
    supportTicketController.updateSupportTicket
);

// Route to delete a support ticket by ID
router.delete(
    "/support-tickets/:id",
    [objectId.validId],
    supportTicketController.deleteSupportTicket
);

module.exports = router;
