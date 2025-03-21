const loginSchema = require("../../../model/clientModel/loginSchema");
const { encryptData, decryptData } = require("../../../utils/securedata");

const userInfo = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      const responce = await loginSchema.find({clientId:decryptcheck});
      if(responce.length>0){
        const en = encryptData(responce);
        res.send({ status: true,data:en, message: " success!" });
      }else{
        res.send({ status: false, message: " failed" });
      }
    } else {
      res.send({ status: false, message: " failed" });
    }
  } catch (error) {
    res.send({ status: false, message: " failed" });
  }
};

module.exports ={userInfo};
