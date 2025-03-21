const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const data = new mongooseSchema({
  DollerPrice: { type: Number },
  date:{type:Date}
});

const details = mongoose.model("Doller", data);
module.exports = details;
