const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  imageUrl: {
    type: String
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  whatsapp: {
    type: Number,
  },
  bloodgroup: {
    type: String,
  },
  batch: {
    type: String,
    required: true,
  },
  startyear: {
    type: Number,
    required: true,
  },
  endyear: {
    type: Number,
    required: true,
  },
  district: {
    type: String,
  },
  location: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
