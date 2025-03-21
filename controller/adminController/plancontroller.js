const domisticPlanSchema = require("../../model/plans/domisticPlan");
const internationalPlan = require("../../model/plans/internationalPlan");
const { encryptData, decryptData } = require("../../utils/securedata");

const getPlan = async (req, res) => {
    try {

        const findDomistic = await domisticPlanSchema.find();
        const findinternal = await internationalPlan.find();
        if (findinternal.length == 0 && findDomistic.length == 0) {
            return  res.send({ status: false, data: [], message: "failed!" });
        }
        let arr = [findDomistic[0], findinternal[0]];
        let en = await encryptData(arr);
        res.send({ status: true, data: en, message: "success!" });

    } catch (error) {
        console.log(error)
        res.send({ status: false, data: [], message: "failed!" });
    }
}



const updatePlan = async (req, res) => {
    try {
            const { enData } = req.body;
            const decryptcheck = decryptData(enData);

        if (decryptcheck) {
            const schema = decryptcheck.status === 0 ? domisticPlanSchema : internationalPlan;

            await schema.findOneAndUpdate(
                { _id: decryptcheck._id },
                {
                    $set: {
                        [`${decryptcheck.type}`]: decryptcheck.amount,
                    },
                }
            );

            res.send({ status: true, message: "success!" });
        } else {
            res.send({ status: false, message: "failed!" });
        }
    } catch (error) {
        console.error("Error in updatePlan:", error);
        res.send({ status: false, message: "failed!" });
    }
};



module.exports = { getPlan,updatePlan };