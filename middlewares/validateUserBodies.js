function userSignup(req, res, next) {
    const requiredFields = [
        "firstName",
        "lastName",
        "phone",
        "email",
        "password",
        "customerId",
        "dateOfBirth",
        "gender",
        "bloodGroup",
        "doctorName",
        "hospitalName",
        "maritalStatus",
        "father_spouseName",
        "relationship",
        "firstLineAddress",
        "secondLineAddress",
        "country",
        "state",
        "district",
        "pincode",
    ];

    const missingFields = [];

    requiredFields.forEach((field) => {
        if (!req.body[field]) {
            missingFields.push(field);
        }
    });

    if (missingFields.length == 1) {
        return res.status(200).json({
            status: 0,
            message: `${missingFields.join(", ")} is required`,
        });
    }
    if (missingFields.length > 1) {
        return res.status(200).json({
            status: 0,
            message: `${missingFields.join(", ")} are required`,
        });
    }
    next();
}

function adminSignup(req, res, next) {
    const requiredFields = [
        "firstName",
        "lastName",
        "phone",
        "email",
        "password",
        "role",
    ];
    const missingFields = [];

    requiredFields.forEach((field) => {
        if (!req.body[field]) {
            missingFields.push(field);
        }
    });

    if (missingFields.length == 1) {
        return res.status(200).json({
            status: 0,
            message: `${missingFields.join(", ")} is required`,
        });
    }
    if (missingFields.length > 1) {
        return res.status(200).json({
            status: 0,
            message: `${missingFields.join(", ")} are required`,
        });
    }

    next();
}

module.exports = { userSignup, adminSignup };
