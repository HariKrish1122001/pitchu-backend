const express = require("express");
const Router = express.Router();
const DomesticDashboard = require("../../../controller/clientController/DashboardController/DomesticDashboard");
const InternationalDashBoard = require("../../../controller/clientController/DashboardController/InternationalDashBoard");

Router.post("/findUserdata", DomesticDashboard.findUserdata);
Router.post("/DomesticGetPlans", DomesticDashboard.DomesticGetPlans);
Router.post("/internationalGetPlans", DomesticDashboard.internationalGetPlans);
Router.post("/findUserInfo", DomesticDashboard.findUserInfo);
Router.post("/sendNotification", DomesticDashboard.sendNotification);
Router.post("/NotificationInternational", InternationalDashBoard.sendNotification);
Router.post("/getNotificationList", DomesticDashboard.getNotificationList);
Router.post("/sendMessage", DomesticDashboard.sendMessage);
Router.post("/getNotificationCheck", DomesticDashboard.getNotificationCheck);
Router.post("/findUserdataInternational", InternationalDashBoard.findUserdata);
Router.post("/rejectRequiest", InternationalDashBoard.rejectRequiest);
Router.post("/NotificationAccRequiest",InternationalDashBoard.NotificationAccRequiestInternational);
Router.post("/NotificationAccRequiestDomestic",DomesticDashboard.NotificationAccRequiestDomestic);




module.exports = Router;