const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const data = new mongooseSchema({
  identityId: { type: String },
  name: { type: String },
  clientId: { type: String },
  referelId: { type: String },
  amountType: { type: String },
  amount: { type: Number },
  category: { type: Number },
  date: { type: Date, default: Date.now },
});

const details = mongoose.model("notification", data);
module.exports = details;
