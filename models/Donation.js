const mongoose = require('mongoose')
const donationSchema = new mongoose.Schema({
    imageUrl : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    donationLink : {
        type : String,
        required : true
    }
})

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;