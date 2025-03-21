const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const obj = new mongooseSchema({
    Low: { type: Number, default: 0 },
    Medium: { type: Number, default: 0 },
    High: { type: Number, default: 0 },
})

const details = mongoose.model("domisticPlan",obj);
module.exports = details;