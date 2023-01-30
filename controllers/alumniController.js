const User = require('../models/User')
const Feedback = require('../models/Feedback')
const Achievement = require('../models/Achievement')
const Department = require('../models/Department')
const Event = require('../models/Event')
const { generateYears } = require('../helpers/helper')

exports.getHomePage = async (req, res) => {
  res.render('alumni/home', {
    title: 'Home',
    user: true
  })
}

exports.getSignupPage = async (req, res) => {
  const departments = await Department.find({}).lean()
  res.render('alumni/signup', {
    title: 'Alumni Signup',
    department : departments,
    years : generateYears()
  })
}
exports.postSignupPage = async (req, res) => {
  try {
    const userExist = await User.findOne({ email:req.body.email }).lean()
    if (userExist) {
      return res.status(400).json({ message: 'User already exist' })
    }
    if (req.body.password == req.body.confirmpassword) {
      const user = new User({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email : req.body.email,
        batch : req.body.batch,
        startyear : req.body.startyear,
        endyear : req.body.endyear,
        password : req.body.password,
        confirmpassword : req.body.confirmpassword
      })
      await user.save()
      res.redirect('/alumni/login')
    } else {
      console.log('Password Mismatch')
    }
  } catch (error) {
    console.log(error)
  }
}
exports.getLoginPage = (req, res) => {
  res.render('alumni/login', {
    title: 'Alumni Login',
  })
}
exports.postLoginPage = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email }).lean()
    if (!user) {
      return res.status(400).json({ message: 'Invalid Email Address' })
    }
    if (user.password == password) {
      req.session.user = user;
      req.session.userAuth = true
      res.redirect('/alumni')
    } else {
      res.status(400).json({ message: 'Invalid Password' })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.alumniLogout = (req,res) => {
  req.session.user = null;
  req.session.userAuth = false;
  res.redirect('/alumni/login')
}

exports.getFeedbackPage = (req, res) => {
  res.render('alumni/feedback', {
    title: 'Feedback',
    user: true,
  })
}
exports.postFeedbackPage = async (req, res) => {
  const { name, batch, message } = req.body
  try {
    const newFeedback = new Feedback({
      name,
      batch,
      message,
    })
    await newFeedback.save()
    res.redirect('/alumni')
  } catch (error) {
    console.log(error)
  }
}

exports.getEventsPage = async (req,res) => {
  const allEvents = await Event.find({}).lean()
  res.render('alumni/view-events', {
    title : "Events",
    event : allEvents,
    user : true
  })
}

exports.getAlumniProfilePage = async (req, res) => {
  const alumniProfile = await User.find().limit(1).lean()
  res.render('alumni/profile', {
    alumni: alumniProfile,
    title: 'Profile',
    user: true,
  })
}

exports.getAchievementsPage = async (req,res) => {
  const allAchievements = await Achievement.find({}).lean()
  res.render('alumni/achievements' , {
    title : "Achievements",
    achievement : allAchievements,
    user : true
  })
}
