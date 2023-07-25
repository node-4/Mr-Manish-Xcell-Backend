const Joi = require("joi");
Joi.options.errors = false;
const invoiceSchema = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    issuedBy: Joi.string().required(),
    date: Joi.string().required(),
    // invoiceId: Joi.string().required(),
    orderId: Joi.string().required(),
    // catalogueId: Joi.string().required(),
    // product: Joi.array().items(
    //     Joi.object({
    //         description: Joi.string().required(),
    //         quantity: Joi.number().required(),
    //         rate: Joi.number().required(),
    //         amount: Joi.number().required(),
    //     })
    // ),
    // totalAmount: Joi.number().required(),
    // paymentStatus: Joi.string().valid('completed', 'due', 'canceled', 'Due', 'completed').required(),
    message: Joi.string(),
});
// const invoiceSchema = require('../schemas/invoiceSchema');

const checkInvoice = async (req, res, next) => {
    try {
        const { error } = invoiceSchema.validate(req.body);
        if (error) {
            const errorMessage = error.details[0].message.replace(/\"/g, ""); // Remove quotes from the error message
            return res.status(400).json({ status: 0, message: errorMessage });
        }
        next();

        // continue with creating the invoice
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 0, message: "Server Error" });
    }
};

module.exports = { checkInvoice };
