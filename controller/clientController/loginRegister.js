const loginSchema = require("../../model/clientModel/loginSchema");
const Jwt = require("jsonwebtoken");
const { mailsend } = require("../../service/loginHelper/sendmailhelper");
const { encryptData, decryptData } = require("../../utils/securedata");
const config = require("../../Config/Config");
require("dotenv").config();

const findReferel = async (data, clientId) => {
  try {

    const res = await loginSchema.findOne({ clientId: data });
    if (res) {
      await loginSchema.findOneAndUpdate(
        { clientId: data },
        {
          $push: {
            directReferral: clientId,
          },
        },
        { new: true, useFindAndModify: false }
      );
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const register = async (req, res) => {
  try {
    const data = req.body.datas;
    const {
      name,
      email,
      password,
      contact,
      referelId,
      conformPassword,
      clientId,
    } = decryptData(data);
    if (!email || !password) {
      res.json({
        status: false,
        message: "Cannot Empty email or pass",
      });
      return;
    }
    if (name && password) {
      const data = await loginSchema.findOne({ email: email });
      if (data !== null) {
        res.send({ status: false, message: "All ready register" });
      } else {
        if (referelId != null) {
          const status = await findReferel(referelId, clientId);
          if (status == false) {
            res.send({ status: false, message: "Referral ID not found!" });
            return;
          }
        }else{
          await findReferel(process.env.ADMIN_ID, clientId);
        }
        const encryptPass = encryptData(password);
        const Thankyoumail = await mailsend({
          to: email,
          subject: "Register Successfull",
          method: "Register",
          token :{
            email:email,
            name:name
          }
       
        });
  
        const obj = new loginSchema({
          name: name,
          email: email,
          password: encryptPass,
          clientId: clientId,
          contact: contact,
          referelId: referelId != null ? referelId : process.env.ADMIN_ID,
        });

        const responce = await obj.save();
        if (responce) {
          res.send({ status: true, message: "Register Success" });
        } else {
          res.send({ status: false, message: "Register failed" });
        }
      }
    } else {
      res.send({ status: false, message: "Register failed" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Register failed" });
  }
};

const logIn = async (req, res) => {
  try {
    const { enData } = req.body;
    console.log('enData', enData)
    const decryptcheck = decryptData(enData);
    const { email, password } = decryptcheck;
    const data = await loginSchema.findOne({ email: email });
  
    if (data === null) {
      res.send({ status: false, message: "data is not found!" });
      return;
    }
    const originalPass = decryptData(data?.password);
    if (originalPass === password) {
      const token = Jwt.sign({ clientId: data.clientId }, process.env.JWT_KEY, {
        expiresIn: "30d",
      });
      res.send({ token: token, status: true, message: "Login Success" });
    } else {
      res.send({ status: false, message: "Invalid password" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.send({ status: false, message: "Err Login failed" });
  }
};

const getisclientcheck = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    const data = await loginSchema.aggregate([
      {
        $match: { clientId: decryptcheck },
      },
      {
        $project: {
          _id: 0,
          clientId: 1,
          referelId: 1,
        },
      },
    ]);
    const respoce = encryptData(data);
    if (data.length === 0) {
      res.json({ status: false, message: "data not found" });
      return;
    } else {
      res.json({ status: true, message: "successful get", data: respoce });
    }
  } catch (error) {
    res.json({ status: false, message: "ClientTokenCheck not found" });
  }
};

const forgetPasswordSendRequiest = async (req, res) => {
  try {
    const { enData } = req.body;

    const decryptcheck = decryptData(enData);
    const { email } = decryptcheck;

    const userData = await loginSchema.findOne({ email: email });
    if (userData) {
      const token = Jwt.sign(
        { userData: userData.clientId },
        process.env.JWT_KEY,
        {
          expiresIn: "30d",
        }
      );
console.log('email', email,token)
      const Thankyoumail = await mailsend({
        to: email,
        subject: "Resetpassword Success",
        method: "reset",
        token:`${config.FrontEnd_Url}passwordchange/${token}`,
      });

      res.json({
        status: true,
        message: "Send email requiest success!",
      });
    } else {
      res.json({
        status: false,
        message: "User doesn't exist!",
      });
    }
  } catch (error) {
    console.log(":", error);
    res.json({
      status: false,
      message: "Send email requiest failed!",
    });
  }
};

const getisClient = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    const decodedToken = JSON.parse(atob(decryptcheck.token.split(".")[1]));
    const data = await loginSchema.find({ email: decryptcheck.email });
    if (data.length === 0) {
      res.json({ status: false, message: "User is gmail not found!" });
      return;
    } else {
      if (decodedToken.userData === data[0].clientId) {
        res.json({ status: true, message: "successful get" });
      } else {
        res.json({ status: false, message: "User is gmail not found!" });
      }
    }
  } catch (error) {
    res.json({ status: false, message: "User is gmail not found!" });
  }
};

const getisClientId = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    const data = await loginSchema.find({ clientId: decryptcheck }); 
    if (data.length === 0) {
      res.json({ status: false, message: "User is  not found!" });
      return;
    } else {
      const encryptDatas = encryptData(data[0]);
        res.json({ status: true,data:encryptDatas, message: "successful " });
    }
  } catch (error) {
    res.json({ status: false, message: "User is not found!" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { enData } = req.body;

    const decryptcheck = decryptData(enData);
    if (!decryptcheck) {
      return res.json({ status: false, message: "Invalid token or data!" });
    }
    const passwordEnc = encryptData(decryptcheck.password);
    const decodedToken = JSON.parse(atob(decryptcheck.token.split(".")[1]));
    const clientId = decodedToken.userData;
    console.log(
      "Client ID and Encrypted Password:",
      decryptcheck.token,
      decodedToken,
      passwordEnc
    );
    const data = await loginSchema.findOneAndUpdate(
      { clientId: clientId },
      { $set: { password: passwordEnc } },
      { new: true, useFindAndModify: false }
    );

    if (data) {
      res.json({ status: true, message: "Password change success!" });
    } else {
      res.json({
        status: false,
        message: "Password change failed! User not found.",
      });
    }
  } catch (error) {
    console.error("Error changing password:", error);
    res.json({
      status: false,
      message: "An error occurred during password change.",
    });
  }
};

module.exports = {
  register,
  logIn,
  getisclientcheck,
  forgetPasswordSendRequiest,
  getisClient,
  changePassword,
  getisClientId
};
