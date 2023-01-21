const User = require('../models/User')
const Feedback = require('../models/Feedback')

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
        const userExist = await User.findOne({ email }).lean()
        if(userExist) {
            return res.status(400).json({message:"User already exist"})
        }
        if(password == confirmpassword) {
            const user = new User({
                name : fullname,
                email,
                password,
                confirmpassword
            })
            await user.save();
            res.redirect('/alumni/login')
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
exports.postLoginPage = async (req,res) => {
    const { email,password } = req.body;
    try {
        const user = await User.findOne({email}).lean()
        if(!user) {
            return res.status(400).json({message:"Invalid Email Address"})
        } 
        if(user.password == password) {
            res.redirect('/alumni')
        } else {
            res.status(400).json({message:"Invalid Password"})
        }
    } catch (error) {
        console.log(error)
    }
}
exports.getFeedbackPage = (req,res) => {
    res.render('alumni/feedback', {
        title : "Feedback",
        user : true
    })
}
exports.postFeedbackPage = async (req,res) => {
    const { name,batch,message } = req.body;
   try {
    const newFeedback = new Feedback({
        name,
        batch,
        message
    })
    await newFeedback.save()
    res.redirect('/alumni')
   } catch (error) {
     console.log(error)
   }
}
exports.getAlumniProfilePage = async (req,res) => {
    const alumniProfile = await User.find().limit(1).lean()
    res.render('alumni/profile', {
        alumni : alumniProfile,
        title : "Profile",
        user : true
    })
}
exports.postAlumniProfilePage = (req,res) => {
    // logic
}