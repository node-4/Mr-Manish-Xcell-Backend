const { authJwt } = require("../middlewares");
const user = require("../controllers/user.controller");
var multer = require("multer");
const { ReminderController } = require("../controllers/reminder");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "djgrqoefp", api_key: "274167243253962", api_secret: "3mkqkDDusI5Hf4flGNkJNz4PHYg", });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "x-cell/profile", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const upload = multer({ storage: storage });
module.exports = (app) => {
    //    users routes
    app.get("/api/v1/users", user.getALlUsers);
    app.get("/api/v1/users/:id", user.getUserById);
    app.put("/api/v1/users/:id", [authJwt.verifyToken], user.updateUser);
    app.put("/api/v1/updateProfile/:id", [authJwt.verifyToken], upload.single('image'), user.updateProfile);
    app.delete("/api/v1/users/:id", [authJwt.verifyToken], user.deleteUser);
    // admin routes
    app.get("/api/v1/users", user.getALlUsers);
    app.get("/api/v1/admin/users/:id", user.getUserById);
    app.put("/api/v1/admin/users/:id", [authJwt.isAdmin], user.updateUser);
    app.delete("/api/v1/admin/users/:id", [authJwt.isAdmin], user.deleteUser);
    app.post("/api/v1/users/createReminder", [authJwt.verifyToken], ReminderController.createReminder);
    app.get("/api/v1/getReminder", [authJwt.verifyToken], ReminderController.getReminder);
    app.delete("/api/v1/users/deleteReminder/:id", [authJwt.verifyToken], ReminderController.deleteReminder);
    app.put("/api/v1/users/updateReminder/:id", [authJwt.verifyToken], ReminderController.updateReminder);

    app.get("/api/v1/usersforSubAdmin", [authJwt.isAdmin], user.getAllUsersforSubAdmin);

};
