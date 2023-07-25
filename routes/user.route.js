const { authJwt } = require("../middlewares");
const user = require("../controllers/user.controller");

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
};
