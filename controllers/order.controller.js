const Order = require("../models/order.model");
const User = require("../models/user.model");
const adminModel = require("../models/admin.model");
const Catalogue = require("../models/catalogue.model");
const fs = require("fs");
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");

exports.createOrder = async (req, res) => {
    try {
        const { catalogueId, userId, totalPackages, deliveryDate } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({ status: 0, message: "User not found" });
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
            address: user.firstLineAddress + " " + user.firstLineAddress + " " + user.district + " " + user.state + " " + user.country + " " + user.pincode,
            placedOn: new Date(),
            state: user.state,
            city: user.district,
            orderStatus: "ongoing",
        });
        const savedOrder = await order.save();

        return res.status(201).json({
            status: 1,
            message: "Order created",
            data: savedOrder,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
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
        const orders = await Order.find(queryObj).populate("catalogueId userId").lean().sort({ createdAt: -1 });
        if (orders.length === 0) {
            return res
                .status(200)
                .json({ status: 0, message: "No orders found" });
        }
        return res.json({ status: 1, data: orders });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
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
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ status: 0, message: "Order not found" });
        }
        const { orderId, name, customerId, totalPackages, totalAmount, orderStatus, deliveryDate } = req.body;
        if (totalPackages !== undefined) {
            order.totalPackages = totalPackages;
        }
        if (orderId !== undefined) {
            order.orderId = orderId;
        }
        if (name !== undefined) {
            order.name = name;
        }
        if (customerId !== undefined) {
            order.customerId = customerId;
        }
        if (totalAmount !== undefined) {
            order.totalAmount = totalAmount;
        }
        if (orderStatus !== undefined) {
            order.orderStatus = orderStatus;
        }
        if (deliveryDate !== undefined) {
            order.deliveryDate = deliveryDate || order.deliveryDate;
        }
        const updatedOrder = await order.save();
        return res.json({ status: 1, message: "Order updated", data: updatedOrder });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(200).json({ message: "Order not found" });
        }
        return res.json({ status: 1, message: "Order deleted" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
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

        return res.status(200).json({ message: "Data uploaded successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, message: error.message });
    }
};
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
        return res.status(200).send({ message: "Data found", data: filePath });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
};
exports.addOrder = async (req, res) => {
    try {
        if (req.body.orderDate) {
            req.body.placedOn = new Date(req.body.orderDate);
        }
        if (req.body.customerId) {
            const user = await User.findOne({ customerId: req.body.customerId, });
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
        return res.status(201).json({ status: 1, data: order1 });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, message: error.message });
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
        return res.status(500).json({ status: 0, message: err.message });
    }
};
exports.getOrderCountsByMonthforSubAdmin = async (req, res) => {
    try {
        // Fetch the logged-in user
        // const loggedInUserId = req.user._id;
        // const loggedInUser = await adminModel.findById(loggedInUserId).lean();
        // if (!loggedInUser) {
        //     return res.status(404).json({ message: "Logged-in user not found", status: 0 });
        // }
        // req.query = { userId: { $in: loggedInUser.userId } };
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
        const result = orderCounts.map(({ date, year, month, count }) => { return { date, year, month, orderCount: count }; });
        return res.json({ status: 1, data: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 0, message: err.message });
    }
};
