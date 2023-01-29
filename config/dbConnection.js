require('dotenv').config()
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
const dbOptions = {
    useNewUrlParser : true,
    useUnifiedTopology : true
}
mongoose.set('strictQuery', false);
module.exports = {
    dbConnect: () => {
        mongoose.connect(MONGO_URI, dbOptions)
        .then(() => {console.log("Connected to the MongoDB!!");
        }).catch((err) => {
            console.log("Error Occured : " , err);
            process.exit(1);
        })
    }
}