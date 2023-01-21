const mongoose = require('mongoose')
const feedbackSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    batch : {
        type : String,
        required : true,
        required : true
    },
    message : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

const Feedback = mongoose.model("Feedback", feedbackSchema)
module.exports = Feedback;