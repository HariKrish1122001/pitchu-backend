const express = require("express");
const Router = express.Router();
const InternationalController = require("../../controller/clientController/InternationalController");
const axios = require('axios');
const config = require("../../Config/Config")
const {DollerPrice} = require("../../service/loginHelper/DollerpriceHelper");


Router.post("/InternationalPlanUserAdd", InternationalController.InternationalPlanUserAdd);
Router.get("/DollerPrice",DollerPrice);
// Router.post("/checkUserInfo", memberShipController.checkUserInfo);

module.exports = Router;