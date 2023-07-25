exports.createResponse = (res, statusCode, message, data = null) => {
    const status = statusCode >= 200 && statusCode < 300 ? 1 : 0; // Check if status code is in the 200s
    res.status(statusCode).json({
        status: status, // Add a "status" field to the response object
        message: message,
        data: data,
    });
};
