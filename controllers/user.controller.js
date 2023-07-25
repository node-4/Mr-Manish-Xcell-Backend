// const bcrypt = require('bcryptjs/dist/bcrypt');
// const User = require('../models/user.model');
// const { createResponse } = require('../utils/response');

// exports.getALlUsers = async (req, res) => {
//     try {
//         const users = await User.find().lean();
//         if (users.length === 0) {
//             return createResponse(res, 200, "users not found", users);
//         }
//         createResponse(res, 200, "found", users);
//     } catch (err) {
//         console.log(err);
//         createResponse(res, 500, "internal server error " + err.message);
//     }
// };

// exports.getUserById = async (req, res) => {
//     try {
//         const users = await User.findById(req.params.id).lean();
//         if (users.length === 0) {
//             return createResponse(res, 200, "users not found", users);
//         }
//         createResponse(res, 200, "found", users);
//     } catch (err) {
//         console.log(err);
//         createResponse(res, 500, "internal server error " + err.message);
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
//         createResponse(res, 200, "user updated", user);
//     } catch (err) {
//         console.log(err);
//         createResponse(res, 500, "internal server error " + err.message);
//     }
// }
// exports.deleteUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         if (!user) {
//             return createResponse(res, 200, "user not found");
//         }
//         createResponse(res, 200, "user deleted", user);
//     } catch (err) {
//         console.log(err);
//         createResponse(res, 500, "internal server error " + err.message);
//     }
// }

const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("../models/user.model");
const { createResponse } = require("../utils/response");

exports.getALlUsers = async (req, res) => {
    try {
        const users = await User.find().lean();
        if (users.length === 0) {
            return createResponse(res, 200, "users not found", {
                status: 0,
                data: users,
            });
        }
        createResponse(res, 200, "found", { status: 1, data: users });
    } catch (err) {
        console.log(err);
        createResponse(res, 500, "internal server error " + err.message, {
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
        createResponse(res, 200, "found", { status: 1, data: user });
    } catch (err) {
        console.log(err);
        createResponse(res, 500, "internal server error " + err.message, {
            status: 0,
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            middleName,
            phone,
            email,
            customerId,
            dateOfBirth,
            gender,
            bloodGroup,
            doctorName,
            hospitalName,
            maritalStatus,
            father_spouseName,
            relationship,
            firstLineAddress,
            secondLineAddress,
            country,
            state,
            district,
            pincode,
        } = req.body;
        if (req.body.password) {
            const password = bcrypt.hashSync(req.body.password, 8);
        }
        if (req.body.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return createResponse(res, 402, "email already exists", {
                    status: 0,
                });
            }
        }
        if (req.body.mobile) {
            const mobileExists = await User.findOne({ mobile });
            if (mobileExists) {
                return createResponse(
                    res,
                    402,
                    "mobile number already exists",
                    {
                        status: 0,
                    }
                );
            }
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                firstName,
                lastName,
                middleName,
                phone,
                email,
                
                customerId,
                dateOfBirth,
                gender,
                bloodGroup,
                doctorName,
                hospitalName,
                maritalStatus,
                father_spouseName,
                relationship,
                firstLineAddress,
                secondLineAddress,
                country,
                state,
                district,
                pincode,
            },
            { new: true }
        );

        if (!user) {
            return createResponse(res, 402, "update user failed", {
                status: 0,
            });
        }

        createResponse(res, 200, "user updated", { status: 1, data: user });
    } catch (err) {
        console.log(err);
        createResponse(res, 500, "internal server error " + err.message, {
            status: 0,
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return createResponse(res, 200, "user not found", { status: 0 });
        }
        createResponse(res, 200, "user deleted", { status: 1, data: user });
    } catch (err) {
        console.log(err);
        createResponse(res, 500, "internal server error " + err.message, {
            status: 0,
        });
    }
};
