const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

// Sub-schema for reward details
const RewardSchema = new mongooseSchema({
   Low: { type: Number, default: 0 },
   Medium: { type: Number, default: 0 },
   High: { type: Number, default: 0 },
},{ _id: false });;

const RewardId = new mongooseSchema({
   Low: [],
   Medium: [],
   High: [],
},{ _id: false });;
// Main schema
const data = new mongooseSchema({
   name: { type: String, required: true },
   email: { type: String, required: true },
   password: { type: String, required: true },
   clientId: { type: String, },
   referelId: { type: String },
   contact: { type: Number,  },
   otp: { type: Number, default: 0 },
   otpExp: { type: Date, default: Date.now }, 
   directReferral: [],
   domesticBuyerLength: { type: RewardSchema, default: () => ({}) },
   domesticRewardAmount: { type: RewardSchema, default: () => ({}) },
   domesticPendingAmount: { type: RewardSchema, default: () => ({}) },
   internationalBuyerLength: { type: RewardSchema, default: () => ({}) },
   internationalRewardAmount: { type: RewardSchema, default: () => ({}) },
   internationalPendingAmount: { type: RewardSchema, default: () => ({}) },
   taskCompleteStatus : {type: Boolean,default:false},
   domesticPackageBuyer: { type: RewardId, default: () => ({}) },
   internationalPackageBuyer:  { type: RewardId, default: () => ({}) },
   totalRewardDomistic:{ type: RewardSchema, default: () => ({}) },
   totalRewardInternational:{ type: RewardSchema, default: () => ({}) },
});

const details = mongoose.model("clientLogin", data);
module.exports = details;
