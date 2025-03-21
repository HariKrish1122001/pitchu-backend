const dollerSchema = require("../../model/clientModel/DollerPrice");
var cron = require("node-cron");
const config = require("../../Config/Config");
const axios =require("axios");

const DollerPriceApi = async () => {
  try {
    const response = await axios.get(config.DollerpriceApi);
    const price = response.data.rates.INR;

    if (Number(price) > 0) {
      const existingData = await dollerSchema.find();

      if (existingData.length > 0) {
        await dollerSchema.findOneAndUpdate(
          { _id: existingData[0]._id },
          { $set: { DollerPrice: price, date: Date.now() } }
        );
      } else {
        const newEntry = new dollerSchema({
          DollerPrice: price,
          date: Date.now(),
        });
        await newEntry.save();
      }
    } else {
      console.log("Received invalid price:", price);
    }
  } catch (error) {
    console.error("Error fetching or updating data:", error);
  }
};

const DollerPrice = async (req, res) => {
  try {
    const existingData = await dollerSchema.find();
    if (existingData.length > 0) {
      res.json({ status: true, data: existingData[0].DollerPrice });
    } else {
      res.json({ status: true, data: 84 });
    }
  } catch (error) {
    console.error("Error fetching dollar price:", error.message);
    if (error.response && error.response.status === 404) {
      res.json({ status: false, message: "API endpoint not found", data: 0 });
    } else {
      res.json({ status: false, message: "Error fetching data", data: 0 });
    }
  }
};

cron.schedule("0 */12 * * *", () => {
    DollerPriceApi();
  });

module.exports = { DollerPrice };
