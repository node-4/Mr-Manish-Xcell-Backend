const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
const ObjectId = require("mongoose").Types.ObjectId;
const Admin = require("../models/admin.model");
const Branch = require("../models/branch.model");
exports.signUp = async (req, res) => {
    try {
        if (req.body.confirmPassword !== req.body.password) {
            return res
                .status(403)
                .send({ status: 0, message: "Passwords do not match" });
        }
        if (req.body.role === "sub-Admin") {
            if (!req.body.branch) {
                return res.status(400).send({ message: "branch is required" });
            }
        }
        const adminExists = await Admin.findOne({
            $or: [{ email: req.body.email }, { phone: req.body.phone }],
        });
        if (adminExists) {
            return res.status(400).send({
                status: 0,
                message: "user already exists with this email or phone number",
            });
        }
        const adminObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            role: req.body.role,
            branch: req.body.branch,
            confirmPassword: bcrypt.hashSync(req.body.confirmPassword, 8),
            password: bcrypt.hashSync(req.body.password, 8),
        };

        const adminCreated = await Admin.create(adminObj);

        console.log(
            `#### ${adminCreated.email} ${adminCreated._id} created ####`
        );
        if (req.body.role === "sub-Admin") {
            const branch = await Branch.findOne({ branch: adminObj.branch });
            branch.members.push(adminCreated._id);
            await branch.save();
            // console.log(branch);
        }

        res.status(201).send({
            status: 1,
            message: "signed up successfully",
            data: adminCreated,
        });
    } catch (err) {
        console.log("#### error while Admin sign up #### ", err.message);
        res.status(500).send({
            status: 0,
            message: "Internal server error while creating Admin",
        });
    }
};

exports.signIn = async (req, res) => {
    try {
        if (!req.body.email) {
            return res
                .status(400)
                .send({ status: 0, message: "email is required" });
        }
        if (!req.body.password) {
            return res
                .status(400)
                .send({ status: 0, message: "password is required" });
        }
        if (!req.body.role) {
            return res.status(400).send({
                status: 0,
                message: "role is required",
            });
        }
        const admin = await Admin.findOne({
            email: req.body.email,
            role: req.body.role,
        });
        if (!admin) {
            return res.status(400).send({
                status: 0,
                message: `Failed! ${req.body.role} passed doesn't exist`,
            });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            admin.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({
                status: 0,
                message: "Wrong password",
            });
        }

        const accessToken = jwt.sign({ id: admin.email }, authConfig.secret, {
            expiresIn: authConfig.accessTokenTime,
        });

        console.log(`#### ${admin.email} ${admin._id} logged in ####`);

        res.status(200).send({
            status: 1,
            adminId: admin._id,
            email: admin.email,
            accessToken: accessToken,
            // refreshToken: refreshToken,
        });
    } catch (err) {
        console.log("#### Error while Admin signing in ##### ", err.message);
        res.status(500).send({
            status: 0,
            message: "Internal server error while Admin signing in",
        });
    }
};

exports.refreshAccessToken = (req, res) => {
    const accessToken = jwt.sign({ id: req.Admin.AdminId }, authConfig.secret, {
        expiresIn: authConfig.accessTokenTime,
    });
    res.status(200).send({
        status: 1,
        accessToken: accessToken,
    });
};

exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res
                .status(404)
                .json({ status: 0, message: "Admin not found" });
        }
        console.log(`#### admin with < ${admin.email} >  deleted ####` + admin);
        return res.status(200).json({ status: 0, message: "Admin deleted" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            status: 0,
            message: "server error while deleting admin",
            error: err.message,
        });
    }
};

exports.getAdmins = async (req, res) => {
    try {
        let queryObj = {};
        if (req.query.role) {
            queryObj.role = req.query.role;
        }
        const admins = await Admin.find(queryObj).lean();
        if (admins.length === 0) {
            return res
                .status(404)
                .json({ status: 0, message: "Admin not found" });
        }
        return res.status(200).json({ status: 1, data: admins });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            status: 0,
            message: "server error while getting admins",
            error: err.message,
        });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const { firstName, lastName, role, email, phone } = req.body;
        const password = bcrypt.hashSync(req.body.password, 8);
        const confirmPassword = bcrypt.hashSync(req.body.confirmPassword, 8);

        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            {
                firstName,
                confirmPassword,
                password,
                lastName,
                role,
                email,
                phone,
            },
            { new: true }
        );
        if (!admin) {
            return res
                .status(404)
                .json({ status: 0, message: "Admin not found" });
        }

        res.status(200).send({
            status: 1,
            message: "Admin updated successfully",
            data: admin,
        });
    } catch (err) {
        console.log("#### Error while updating admin data #### /n", err);
        res.status(500).send({
            status: 0,
            message: "Internal server error while updating admin data",
        });
    }
};

exports.findByAdminId = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res
                .status(404)
                .json({ status: 0, message: "Admin not found" });
        }
        return res.status(200).json({ status: 1, data: admin });
    } catch (err) {
        console.log(
            "#### Error while searching for the admin #### ",
            err.message
        );
        res.status(500).send({
            status: 0,
            message: "Internal server error while fetching data",
        });
    }
};
