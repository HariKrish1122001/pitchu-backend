const DomesticSchema = require("../../../model/clientModel/Domestic");
const loginSchema = require("../../../model/clientModel/loginSchema");
const notificationSchema = require("../../../model/clientModel/Notification");
const { encryptData, decryptData } = require("../../../utils/securedata");
const transferHistorySchema = require("../../../model/clientModel/transferHistroy/transferDataDemestic");
const domesticPlan = require("../../../model/plans/domisticPlan");
const internationalPlan = require("../../../model/plans/internationalPlan");
const supportSchema = require("../../../model/clientModel/support");

const findUserdata = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      const getData = await DomesticSchema.find({ clientId: decryptcheck });
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


const findUserInfo = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      const getData = await loginSchema.find({ clientId: decryptcheck });
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

const sendMessage = async(req,res)=>{
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    console.log("decryptcheck>>>>>",decryptcheck)
    if (decryptcheck) {
      const responce = await loginSchema.findOne({
        clientId: decryptcheck.clientId,
      });
      console.log("responce>>>",responce);
       const obj = new supportSchema({
        name:responce.name ,
        email: responce.email,
        clientId: responce.clientId,
        referelId: responce.referelId,
        contact:responce.contact,
        message :decryptcheck.text,
       })
       console.log("obj>>>",obj)
          await obj.save();
        res.send({
          status: true
        });

    } else {
      res.send({ status: false });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false });
  }
}



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

    // const findUser = await loginSchema.findOne({ clientId });
    const checkNotification = await notificationSchema.find({
      identityId,
      referelId,
    });
    if (checkNotification.length > 0) {
      return res.send({
        status: false,
        message: "Your request is already in progress!",
      });
    }

    const notificationData = new notificationSchema({
      identityId,
      name: findUser.name,
      amount,
      clientId,
      referelId,
      amountType,
      category: 0,
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

const NotificationAccRequiestDomestic = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);

    if (!decryptcheck) {
      return res.status(500).send({ status: false, message: "Request failed!" });
    }

    const findPackage = await DomesticSchema.findById(decryptcheck.identityId);

    // Check if package exists
    if (!findPackage) {
      await notificationSchema.findByIdAndDelete(decryptcheck._id);
      return res.status(500).send({ status: false, message: "Request failed!" });
    }

    const totalReward = Number(findPackage.amount) * 2;

    // Check if totalReward exceeds the already received reward amount
    if (totalReward <= Number(findPackage.getRewardAmount)) {
      await notificationSchema.findByIdAndDelete(decryptcheck._id);
      return res.status(500).send({ status: false, message: "Request failed!" });
    }

    const findPackageUser = await DomesticSchema.find({
      clientId: decryptcheck.referelId,
      amountType: decryptcheck.amountType,
      getRewardAmount: decryptcheck.amount,
    });

    if (findPackageUser.length === 0) {
      return res.status(500).send({
        status: false,
        message: "You have already referred to that, so please get a new package!"
      });
    }

    const result = findPackageUser.find((d, i) =>
      findPackageUser[i + 1] && d.endTime < findPackageUser[i + 1].endTime
    );


    if (totalReward <= Number(findPackage.getRewardAmount) + decryptcheck.amount) {
      const obj = new transferHistorySchema({
        identityId: 0,
        name: findPackage.name,
        clientId: findPackage.clientId,
        amountType: decryptcheck.amountType,
        amount: findPackage.amount,
        rewardAmount: totalReward,
        category: 0,
        status: true,
      });
      await obj.save();
      await DomesticSchema.findByIdAndDelete(decryptcheck.identityId);
    } else {
      await DomesticSchema.findByIdAndUpdate(
        decryptcheck.identityId,
        {
          $set: {
            getRewardAmount: Number(findPackage.getRewardAmount) + Number(decryptcheck.amount),
          },
        }
      );
    }
    const updatedAmount = Math.max(Number(result.getRewardAmount) - Number(decryptcheck.amount), 0);
    await DomesticSchema.findByIdAndUpdate(
      result._id,
      {
        $set: {
          getRewardAmount: updatedAmount,
        },
      }
    );

    await notificationSchema.findByIdAndDelete(decryptcheck._id);
    res.status(200).send({ status: true, message: "Success!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Request failed!" });
  }
};

const getDomesticTransferHistory = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      const getData = await transferHistorySchema.find({
        clientId: decryptcheck,
        status: true,
      });
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


const DomesticGetPlans = async (req, res) => {
  try {
    const getData = await domesticPlan.find();
    if (getData.length > 0) {
      const enData = encryptData(getData);
      res.send({ status: true, data: enData, message: "success!" });
    } else {
      res.send({ status: false, data: [], message: " failed" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, data: [], message: " failed" });
  }
}

const internationalGetPlans = async (req, res) => {
  try {
    const getData = await internationalPlan.find();
    if (getData.length > 0) {
      const enData = encryptData(getData);
      res.send({ status: true, data: enData, message: "success!" });
    } else {
      res.send({ status: false, data: [], message: " failed" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, data: [], message: " failed" });
  }
}
module.exports = {
  findUserdata, findUserInfo,
  DomesticGetPlans,
  internationalGetPlans,
  sendNotification,
  getNotificationList,
  getNotificationCheck,
  NotificationAccRequiestDomestic,
  getDomesticTransferHistory,sendMessage
};

