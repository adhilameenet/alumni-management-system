const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    imageUrl : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    mainHeading : {
        type : String,
        required : true
    },
    subHeading : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
})

const Event = mongoose.model("Event",eventSchema);
module.exports = Event;