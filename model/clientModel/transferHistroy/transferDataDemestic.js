const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const data = new mongooseSchema({
  identityId: { type: String },
  name: { type: String },
  clientId: { type: String },
  amountType: { type: String },
  amount: { type: Number },
  rewardAmount: { type: Number, default: 0 },
  category: { type: Number,default:0 },
  status: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const details = mongoose.model("transferHistoryDomestic", data);
module.exports = details;
