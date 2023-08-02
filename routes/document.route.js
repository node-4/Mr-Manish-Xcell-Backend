const doc = require("../controllers/document.controller");
const { authJwt } = require("../middlewares");
const router = require("express").Router();
var multer = require("multer");
const authConfig = require("../configs/auth.config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "djgrqoefp", api_key: "274167243253962", api_secret: "3mkqkDDusI5Hf4flGNkJNz4PHYg", });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "x-cell/document", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const upload = multer({ storage: storage });

router.post("/documents", [authJwt.verifyToken], upload.single('image'), doc.createDocument);
router.get("/documents", [authJwt.verifyToken], doc.getAllDocuments);
router.get("/documents/:id", doc.getDocumentById);
router.put("/documents/:id", [authJwt.verifyToken], upload.single('image'), doc.updateDocumentById);
router.delete("/documents/:id", [authJwt.verifyToken], doc.deleteDocumentById);
router.get("/monthly-documents/:id", doc.getMonthlyDocumentOfUser);
module.exports = router;
