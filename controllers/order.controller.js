const Order = require("../models/order.model");
const User = require("../models/user.model");
const adminModel = require("../models/admin.model");
const Catalogue = require("../models/catalogue.model");
exports.createOrder = async (req, res) => {
    try {
        const { catalogueId, userId, totalPackages, deliveryDate } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(200)
                .json({ status: 0, message: "User not found" });
        }
        const catalogue = await Catalogue.findById(catalogueId);
        console.log(catalogue);
        const order = new Order({
            catalogueId,
            totalAmount: catalogue.totalAmount,
            orderId: catalogue.orderId,
            userId,
            deliveryDate,
            totalPackages,
            address:
                user.firstLineAddress +
                " " +
                user.firstLineAddress +
                " " +
                user.city +
                " " +
                user.state +
                " " +
                user.country +
                " " +
                user.pincode,
            placedOn: new Date(),
            orderStatus: "ongoing",
        });

        const savedOrder = await order.save();

        res.status(201).json({
            status: 1,
            message: "Order created",
            data: savedOrder,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        let queryObj = {};
        if (req.query.userId) {
            queryObj.userId = req.query.userId;
        }

        if (req.query.orderStatus) {
            queryObj.orderStatus = req.query.orderStatus;
        }
        if (req.query.paymentStatus) {
            queryObj.paymentStatus = req.query.paymentStatus;
        }
        if (req.query.startOfDay && req.query.endOfDay) {
            const startOfDay = new Date(req.query.startOfDay);
            const endOfDay = new Date(req.query.endOfDay);
            queryObj.createdAt = { $gte: startOfDay, $lt: endOfDay };
        }
        if (req.query.startOfDay && req.query.endOfDay == undefined) {
            const startOfDay = new Date(req.query.startOfDay);
            // const endOfDay = new Date(req.query.endOfDay);
            queryObj.createdAt = { $gte: startOfDay };
        }
        if (req.query.startOfDay == undefined && req.query.endOfDay) {
            const endOfDay = new Date(req.query.endOfDay);
            queryObj.createdAt = { $lt: endOfDay };
        }
        if (req.query.orderId) {
            queryObj.orderId = req.query.orderId;
        }
        // if (req.query.placedOn) {
        //     const dateString = req.query.placedOn.trim().replace(/\//g, '-');
        //     queryObj.placedOn = { $regex: new RegExp(dateString, 'i') };
        // }

        const orders = await Order.find(queryObj)
            .populate("catalogueId")
            .lean()
            .sort({ createdAt: -1 });
        if (orders.length === 0) {
            return res
                .status(200)
                .json({ status: 0, message: "No orders found" });
        }
        res.json({ status: 1, data: orders });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: err.message });
    }
};
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("catalogueId")
            .lean();

        if (!order) {
            return res
                .status(200)
                .json({ status: 0, message: "Order not found" });
        }

        res.json({ status: 1, data: order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: err.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res
                .status(404)
                .json({ status: 0, message: "Order not found" });
        }

        const { totalPackages, orderStatus, deliveryDate } = req.body;

        if (totalPackages !== undefined) {
            order.totalPackages = totalPackages;
        }

        if (orderStatus !== undefined) {
            order.orderStatus = orderStatus;
        }
        order.deliveryDate = deliveryDate || order.deliveryDate;
        const updatedOrder = await order.save();

        res.json({ status: 1, message: "Order updated", data: updatedOrder });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(200).json({ message: "Order not found" });
        }
        res.json({ status: 1, message: "Order deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: err.message });
    }
};

// exports.getOrderCountsByMonth = async (req, res) => {
//     try {
//         const pipeline = [
//             {
//                 $group: {
//                     _id: {
//                         createdAt: { '$dateToString': { format: "%Y-%m-%d", date: '$createdAt' } },
//                         year: { $year: "$createdAt" },
//                     },
//                     count: {
//                         $sum: 1,
//                     },
//                 },
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     dateToString: "$_id.createdAt",
//                     year: "$_id.year",
//                     count: 1,
//                 },
//             },
//             {
//                 $sort: {
//                     year: 1,
//                     dateToString: 1,
//                 },
//             },
//         ];
//         const orderCounts = await Order.aggregate(pipeline);
//         if (orderCounts.length === 0) {
//             return res.status(200).json({ message: "No orders found", });
//         }
//         const result = orderCounts.map(({ dateToString, year, count }) => {
//             return { date: dateToString, year: year, orderCount: count };
//         });

