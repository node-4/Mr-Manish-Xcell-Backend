const { createResponse } = require("../utils/response");
const newOTP = require("otp-generators");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const authConfig = require("../configs/auth.config");
const sendSMS = require("../utils/sendSms");
exports.signup = async (req, res) => {
    try {
        const password = bcrypt.hashSync(req.body.password, 8);
        const id = newOTP.generate(12, { alphabets: true, upperCase: false, specialChar: false, });
        const { firstName, lastName, middleName, phone, customerId, email, dateOfBirth, gender, bloodGroup, doctorName, hospitalName, maritalStatus, father_spouseName, relationship, firstLineAddress, secondLineAddress, country, state, district, pincode, } = req.body;
        const refferalCode = await reffralCode()
        const user = await User.create({ firstName, refferalCode, lastName, middleName, phone, email, password, customerId, dateOfBirth, gender, bloodGroup, doctorName, hospitalName, maritalStatus, father_spouseName, relationship, firstLineAddress, secondLineAddress, country, state, district, pincode, });
        return res.status(200).json({ status: 1, message: "signed up successfully", data: user, });
    } catch (err) {
        console.error(err);
        return createResponse(res, 500, "internal error " + err.message);
    }
};
const reffralCode = async () => {
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let OTP = '';
    for (let i = 0; i < 9; i++) {
        OTP += digits[Math.floor(Math.random() * 36)];
    }
    return OTP;
}
const axios = require("axios");
const MSG91_API_KEY = "392665AOfokrdImEwF64130f11P1";
const sdk = require("api")("@msg91api/v5.0#171eja12lf0xqafw");
exports.loginwithotp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res
                .status(200)
                .send({ status: 0, message: "phone is required" });
        }
        const user = await User.findOne({ phone });
        if (!user) {
            return res
                .status(200)
                .send({ status: 0, message: "user not found" });
        }
        const otp = generateOTP();
        console.log(otp);
        user.otp = parseInt(otp);
        await user.save();
        const mobile = "91" + user.phone;
        console.log(user.phone);
        // const message = `Your OTP for login is ${otp}`;
        // const result = await sendSMS(mobile, otp);
        // console.log(result);
        // const axios = require("axios");

        // const options = {
        //     method: "POST",
        //     url: "https://control.msg91.com/api/v5/flow/",
        //     headers: {
        //         accept: "application/json",
        //         "content-type": "application/json",
        //         authkey: "392665AOfokrdImEwF64130f11P1",
        //     },
        //     data: {
        //         template_id: "6458d399d6fc052d7350be62",
        //         sender: "fromapi",
        //         short_url: "0",
        //         mobiles: "919358122205",
        //         otp: otp,
        //     },
        // };

        // axios
        //     .request(options)
        //     .then(function (response) {
        //         console.log(response.data);
        //     })
        //     .catch(function (error) {
        //         console.error(error);
        //     });

        const options = {
            method: "POST",
            url: "https://control.msg91.com/api/v5/otp?mobile=&template_id=",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authkey: "392665AOfokrdImEwF64130f11P1",
            },
            data: {
                template_id: "6458d399d6fc052d7350be62",
                otp: "1235",
                mobile: "919358122205",
            },
        };

        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });
        return createResponse(res, 200, "otp successfully", {
            otp: otp,
            userId: user._id,
            data: user,
        });
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "internal error " + err.message);
    }
};
function generateOTP() {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
// exports.loginwithotp = async (req, res) => {
//     try {
//         const { phone } = req.body;
//         if (!phone) {
//             return res
//                 .status(200)
//                 .send({ status: 0, message: "phone is required" });
//             //return createResponse(res, 200, "phone number is required");
//         }
//         const user = await User.findOne({ phone });
//         if (!user) {
//             return res
//                 .status(200)
//                 .send({ status: 0, message: "user not found" });
//             // return createResponse(res, 200, {status:0,"not registered"});
//         }
//         const otp = newOTP.generate(4, {
//             alphabets: false,
//             upperCase: false,
//             specialChar: false,
//         });
//         user.otp = otp;
//         await user.save();
//       return  createResponse(res, 200, "otp successfully", {
//             otp: otp,
//             userId: user._id,
//             data: user,
//         });
//     } catch (err) {
//         console.log(err);
//       return  createResponse(res, 500, "internal error " + err.message);
//     }
// };
exports.verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            return res
                .status(200)
                .send({ status: 0, message: "OTP is required" });
            // return createResponse(res, 400, "OTP is required");
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res
                .status(200)
                .send({ status: 0, message: "user not found" });
            // return createResponse(res, 200, "user not found");
        }
        if (user.otp !== otp) {
            return res
                .status(200)
                .send({ status: 0, message: "Invalid OTP !" });
            // return createResponse(res, 400, "Invalid OTP !");
        }
        const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
            expiresIn: authConfig.accessTokenTime,
        });
        return createResponse(res, 200, "access token successfully", { accessToken });
    } catch (err) {
        // console..log(err);
        console.log(err);
        return createResponse(res, 500, "internal error " + err.message);
    }
};

exports.loginWithEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(200)
                .send({ status: 0, message: "user not found" });
            // return createResponse(res, 200, "user not found");
        }
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(200).send({
                status: 0,
                message: "Wrong password",
            });
        }

        const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
            expiresIn: authConfig.accessTokenTime,
        });
        return createResponse(res, 200, "LoggedIn successfully", {
            accessToken: accessToken,
            userId: user._id,
        });
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "internal error " + err.message);
    }
};
exports.addCustomer = async (req, res) => {
    try {
        // const password = bcrypt.hashSync(req.body.password, 8);
        const id = newOTP.generate(12, {
            alphabets: true,
            upperCase: false,
            specialChar: false,
        });

        // while (!await User.findOne({ customerId: id })) {
        //     id = newOTP.generate(12, { alphabets: true, upperCase: false, specialChar: false });
        // }
        // const customerId = id;

        const {
            firstName,
            lastName,
            middleName,
            phone,
            customerId,
            email,
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
        const user = await User.create({
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
        });
        res.status(200).json({
            status: 1,
            message: "customer added",
            data: user,
        });
        // createResponse(res, 200, "signed up successfully", user);
    } catch (err) {
        console.error(err);
        return createResponse(res, 500, "internal error " + err.message);
    }
};
