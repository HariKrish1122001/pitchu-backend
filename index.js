const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;
let adminRouter = require("./router/adminRouter/adminRouter");
const clientRouter = require("./router/clientRouter/clientRouter");
const memberShipRouter = require("./router/clientRouter/membershipRouter");
const DomesticRouter = require("./router/clientRouter/DomesticRouter");
const InternationalRouter = require("./router/clientRouter/InternationalRouter");
const dashboardRouter = require("./router/clientRouter/DashboardRouter/DashRouter");
const TransferHistory = require("./router/clientRouter/DashboardRouter/TransferhistroyRouter")
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
try {
  mongoose.connect(
    process.env.MONGODBURL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    console.log("DB connected successfully!!!")
  );
} catch (error) {
  console.log(error);
}

//call router
app.use("/client/Dashboard/TransferHistory", TransferHistory);
app.use("/client/Dashboard/", dashboardRouter);
app.use("/client/Domestic/", DomesticRouter);
app.use("/client/International/", InternationalRouter);
app.use("/client/", clientRouter);
app.use("/client/", memberShipRouter);
app.use("/admin/", adminRouter);
//  http.listen(port);
app.listen(port, console.log(`server is running on port ${port}`));
