const express = require("express");
const Router = express.Router();
const AdminController = require("../../controller/adminController/loginRegister");
const plancontroller = require("../../controller/adminController/plancontroller");
const dashboard= require("../../controller/adminController/dashboardcontrol");
const support = require("../../controller/adminController/support");




Router.post("/Register", AdminController.register);
Router.post("/Login", AdminController.logIn);
Router.post("/forgetpass", AdminController.forgetpassword);
Router.post("/resetpass", AdminController.resetpassword);
Router.post("/verifyOtp", AdminController.verifyOtp);
Router.get("/getadmincheck", AdminController.getisadmincheck);
Router.post("/getPlan",plancontroller.getPlan);
Router.post("/updatePlan",plancontroller.updatePlan);
Router.post("/getDomesticWinners",dashboard.getDomesticWinners);
Router.post("/getInternationalWinners",dashboard.getInternationalWinners);
Router.post("/getDomesticSendReward",dashboard.getDomesticSendReward);
Router.post("/getInternationalSendReward",dashboard.getInternationalSendReward);
Router.post("/getSupport",support.SupportMsg);
Router.post("/deleteMsg",support.deleteMsg);


module.exports = Router;
