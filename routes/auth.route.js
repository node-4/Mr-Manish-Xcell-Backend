const auth = require("../controllers/authController");
const { validate } = require("../middlewares");
module.exports = (app) => {
    app.post("/api/v1/auth/signup", auth.signup);
    app.post("/api/v1/auth/loginWithOtp", auth.loginwithotp);
    app.post("/api/v1/auth/loginWithEmail", auth.loginWithEmail);
    app.post("/api/v1/auth/verifyOtp/:id", auth.verifyOTP);
    app.post("/api/v1/add-customer", auth.addCustomer);
    app.post("/api/v1/auth/forgetPassword", auth.forgetPassword);
    app.post("/api/v1/auth/forgotVerifyotp/:id", auth.forgotVerifyotp);
    app.post("/api/v1/auth/changePassword/:id", auth.changePassword);
};
