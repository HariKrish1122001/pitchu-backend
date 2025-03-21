const SupportSchema = require("../../model/clientModel/support");
const { encryptData, decryptData } = require("../../utils/securedata");


const SupportMsg =async(req,res)=>{
    try {
        const getData = await SupportSchema.find();
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


const deleteMsg = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (!Array.isArray(decryptcheck) || decryptcheck.length === 0) {
      return res.send({ status: false, message: "Invalid or empty data" });
    }
    for(const items of decryptcheck){
           console.log("items>>",items.data)
           await SupportSchema.findByIdAndDelete({_id:items.data._id})
    }

    return res.send({ status: true, message: "Success!" });
  } catch (error) {
    console.error("Error in deleteMsg:", error);
    return res.send({ status: false, message: "Failed" });
  }
};

module.exports = {
  SupportMsg,deleteMsg
}