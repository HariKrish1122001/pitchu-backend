const express = require("express");
const Router = express.Router();
const clientController = require("../../controller/clientController/loginRegister");
const slideNavController=require("../../controller/clientController/DashboardController/slideNavController")




Router.post("/Register", clientController.register);
Router.post("/Login", clientController.logIn);
// Router.post("/forgetpass", clientController.forgetpassword);
// Router.post("/resetpass", clientController.resetpassword);
Router.post("/forgetpasswordSendRequest", clientController.forgetPasswordSendRequiest);
Router.post("/getisClientcheck", clientController.getisclientcheck);
Router.post("/getisClient", clientController.getisClient);
Router.post("/getisClientId", clientController.getisClientId);
Router.post("/changePassword", clientController.changePassword);
Router.post("/userInfo", slideNavController.userInfo);




module.exports = Router;


