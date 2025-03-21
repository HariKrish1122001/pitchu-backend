const { model } = require("mongoose");
const clientSchema = require("../../model/clientModel/loginSchema");
const { encryptData, decryptData } = require("../../utils/securedata");
require("dotenv").config();


const getDomesticWinners = async (req, res) => {
    try {
        const findDomistic = await clientSchema.find();

        if (findDomistic.length === 0) {
            return res.send({ status: false, data: [], message: "failed!" });
        }
        let arr = [];
        const rewardTypes = ["Low", "High", "Medium"];

        findDomistic.forEach((data) => {
            if (data.clientId !== process.env.ADMIN_ID) {
                rewardTypes.forEach((type) => {
                    if (data.domesticRewardAmount[type] > 0) {

                        arr.push({
                            _id: data._id,
                            name: data.name,
                            email: data.email,
                            password: data.password,
                            clientId: data.clientId,
                            referelId: data.referelId,
                            amount: data.domesticRewardAmount[type],
                            type: type,
                        });
                    }
                });
            }
        });

        // Encrypt the data before sending
        let en = await encryptData(arr);
        res.send({ status: true, data: en, message: "success!" });

    } catch (error) {
        console.error("Error in getDomesticWinners:", error);
        res.send({ status: false, data: [], message: "failed!" });
    }
};


const getInternationalWinners = async (req, res) => {
    try {
        const findDomistic = await clientSchema.find();

        if (findDomistic.length === 0) {
            return res.send({ status: false, data: [], message: "failed!" });
        }
        let arr = [];
        const rewardTypes = ["Low", "High", "Medium"];

        findDomistic.forEach((data) => {
            if (data.clientId !== process.env.ADMIN_ID) {
                rewardTypes.forEach((type) => {
                    if (data.internationalRewardAmount[type] > 0) {

                        arr.push({
                            _id: data._id,
                            name: data.name,
                            email: data.email,
                            password: data.password,
                            clientId: data.clientId,
                            referelId: data.referelId,
                            amount: data.internationalRewardAmount[type],
                            type: type,
                        });
                    }
                });
            }
        });

        // Encrypt the data before sending
        let en = await encryptData(arr);
        res.send({ status: true, data: en, message: "success!" });

    } catch (error) {
        console.error("Error in getDomesticWinners:", error);
        res.send({ status: false, data: [], message: "failed!" });
    }
}

const getDomesticSendReward = async (req, res) => {
    try {
        const { enData } = req.body;
        const decryptcheck = decryptData(enData);
        if (decryptcheck) {

          const a =   await clientSchema.findOneAndUpdate(
                { clientId: decryptcheck.clientId },
                {
                    $inc: {
                        [`totalRewardDomistic.${decryptcheck.type}`]: decryptcheck.amount
                    },
                    $set: {
                        [`domesticRewardAmount.${decryptcheck.type}`]: 0
                    }
                }
            )
            res.send({ status: true, message: "success!" });
        } else {
            res.send({ status: true, message: "success!" });
        }
    } catch (error) {
        console.log(error);
        res.send({ status: false, message: "Submit failed!" });
    }
}

const getInternationalSendReward = async (req, res) => {
    try {
        const { enData } = req.body;
        const decryptcheck = decryptData(enData);
        if (decryptcheck) {
    
            await clientSchema.findOneAndUpdate(
                { clientId: decryptcheck.clientId },
                {
                    $inc: {
                        [`totalRewardInternational.${decryptcheck.type}`]: decryptcheck.amount
                    },
                    $set: {
                        [`internationalRewardAmount.${decryptcheck.type}`]: 0
                    }
                }
            )
            res.send({ status: true, message: "success!" });
        } else {
            res.send({ status: true, message: "success!" });
        }
    } catch (error) {
        console.log(error);
        res.send({ status: false, message: "Submit failed!" });
    }
}

module.exports = {
    getDomesticWinners, getInternationalWinners, getDomesticSendReward, getInternationalSendReward
}