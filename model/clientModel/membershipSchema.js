const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const data = new mongooseSchema({
   
   clientId:{type:String},
   email:{type:String},
   Domestic :{type:Number,default:0},
   International :{type:Number,default:0},
   DomesticStatus :{type:Boolean,default:false},
   InternationalStatus:{type:Boolean,default:false},
})


const details = mongoose.model('memberShip',data);
module.exports = details;