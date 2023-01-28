const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  firstname : {
    type : String,
    required : true
  },
  lastname : {
    type : String,
    required : true
  },
  batch : {
    type : String,
    required : true
  },
  startyear : {
    type : Number,
    required : true
  },
  endyear : {
    type : Number,
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