const User = require('../models/User')
const Feedback = require('../models/Feedback')

exports.getHomePage = (req,res) => {
    res.render('faculty/home', {
        title:"Home",
        faculty : true
    })
}
exports.getSignupPage = (req,res) => {
    res.render('faculty/signup', {
        title : "Signup"
    })
}
exports.getLoginPage = (req,res) => {
    res.render('faculty/login', {
        title : "Login"
    })
}
exports.getVerifyAlumniPage = async (req,res) => {
    const pendingAlumni = await User.find().lean()
    res.render('faculty/verify-alumni', { 
        title : "Verify Alumni",
        faculty : true,
        alumni:pendingAlumni 
    })
}

exports.getAddEventPage = (req,res) => {
    res.render('faculty/add-events', {
        title : "Add Events",
        faculty : true
    })
}
exports.postAddEventPage = (req,res) => {
    console.log(req.body)
}

exports.getAllFeedbackPage = async (req,res) => {
    const allAlumniFeedback = await Feedback.find().sort({createdAt:-1}).lean()
    res.render('faculty/all-feedback', { 
        title : "Feedback",
        faculty : true,
        feedback : allAlumniFeedback 
    })
}