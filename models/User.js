const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    trim : true,
    lowercase : true,
    unique : true,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  confirmpassword : {
    type : String,
    required : true
  }
})

const User = mongoose.model('User', userSchema);
module.exports = User;