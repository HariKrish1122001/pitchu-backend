const express = require("express");
const Router = express.Router();
const memberShipController = require("../../controller/clientController/Membership");

Router.post("/addMemberShip", memberShipController.addMemberShip);
Router.post("/checkUserInfo", memberShipController.checkUserInfo);
Router.post("/getUserMemberShip", memberShipController.getUserMemberShip);

module.exports = Router;


