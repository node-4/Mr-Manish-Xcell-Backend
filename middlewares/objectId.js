const ObjectId = require("mongoose").Types.ObjectId;

const validId = (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ status: 0, message: "Invalid Id" });
    }
    next();
};

const bodyParser = function disableParserForContentType(req, res, next) {
    if (req.contentType in options.contentTypes) {
        req._body = true;
        next();
    }
};

module.exports = {
    validId,
};
