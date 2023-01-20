const User = require('../models/User')

exports.getHomePage = (req,res) => {
    res.render('alumni/home', {
        title : "Home",
        user : true
    })
}
exports.getAboutPage = (req,res) => {
    res.render('alumni/about', {
        title : "About",
        user : true
    })
}
exports.getEventsPage = (req,res) => {
    res.render('alumni/events', {
        title : "Events",
        user : true
    })
}
exports.getGalleryPage = (req,res) => {
    res.render('alumni/gallery', {
        title : "Gallery",
        user : true
    })
}
exports.getSignupPage = (req,res) => {
    res.render('alumni/signup' , {
        title:"Alumni Signup"
    })
}
exports.postSignupPage = async (req,res) => {
    const { fullname,email,password,confirmpassword } = req.body;
    try {
        if(password == confirmpassword) {
            const user = new User({
                name : fullname,
                email : email,
                password : password,
                confirmpassword : confirmpassword
            })
            await user.save();
            res.redirect('/alumni')
        } else {
            console.log("Password Mismatch")
        }
    } catch (error) {
        console.log(error)
    }
}
exports.getLoginPage = (req,res) => {
    res.render('alumni/login', {
        title : "Alumni Login"
    })
}
exports.postLoginPage = (req,res) => {
    console.log(req.body);
}