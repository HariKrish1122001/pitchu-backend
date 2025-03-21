const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const data = new mongooseSchema({
  clientId: { type: String },
  clientReferelId: { type: String },
  email: { type: String },
  amount: { type: Number },
  referelId: { type: String },
  amountType: { type: String },
  date: { type: Date, default: Date.now }
});

const details = mongoose.model("Domestic", data);
module.exports = details;
