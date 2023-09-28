const jwt = require("jsonwebtoken");
const LoginModel = require("../models/user.model");
const authConfig = require("../configs/auth.config");
const AdminModel = require("../models/admin.model");

const verifyToken = (req, res, next) => {
    const token =
        req.get("Authorization")?.split("Bearer ")[1] ||
        req.headers["x-access-token"];
    console.log(token);
    if (!token) {
        return res.status(403).send({
            status: 0,
            message: "no token provided! Access prohibited",
        });
    }

    jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if (err) {
            console.log(err);
            return res
                .status(401)
                .send({ status: 0, message: "unauthorized !" });
        }
        console.log(decoded);
        const user = await LoginModel.findOne({ _id: decoded.id });
        console.log(user);
        if (!user) {
            return res.status(400).send({
                status: 0,
                message: "The user that this token belongs to does not exist",
            });
        }
        req.user = user;
        //console.log(user);
        next();
    });
};
const isAdmin = (req, res, next) => {
    const token = req.headers["x-access-token"] || req.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
        return res.status(403).send({ status: 0, message: "no token provided! Access prohibited", });
    }
    jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ status: 0, message: "unauthorized ! Admin role is required! ", });
        }
        const user = await AdminModel.findOne({ email: decoded.id, role: decoded.role, });
        if (!user) {
            return res.status(400).send({ status: 0, message: "The admin that this  token belongs to does not exist", });
        }
        req.user = user;
        next();
    });
};
const userAdmin = async (req, res, next) => {
    if (req.user.role !== "Admin" && req.user.role !== "admin") {
        return res.status(403).json({ status: 0, message: "unauthorized ! Admin role is required", });
    }
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    userAdmin,
};
