const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const obj = new mongooseSchema({
   name: { type: String, required: true },
   email: { type: String, required: true },
   clientId: { type: String, },
   referelId: { type: String },
   contact: { type: Number},
   message :{type:String},
   Date:{type:Date, default:Date.now}
})

const details = mongoose.model("supportMessage",obj);
module.exports = details;