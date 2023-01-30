const path = require('path')
const { v4 } = require('uuid')
const { generateYears } = require('../helpers/helper')
const Achievement = require('../models/Achievement')
const Faculty = require('../models/Faculty')
const User = require('../models/User')
const Event = require('../models/Event')
const Feedback = require('../models/Feedback')
const Department = require('../models/Department')

exports.getHomePage = (req,res) => {
    res.render('faculty/home', {
        title:"Home",
        faculty : true
    })
}
exports.getSignupPage = async (req,res) => {
    const departments = await Department.find({}).lean()
    res.render('faculty/signup', {
        title : "Signup",
        department : departments
    })
}
exports.postSignupPage = async (req,res) => {
    try {
        const facultyExist = await Faculty.findOne({ email:req.body.email }).lean()
        if (facultyExist) {
          return res.status(400).json({ message: 'User already exist' })
        }
        if (req.body.password == req.body.confirmpassword) {
          const faculty = new Faculty({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            department : req.body.department,
            password : req.body.password,
            confirmpassword : req.body.confirmpassword
          })
          await faculty.save()
          res.redirect('/faculty/login')
        } else {
          console.log('Password Mismatch')
        }
      } catch (error) {
        console.log(error)
      }
}
exports.getLoginPage = (req,res) => {
    res.render('faculty/login', {
        title : "Login"
    })
}
exports.postLoginPage = async (req,res) => {
    const { email, password } = req.body
    try {
      const faculty = await Faculty.findOne({ email }).lean()
      if (!faculty) {
        return res.status(400).json({ message: 'Invalid Email Address' })
      }
      console.log(password);
      if (faculty.password == password) {   
        req.session.faculty = faculty;
        req.session.facultyAuth = true;
        res.redirect('/faculty')
      } else {
        res.status(400).json({ message: 'Invalid Password' })
      }
    } catch (error) {
      console.log(error)
    }
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

exports.getLogout = (req,res) => {
    req.session.faculty = null;
    req.session.facultyAuth = false;
    res.redirect('/faculty/login')
}

exports.postAddEventPage = async(req,res) => {
    let sampleFile;
    let uploadPath;
    if(!req.files || Object.keys(req.files).length == 0) {
        return res.status(400).json({"message":"No file were uploaded"})
    }
    sampleFile = req.files.sampleFile
    const imageExtension = sampleFile.name.split('.')[1]
    const uploadUrl = v4() + `.${imageExtension}`;
    uploadPath = path.join(__dirname,'..','public','uploads', uploadUrl )
    console.log(uploadPath)
    sampleFile.mv(uploadPath, function(err){
        if(err) {
            return res.status(500).send(err)
        }
    })

    const newEvent = new Event({
       imageUrl : uploadUrl,
       date : req.body.date,
       mainHeading : req.body.main,
       subHeading : req.body.sub,
       description : req.body.description 
    })
    await newEvent.save()
    res.redirect('/faculty')
}

exports.getAllFeedbackPage = async (req,res) => {
    const alumniFeedback = await Feedback.find().sort({createdAt:-1}).lean()
    res.render('faculty/alumni-feedback', { 
        title : "Feedback",
        faculty : true,
        feedback : alumniFeedback,

    })
}
exports.getAddAchievementsPage = async (req,res) => {
  const departments = await Department.find({}).lean()
  res.render('faculty/add-achievements', {
    title : "Add Achievements",
    years : generateYears(),
    department : departments,
    faculty : true
  })
}

exports.postAddAchievementPage = async (req,res) => {
  let sampleFile;
  let uploadPath;
  if(!req.files || Object.keys(req.files).length == 0) {
      return res.status(400).json({"message":"No file were uploaded"})
  }
  sampleFile = req.files.sampleFile
  const imageExtension = sampleFile.name.split('.')[1]
  const uploadUrl = v4() + `.${imageExtension}`;
  uploadPath = path.join(__dirname,'..','public','uploads', uploadUrl )
  console.log(uploadPath)
  sampleFile.mv(uploadPath, function(err){
      if(err) {
          return res.status(500).send(err)
      }
  })

  const newAchievement = new Achievement({
     imageUrl : uploadUrl,
     name : req.body.name,
     batch : req.body.batch,
     startyear : req.body.startyear,
     endyear : req.body.endyear,
     description : req.body.description
  })
  await newAchievement.save()
  res.redirect('/faculty')
}

exports.getAllAlumniPage = async (req,res) => {
  const allAlumni = await User.find({}).lean()
  res.render('faculty/all-alumni', {
    title : "All Alumni",
    alumni : allAlumni,
    faculty : true
  })
}