//         console.log(result);
//         res.json({ status: 1, data: result });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ status: 0, message: err.message });
//     }
// };
// exports.getOrderCountsByMonth = async (req, res) => {
//     try {
//         const pipeline = [
//             {
//                 $group: {
//                     _id: {
//                         createdAt: {
//                             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//                         },
//                         year: { $year: "$createdAt" },
//                         month: { $month: "$createdAt" },
//                     },
//                     count: {
//                         $sum: 1,
//                     },
//                 },
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     date: "$_id.createdAt",
//                     year: "$_id.year",
//                     month: "$_id.month",
//                     count: 1,
//                 },
//             },
//             {
//                 $sort: {
//                     year: 1,
//                     month: 1,
//                     date: 1,
//                 },
//             },
//         ];

//         const orderCounts = await Order.aggregate(pipeline);

//         if (orderCounts.length === 0) {
//             return res.status(200).json({ message: "No orders found" });
//         }

//         const result = orderCounts.map(({ date, year, month, count }) => {
//             return { date, year, month, orderCount: count };
//         });

//         console.log(result);
//         res.json({ status: 1, data: result });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ status: 0, message: err.message });
//     }
// };
exports.getOrderCountsByMonth = async (req, res) => {
    try {
        const { groupBy } = req.query;
        if (!groupBy || (groupBy !== 'date' && groupBy !== 'month')) {
            return res.status(400).json({ message: "Invalid 'groupBy' parameter. Use 'date' or 'month'." });
        }
        const pipeline = [
            {
                $group: {
                    _id: {
                        createdAt: {
                            $dateToString: {
                                format: groupBy === 'date' ? "%Y-%m-%d" : "%Y-%m",
                                date: "$createdAt",
                            },
                        },
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.createdAt",
                    year: "$_id.year",
                    month: "$_id.month",
                    count: 1,
                },
            },
            {
                $sort: {
                    year: 1,
                    month: 1,
                    date: 1,
                },
            },
        ];
        const orderCounts = await Order.aggregate(pipeline);
        if (orderCounts.length === 0) {
            return res.status(200).json({ message: "No orders found" });
        }
        const result = orderCounts.map(({ date, year, month, count }) => {
            return { date, year, month, orderCount: count };
        });
        return res.json({ status: 1, data: result });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
const fs = require("fs");
exports.import = async (req, res) => {
    try {
        console.log(req.file);
        const file = req.file;
        const path = file.path;
        const workbook = XLSX.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const orders = XLSX.utils.sheet_to_json(sheet);
        console.log(orders);

        orders.forEach(async (orderData) => {
            const orderObj = {
                // catalogueId: orderData["Catalogue ID"],
                // orderId: orderData["Order ID"],
                name: orderData["Patients"],
                customerId: orderData["Patient ID"],
                orderType: orderData["patient Order Type"],
                totalPackages: orderData["Total No of Boxes"],
                // placedOn: new Date(orderData["Order Date"]),
                // address: orderData["Address"],
                orderDate: new Date(orderData["Order Date"]),
                totalAmount: orderData["Invoice Amount"],
                orderStatus: orderData["Order Status"],
                paymentStatus: orderData["Payment Status"],
            };
            const order = await Order.create(orderObj);
            console.log(order);
        });
        fs.unlink(path, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error deleting file" });
            }
        });

        res.status(200).json({ message: "Data uploaded successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 0, message: error.message });
    }
};
const XLSX = require("xlsx");
// const Order = require("../models/Order");
const AdmZip = require("adm-zip");
// GET all orders
// exports.download = async (req, res) => {
//     try {
//         let query = { ...req.query };
//         const orders = await Order.find(query).populate("catalogueId");
//         // Convert orders data to array of arrays (rows and columns)

//         const data = orders.map((order, index) => {
//             return [
//                 index + 1,
//                 order.name,
//                 order.customerId,
//                 order.orderType,
//                 order.orderDate,
//                 order.city,
//                 order.state,
//                 order.totalAmount,
//                 order.totalPackages,
//             ];
//         });
//         // Replace "customerId" with "Patient ID"
//         data.unshift([
//             "sr No",
//             "Patients",
//             "Patient ID",
//             "Patient Order Type",
//             "Order Date",
//             "City",
//             "State",
//             "Invoice Amount",
//             "Total No of Boxes",
//         ]);
//         // Create a new workbook
//         const workbook = XLSX.utils.book_new();
//         // Add a new worksheet to the workbook
//         const worksheet = XLSX.utils.aoa_to_sheet(data);
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
//         // Write the workbook to a buffer
//         const buffer = XLSX.write(workbook, {
//             type: "buffer",
//             bookType: "xlsx",
//         });
//         const zip = new AdmZip(buffer);
//         const zipEntries = zip.getEntries();
//         const firstEntry = zipEntries[0];
//         const dataBuffer = zip.readAsText(firstEntry);

//         // Set the response headers
//         res.setHeader(
//             "Content-Type",
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.setHeader(
//             "Content-Disposition",
//             "attachment; filename=orders.xlsx"
//         );
//         // Send the decompressed data as the response
//         res.send(dataBuffer);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// };
const exceljs = require("exceljs");
const ExcelJS = require("exceljs");
exports.download = async (req, res) => {
    try {
        let query = { ...req.query };
        const orders = await Order.find(query).populate("catalogueId");
        const data = orders.map((order, index) => [
            index + 1,
            order.name,
            order.customerId,
            order.orderType,
            order.orderDate,
            order.city,
            order.state,
            order.totalAmount,
            order.totalPackages,
        ]);
        data.unshift([
            "sr No",
            "Patients",
            "Patient ID",
            "Patient Order Type",
            "Order Date",
            "City",
            "State",
            "Invoice Amount",
            "Total No of Boxes",
        ]);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Orders");
        worksheet.columns = [
            { header: "sr No", key: "srNo" },
            { header: "Patients", key: "name" },
            { header: "Patient ID", key: "customerId" },
            { header: "Patient Order Type", key: "orderType" },
            { header: "Order Date", key: "orderDate" },
            { header: "City", key: "city" },
            { header: "State", key: "state" },
            { header: "Invoice Amount", key: "totalAmount" },
            { header: "Total No of Boxes", key: "totalPackages" },
        ];
        worksheet.addRows(data);
        const filePath = "./orders.xlsx";
        await workbook.xlsx.writeFile(filePath);
        res.download(filePath, "orders.xlsx", (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).send("Server Error");
            }
            fs.unlinkSync(filePath);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
exports.addOrder = async (req, res) => {
    try {
        if (req.body.orderDate) {
            req.body.placedOn = new Date(req.body.orderDate);
        }
        if (req.body.customerId) {
            const user = await User.findOne({
                customerId: req.body.customerId,
            });
            if (user) {
                req.body.userId = user._id;
            }
        }
        if (req.body.order_id) {
            const order = await Order.findOne({ orderId: req.body.order_id });
            if (order) {
                console.log("Order Id already exists\n", order);
                return res.status(400).json({
                    status: 0,
                    message: "Order Id already exists",
                });
            }
            req.body.orderId = req.body.order_id;
        }

        const order1 = await Order.create(req.body);
        res.status(201).json({ status: 1, data: order1 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 0, message: error.message });
    }
};
exports.getAllOrdersforSubAdmin = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const loggedInUser = await adminModel.findById(loggedInUserId).lean();
        if (!loggedInUser) { return createResponse(res, 404, "Logged-in user not found", { status: 0, }); }
        let queryObj = { userId: { $in: loggedInUser.userId } };
        if (req.query.userId) {
            queryObj.userId = req.query.userId;
        }
        if (req.query.orderStatus) {
            queryObj.orderStatus = req.query.orderStatus;
        }
        if (req.query.paymentStatus) {
            queryObj.paymentStatus = req.query.paymentStatus;
        }
        if (req.query.startOfDay && req.query.endOfDay) {
            const startOfDay = new Date(req.query.startOfDay);
            const endOfDay = new Date(req.query.endOfDay);
            queryObj.createdAt = { $gte: startOfDay, $lt: endOfDay };
        }
        if (req.query.startOfDay && req.query.endOfDay == undefined) {
            const startOfDay = new Date(req.query.startOfDay);
            // const endOfDay = new Date(req.query.endOfDay);
            queryObj.createdAt = { $gte: startOfDay };
        }
        if (req.query.startOfDay == undefined && req.query.endOfDay) {
            const endOfDay = new Date(req.query.endOfDay);
            queryObj.createdAt = { $lt: endOfDay };
        }
        if (req.query.orderId) {
            queryObj.orderId = req.query.orderId;
        }
        const orders = await Order.find(queryObj).populate("catalogueId").lean().sort({ createdAt: -1 });
        if (orders.length === 0) {
            return res
                .status(200)
                .json({ status: 0, message: "No orders found" });
        }
        res.json({ status: 1, data: orders });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: err.message });
    }
};