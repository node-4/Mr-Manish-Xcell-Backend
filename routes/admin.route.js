const adminController = require("../controllers/admin.controller");
const { authJwt, validate } = require("../middlewares");

module.exports = (app) => {
    app.post("/api/v1/admin/signup", [validate.adminSignup], adminController.signUp);
    app.post("/api/v1/admin/login", adminController.signIn);
    app.put("/api/v1/admin/:id", [authJwt.isAdmin], adminController.updateAdmin);
    app.get("/api/v1/admin/:id", [authJwt.isAdmin], adminController.findByAdminId);
    app.get("/api/v1/admin", [authJwt.isAdmin], adminController.getAdmins);
    app.put("/api/v1/admin/assign/:id", [authJwt.isAdmin], adminController.assignUserTosubAdmin);
    app.put("/api/v1/admin/unassign/:id", [authJwt.isAdmin], adminController.removeUserTosubAdmin);

};
