const mongoose = require('mongoose');
const settingSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
})

const Settings = mongoose.model('Settings', settingSchema);
module.exports = Settings;