const memberShip = require("../../model/clientModel/membershipSchema");
const { encryptData, decryptData } = require("../../utils/securedata");
const loginSchema = require("../../model/clientModel/loginSchema");

const updateMemberShip = async (data) => {
  try {
    const updateData =
      data.method === 0
        ? { Domestic: data.Domestic, DomesticStatus: data.DomesticStatus }
        : {
            International: data.International,
            InternationalStatus: data.InternationalStatus,
          };

    const res = await memberShip.findOneAndUpdate(
      { clientId: data.clientId },
      { $set: updateData },
      { new: true, useFindAndModify: false }
    );

    return Boolean(res);
  } catch (error) {
    console.error(error);
    return false;
  }
};

const addMemberShip = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      const userData = await memberShip.find({
        clientId: decryptcheck.clientId,
      });
      if (userData.length > 0) {
        const responce = await updateMemberShip(decryptcheck);
        if (responce === true) {
          res.json({ status: true, message: "Add member ship Success!" });
        } else {
          res.json({ status: false, message: "Add member ship failed!" });
        }
      } else {
        const obj = new memberShip({
          clientId: decryptcheck.clientId,
          email: decryptcheck.email,
          Domestic: decryptcheck.Domestic,
          International: decryptcheck.International,
          DomesticStatus: decryptcheck.DomesticStatus,
          InternationalStatus: decryptcheck.InternationalStatus,
        });
        const saveData = await obj.save();
        if (saveData) {
          res.json({ status: true, message: "Add member ship Success!" });
        } else {
          res.json({ status: false, message: "Add member ship failed!" });
        }
      }
    } else {
      res.json({ status: false, message: "Add member ship failed!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Add member ship failed!" });
  }
};

const checkUserMembership = async (data) => {
  try {
    const res = await memberShip.find({ clientId: data });
    if (res.length>0) {
      return [true, res[0]];
    } else {
      return [false, null];
    }
  } catch (error) {
    return [false];
  }
};

const checkUserInfo = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    const data = await loginSchema.find({ clientId: decryptcheck });
    if (data.length === 0) {
      res.json({ status: false, message: "User info is not found!" });
      return;
    } else {
      let obj = data[0].toObject(); 
      const responce = await checkUserMembership(decryptcheck);
      if (responce[0] === false) {
        obj.UserMemberShip = 0;
      } else {
        obj.UserMemberShip =
          responce[1].DomesticStatus === true &&
          responce[1].InternationalStatus === true
            ? 3
            : responce[1].DomesticStatus === true
            ? 1
            : 2;
      }

      const en = encryptData(obj);
      res.json({ status: true, data: en, message: "successful " });
    }
  } catch (error) {
    console.log("ClientTokenCheck", error);
    res.json({ status: false, message: "User info is not found!" });
  }
};

const getUserMemberShip = async (req,res)=>{
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    const data = await memberShip.findOne({ clientId: decryptcheck });
    if(data){
      const en = encryptData(data);
      res.json({ status: true, data: en, });
    }else{
      res.json({ status: false, });
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = { addMemberShip, checkUserInfo,getUserMemberShip };
