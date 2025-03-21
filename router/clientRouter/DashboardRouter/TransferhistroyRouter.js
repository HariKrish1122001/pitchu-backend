const express = require("express");
const Router = express.Router();
const DomesticDash = require("../../../controller/clientController/DashboardController/DomesticDashboard");
const internatinalDash = require("../../../controller/clientController/DashboardController/InternationalDashBoard");

Router.post("/getDomesticTransferHistory", DomesticDash.getDomesticTransferHistory);
Router.post("/getInternationalTransferHistory", internatinalDash.getInternationalTransferHistory);
module.exports = Router;