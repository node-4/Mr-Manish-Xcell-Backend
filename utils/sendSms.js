const MSG91_AUTH_KEY = "392665AOfokrdImEwF64130f11P1";
const MSG91_SENDER_ID = "xcells";
const MSG91_ROUTE = 4; // Promotional route
const MSG91_TEMPLATE_ID = "6456163ed6fc0563881ec9c2";
// const axios = require("axios");

const url = `https://control.msg91.com/api/v5/otp?mobile=&template_id=6456163ed6fc0563881ec9c2`;

const axios = require("axios");

const authKey = "392665AOfokrdImEwF64130f11P1"; // Your MSG91 auth key
const mobileNumber = "MOBILE_NUMBER"; // The mobile number of the recipient

// Generate a random 6-digit OTP

// Construct the message

async function sendSMS(to, message) {
    const axios = require("axios");

    const options = {
        method: "POST",
        url: "https://control.msg91.com/api/v5/otp?template_id=&mobile=",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            authkey: authKey,
        },
        data: {
            otp: message,
            template_id: "6450ac1dd6fc051bdd07cb52",
            mobile: to,
            sender_id: "xcells",
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
}

// async function sendSMS(to, message) {
//     try {
//         console.log("Sending OTP to", to);
//         const payload = {
//             otp: message,
//             mobile: to,
//             // template_id: "6456163ed6fc0563881ec9c2",
//         };
//         console.log(payload);
//         const headers = {
//             accept: "application/json",
//             "content-type": "application/json",
//             authkey: MSG91_AUTH_KEY,
//         };
//         const response = await axios.post(url, payload, { headers });
//         console.log(response.data);
//     } catch (error) {
//         console.error(error);
//     }
// }

// const sendSMS = async (to, message) => {
//     const mobileNumber = "";
//     const countryCode = "91";
//     const templateId = "123456";
//     const authKey = "392665Az5aG03qBc5642d4be5P1";

//     const url = "https://api.msg91.com/api/v5/otp";

//     const data = {
//         mobile: "9358122205",
//         country: "91",
//         template_id: "6450ac1dd6fc051bdd07cb52",
//         message: "9988",
//     };

//     const config = {
//         headers: {
//             "Content-Type": "application/json",
//             authkey: authKey,
//         },
//     };

//     return await axios
//         .post(url, data, config)
//         .then((response) => {
//             console.log(response.data);
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// };
module.exports = sendSMS;
