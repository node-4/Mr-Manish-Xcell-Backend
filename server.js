const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const compression = require("compression");
const serverless = require("serverless-http");
const app = express();
app.use(compression({ threshold: 1008 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
if (process.env.NODE_ENV == "production") {
    console.log = function () { };
}
app.get("/", (req, res) => {
    res.send("Hello World!");
});
require("./routes/admin.route")(app);
require("./routes/user.route")(app);
require("./routes/auth.route")(app);
app.use("/api/v1", require("./routes/document.route"));
app.use("/api/v1", require("./routes/role.route"));
app.use("/api/v1", require("./routes/branch.route"));
app.use("/api/v1", require("./routes/catalogue.route"));
app.use("/api/v1", require("./routes/hub-cities.route"));
app.use("/api/v1", require("./routes/product.route"));
app.use("/api/v1", require("./routes/order.route"));
app.use("/api/v1", require("./routes/notification.route"));
app.use("/api/v1", require("./routes/tracking.route"));
app.use("/api/v1", require("./routes/aggrement.route"));
app.use("/api/v1", require("./routes/terms.route"));
app.use("/api/v1", require("./routes/support.ticket"));
app.use("/api/v1/invoices", require("./routes/invoice.route"));
app.use("/api/v1", require("./routes/privacy.route"));
app.use('/orders.xlsx', express.static(path.join(__dirname, './orders.xlsx')))
require("./routes/payment.route")(app);
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, }).then(() => console.log("Connected to MongoDB Atlas...")).catch((err) => console.error("Error occurred while connecting to MongoDB Atlas...\n", err));
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}!`);
});

module.exports = { handler: serverless(app) };
