const mongoose = require('mongoose')
const achievementSchema = new mongoose.Schema({
  imageUrl : {
    type : String,
    required : true
  },
  name : {
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
  description : {
    type : String,
    required : true
  }
})

const Achievement = mongoose.model("Achievement", achievementSchema)
module.exports = Achievement;