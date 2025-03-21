const express = require("express");
const Router = express.Router();
const DomesticController = require("../../controller/clientController/DomesticController");

Router.post("/DomesticsPlanUserAdd", DomesticController.DomesticsPlanUserAdd);
// Router.post("/checkUserInfo", memberShipController.checkUserInfo);

module.exports = Router;