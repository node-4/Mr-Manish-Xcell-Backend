const { authJwt } = require("../middlewares");
const user = require("../controllers/user.controller");
const {ReminderController} = require("../controllers/reminder");

module.exports = (app) => {
    //    users routes
    app.get("/api/v1/users", user.getALlUsers);
    app.get("/api/v1/users/:id", user.getUserById);
    app.put("/api/v1/users/:id", [authJwt.verifyToken], user.updateUser);
    app.delete("/api/v1/users/:id", [authJwt.verifyToken], user.deleteUser);
    // admin routes
    app.get("/api/v1/users", user.getALlUsers);
    app.get("/api/v1/admin/users/:id", user.getUserById);
    app.put("/api/v1/admin/users/:id", [authJwt.isAdmin], user.updateUser);
    app.delete("/api/v1/admin/users/:id", [authJwt.isAdmin], user.deleteUser);
    app.post("/api/v1/users/createReminder", [authJwt.verifyToken], ReminderController.createReminder);
    app.delete("/api/v1/users/deleteReminder/:id", [authJwt.verifyToken], ReminderController.deleteReminder);
    app.put("/api/v1/users/updateReminder/:id", [authJwt.verifyToken], ReminderController.updateReminder);
};
