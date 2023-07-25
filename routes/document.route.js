const doc = require("../controllers/document.controller");
const { authJwt } = require("../middlewares");
const router = require("express").Router();

router.post("/documents", [authJwt.verifyToken], doc.createDocument);
router.get("/documents", doc.getAllDocuments);
router.get("/documents/:id", doc.getDocumentById);
router.put("/documents/:id", [authJwt.verifyToken], doc.updateDocumentById);
router.delete("/documents/:id", [authJwt.verifyToken], doc.deleteDocumentById);
router.get("/monthly-documents/:id", doc.getMonthlyDocumentOfUser);
module.exports = router;
