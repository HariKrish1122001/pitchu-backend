const International = require("../../model/clientModel/International");
const membershipSchema = require("../../model/clientModel/membershipSchema");
const clientSchema = require("../../model/clientModel/loginSchema");

const { encryptData, decryptData } = require("../../utils/securedata");

const update = async (_clientId, _id, length, amount, types, RorP, pending) => {
  try {

    // Validate inputs
    if (!_clientId || !_id || !length || !amount || !types || !RorP) {
      throw new Error("Missing required parameters.");
    }
    if (_id !== process.env.ADMIN_ID) {
      const updateFields = {
        [`internationalBuyerLength.${types}`]: length,
        [`${RorP}.${types}`]: amount,
      };

      // Add pending field conditionally
      if (pending != 0) {
        updateFields[`internationalPendingAmount.${types}`] = 0;
      }
      
      if(length > 2){
        updateFields['taskCompleteStatus'] = true;
      }
      // Update document in database
      const updatedDocument = await clientSchema.findOneAndUpdate(
        {clientId:_id},
        { $set: updateFields,
          $push: {
            [`internationalPackageBuyer.${types}`]: _clientId, 
          },
         },
        { new: true, runValidators: true }
      );
    } else {
      const updatedDocument = await clientSchema.findOneAndUpdate(
       { clientId:_id},
        {
          $inc: {
            [`${RorP}.${types}`]: amount,
            [`internationalBuyerLength.${types}`]: length,
          },
          $push: {
            [`internationalPackageBuyer.${types}`]: _clientId,
          },
        },

        { new: true, runValidators: true }
      );
    }
  } catch (error) {
    console.error("Error in update function:", error.message);
  }
};


const addRewardsInReferral = async (planstatus,_clientId, id, type, amount) => {
  try {
    const referalDetails = await clientSchema.findOne({ clientId: id });
    if (Object.keys(referalDetails).length > 0 ) {
      if (referalDetails.internationalPackageBuyer[type].includes(_clientId) || planstatus === false) {
        await update(_clientId, process.env.ADMIN_ID, 1, amount, type, "internationalRewardAmount", 0);
      } else {
        if (referalDetails.internationalBuyerLength[type] !== 0 && (referalDetails.internationalBuyerLength[type] + 1) % 2 == 0) {
          const reduceFee = amount - (amount * 28 / 100);
          const reward = referalDetails.internationalRewardAmount[type] + referalDetails.internationalPendingAmount[type] + reduceFee;
          await update(_clientId, referalDetails.clientId, referalDetails.internationalBuyerLength[type] + 1, reward, type, "internationalRewardAmount", referalDetails.internationalPendingAmount[type]);
        } else {
          const reward = referalDetails.internationalPendingAmount[type] + amount;
          await update(_clientId, referalDetails.clientId, referalDetails.internationalBuyerLength[type] + 1, reward, type, "internationalPendingAmount", 0);
        }
      }
    }
  } catch (error) {
    console.log(">>>>>>>>>", error);
  }
}

const InternationalPlanUserAdd = async (req, res) => {
  try {
    const { enData } = req.body;
    const decryptcheck = decryptData(enData);
    if (decryptcheck) {
      const responce = await membershipSchema.find({
        clientId: decryptcheck.clientId,
      });
      if (responce.length === 0) {
        res.json({ status: false, message: "You can't buy a membership!" });
        return;
      }

      if (responce[0].InternationalStatus !== true) {
        res.json({
          status: false,
          message: "You can't buy a International membership!",
        });
        return;
      }
      const planVerify = await International.find({
        clientId: decryptcheck.clientReferelId,
        amountType:decryptcheck.amountType
      });
      const planstatus = planVerify.length > 0 ?  true:false;
  
      let obj = new International({
        amountType: decryptcheck.amountType,
        clientId: decryptcheck.clientId,
        clientReferelId: decryptcheck.clientReferelId,
        email: decryptcheck.email,
        amount: decryptcheck.amount,
      });

      if (!decryptcheck.clientId || !decryptcheck.clientReferelId || !decryptcheck.amountType || !decryptcheck.amount) {
        return res.json({ status: false, message: "The domestic plan has failed!" });
      }

      await addRewardsInReferral(planstatus,decryptcheck.clientId, decryptcheck.clientReferelId, decryptcheck.amountType, decryptcheck.amount);
      const responceSave = await obj.save();
      if (responceSave) {
        res.json({ status: true, message: "The International plan has success!" });
      } else {
        res.json({ status: false, message: "The International plan has failed!" });
      }
    } else {
      res.json({ status: false, message: "The International plan has failed!" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { InternationalPlanUserAdd };
