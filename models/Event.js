const mongoose = require('mongoose')
const defaultUrl = 'https://img.freepik.com/free-vector/businessman-planning-events-deadlines-agenda_74855-6274.jpg?w=2000';

const eventSchema = new mongoose.Schema({
    imageUrl : {
        type : String,
        default : defaultUrl,
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