const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
const upload1 = multer({ storage: storage1 });
module.exports = { upload, upload1 };
