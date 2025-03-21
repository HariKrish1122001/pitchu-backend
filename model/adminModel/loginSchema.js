const mongoose =require("mongoose");
const mongooseSchema = mongoose.Schema;

const data = new mongooseSchema({
   email:{type:String},
   password:{type:String},
   otp:{type:Number,default:0},
   otpExp:{type:Date,default:Date.now}
})


const details = mongoose.model('adminLogin',data);
module.exports = details;