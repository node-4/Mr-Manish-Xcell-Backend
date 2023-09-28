// const bcrypt = require('bcryptjs/dist/bcrypt');
// const User = require('../models/user.model');
// const { createResponse } = require('../utils/response');

// exports.getALlUsers = async (req, res) => {
//     try {
//         const users = await User.find().lean();
//         if (users.length === 0) {
//             return createResponse(res, 200, "users not found", users);
//         }
//        return createResponse(res, 200, "found", users);
//     } catch (err) {
//         console.log(err);
//        return createResponse(res, 500, "internal server error " + err.message);
//     }
// };

// exports.getUserById = async (req, res) => {
//     try {
//         const users = await User.findById(req.params.id).lean();
//         if (users.length === 0) {
//             return createResponse(res, 200, "users not found", users);
//         }
//        return createResponse(res, 200, "found", users);
//     } catch (err) {
//         console.log(err);
//        return createResponse(res, 500, "internal server error " + err.message);
//     }
// };

// exports.updateUser = async (req, res) => {
//     try {
//         const password = bcrypt.hashSync(req.body.password, 8);

//         const {
//             firstName, lastName, middleName, phone, email, customerId, dateOfBirth, gender,
//             bloodGroup, doctorName, hospitalName, maritalStatus, father_spouseName, relationship,
//             firstLineAddress, secondLineAddress, country, state, district, pincode
//         } = req.body;
//         const user = await User.findById(req.params.id, {
//             firstName, lastName, middleName, phone, email, password, customerId, dateOfBirth, gender,
//             bloodGroup, doctorName, hospitalName, maritalStatus, father_spouseName, relationship,
//             firstLineAddress, secondLineAddress, country, state, district, pincode
//         }, { new: true });
//         if (!user) {
//             return createResponse(res, 402, "update user failed");
//         }
//        return createResponse(res, 200, "user updated", user);
//     } catch (err) {
//         console.log(err);
//        return createResponse(res, 500, "internal server error " + err.message);
//     }
// }
// exports.deleteUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         if (!user) {
//             return createResponse(res, 200, "user not found");
//         }
//        return createResponse(res, 200, "user deleted", user);
//     } catch (err) {
//         console.log(err);
//        return createResponse(res, 500, "internal server error " + err.message);
//     }
// }

const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("../models/user.model");
const { createResponse } = require("../utils/response");
const adminModel = require("../models/admin.model");

exports.getALlUsers = async (req, res) => {
    try {
        const users = await User.find().lean();
        if (users.length === 0) {
            return createResponse(res, 200, "users not found", {
                status: 0,
                data: users,
            });
        }
        return createResponse(res, 200, "found", { status: 1, data: users });
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "internal server error " + err.message, {
            status: 0,
        });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            return createResponse(res, 200, "user not found", { status: 0 });
        }
        return createResponse(res, 200, "found", { status: 1, data: user });
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "internal server error " + err.message, {
            status: 0,
        });
    }
};
exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, middleName, phone, email, customerId, dateOfBirth, gender, bloodGroup, doctorName, hospitalName, maritalStatus, father_spouseName, relationship, firstLineAddress, secondLineAddress, country, state, district, pincode, } = req.body;
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            return createResponse(res, 200, "user not found", { status: 0 });
        } else {
            let hasPassword;
            if (req.body.password) {
                hasPassword = bcrypt.hashSync(req.body.password, 8);
            }
            if (req.body.email) {
                console.log(user);
                const emailExists = await User.findOne({ _id: { $ne: user._id }, email: req.body.email });
                if (emailExists) {
                    console.log(emailExists);
                    return createResponse(res, 402, "email already exists", { status: 0, });
                }
            }
            if (req.body.mobile) {
                const mobileExists = await User.findOne({ _id: { $ne: user._id }, mobile: req.body.mobile });
                if (mobileExists) {
                    return createResponse(res, 402, "mobile number already exists", { status: 0, });
                }
            }
            let obj = {
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                middleName: middleName || user.middleName,
                password: hasPassword || user.password,
                phone: phone || user.phone,
                email: email || user.email,
                customerId: customerId || user.customerId,
                dateOfBirth: dateOfBirth || user.dateOfBirth,
                gender: gender || user.gender,
                bloodGroup: bloodGroup || user.bloodGroup,
                doctorName: doctorName || user.doctorName,
                hospitalName: hospitalName || user.hospitalName,
                maritalStatus: maritalStatus || user.maritalStatus,
                father_spouseName: father_spouseName || user.father_spouseName,
                relationship: relationship || user.relationship,
                firstLineAddress: firstLineAddress || user.firstLineAddress,
                secondLineAddress: secondLineAddress || user.secondLineAddress,
                country: country || user.country,
                state: state || user.state,
                district: district || user.district,
                pincode: pincode || user.pincode,
            }
            const update = await User.findByIdAndUpdate(req.params.id, { $set: obj }, { new: true });
            return createResponse(res, 200, "user updated", { status: 1, data: update });
        }
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "internal server error " + err.message, { status: 0, });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return createResponse(res, 200, "user not found", { status: 0 });
        }
        return createResponse(res, 200, "user deleted", { status: 1, data: user });
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "internal server error " + err.message, {
            status: 0,
        });
    }
};
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            return createResponse(res, 200, "user not found", { status: 0 });
        } else {
            let fileUrl;
            if (req.file) {
                fileUrl = req.file ? req.file.path : "";
            }
            let obj = {
                image: fileUrl || user.image
            }
            const update = await User.findByIdAndUpdate(req.params.id, { $set: obj }, { new: true });
            return createResponse(res, 200, "user updated", { status: 1, data: update });
        }
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "internal server error " + err.message, { status: 0, });
    }
};
exports.getAllUsersforSubAdmin = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const loggedInUser = await adminModel.findById(loggedInUserId).lean();
        if (!loggedInUser) { return createResponse(res, 404, "Logged-in user not found", { status: 0, }); }
        const users = await User.find({ _id: { $in: loggedInUser.userId } }).lean();
        if (users.length === 0) {
            return createResponse(res, 200, "No matching users found", { status: 0, data: [], });
        }
        return createResponse(res, 200, "Found users", { status: 1, data: users, });
    } catch (err) {
        return createResponse(res, 500, "Internal server error " + err.message, { status: 0, });
    }
};
