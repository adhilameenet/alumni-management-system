const User = require('../models/User')
const Feedback = require('../models/Feedback')

exports.getHomePage = (req,res) => {
    res.render('faculty/home', {
        title:"Home",
        user : true
    })
}
exports.getVerifyAlumniPage = async (req,res) => {
    const pendingAlumni = await User.find().lean()
    res.render('faculty/verify-alumni', { alumni:pendingAlumni })
}
exports.getAllFeedbackPage = async (req,res) => {
    const allAlumniFeedback = await Feedback.find().sort({createdAt:-1}).lean()
    res.render('faculty/all-feedback', { 
        title : "Feedback",
        user : true,
        feedback:allAlumniFeedback 
    })
}