const International = require("../../../model/clientModel/International");
const DomesticSchema = require("../../../model/clientModel/Domestic");
const loginSchema = require("../../../model/clientModel/loginSchema");
const notificationSchema = require("../../../model/clientModel/Notification");
const transferHistorySchema = require("../../../model/clientModel/transferHistroy/transferDataInternational");

const { encryptData, decryptData } = require("../../../utils/securedata");

const findUserdata = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      const getData = await International.find({ clientId: decryptcheck });
      if (getData.length > 0) {
        const enData = encryptData(getData);
        res.send({ status: true, data: enData, message: "success!" });
      } else {
        res.send({ status: false, data: [], message: " failed" });
      }
    } else {
      res.send({ status: false, data: [], message: " failed" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, data: [], message: " failed" });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);

    if (!decryptcheck) {
      return res
        .status(400)
        .send({ status: false, message: "Request failed: Invalid data!" });
    }

    const { clientId, _id: identityId, amount, amountType } = decryptcheck.data;
    const { input: referelId } = decryptcheck;

    const findRefId = await loginSchema.find({ clientId: referelId });
    if (findRefId.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Request failed: Client ID not found!",
      });
    }

    const findUser = await loginSchema.findOne({ clientId });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: false, message: "Request failed: User not found!" });
    }

    // Check if notification already exists
    const checkNotification = await notificationSchema.find({ identityId });
    if (checkNotification.length > 0) {
      return res.send({
        status: false,
        message: "Your request is already in progress!",
      });
    }

    // Create a new notification object
    const notificationData = new notificationSchema({
      identityId,
      name: findUser.name,
      amount,
      clientId,
      referelId,
      amountType,
      category: 1,
    });

    // Save the notification
    await notificationData.save();
    res.send({ status: true, message: "Request sent successfully!" });
  } catch (error) {
    console.error("Error in sendNotification:", error);
    res.status(500).send({ status: false, message: "Request failed!" });
  }
};

const getNotificationList = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      const responce = await notificationSchema.find({
        referelId: decryptcheck,
      });
      if (responce.length > 0) {
        const enData = encryptData(responce);
        res.send({
          status: true,
          data: enData,
          message: " get method success!",
        });
      } else {
        res.send({ status: false, data: [], message: " get method failed!" });
      }
    } else {
      res.send({ status: false, data: [], message: " get method failed!" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, data: [], message: " get method failed!" });
  }
};

const getNotificationCheck = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      const responce = await notificationSchema.find({
        clientId: decryptcheck,
      });
      if (responce.length > 0) {
        const enData = encryptData(responce);
        res.send({
          status: true,
          data: enData,
          message: " get method success!",
        });
      } else {
        res.send({ status: false, data: [], message: " get method failed!" });
      }
    } else {
      res.send({ status: false, data: [], message: " get method failed!" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, data: [], message: " get method failed!" });
  }
};

const rejectRequiest = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);

    if (!decryptcheck) {
      return res.status(400).send({
        status: false,
        message: "Reject request failed: Invalid data!",
      });
    }

    await notificationSchema.findByIdAndDelete(decryptcheck._id);

    const updateParams = { $set: { replayStatus: "reject" } };
    const schema = decryptcheck.category === 0 ? DomesticSchema : International;

    await schema.findByIdAndUpdate(decryptcheck.identityId, updateParams);

    res.status(200).send({ status: true, message: "Rejected successfully!" });
  } catch (error) {
    console.error("Error in rejectRequiest:", error);
    res.status(500).send({ status: false, message: "Reject request failed!" });
  }
};

const NotificationAccRequiestInternational = (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      //18% 10%

      res.status(200).send({ status: true, message: "Success!" });
    } else {
      res.status(500).send({ status: false, message: " Request failed!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: " Request failed!" });
  }
};


const getInternationalTransferHistory = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      const getData = await transferHistorySchema.find({ clientId: decryptcheck,status:true });
      if (getData.length > 0) {
        const enData = encryptData(getData);
        res.send({ status: true, data: enData, message: "success!" });
      } else {
        res.send({ status: false, data: [], message: " failed" });
      }
    } else {
      res.send({ status: false, data: [], message: " failed" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, data: [], message: " failed" });
  }
};
module.exports = {
  findUserdata,
  sendNotification,
  getNotificationList,
  getNotificationCheck,
  rejectRequiest,
  NotificationAccRequiestInternational,
  getInternationalTransferHistory
};
