const path = require('path')
const { v4 } = require('uuid')
const { generateYears } = require('../helpers/helper')
const Achievement = require('../models/Achievement')
const Faculty = require('../models/Faculty')
const User = require('../models/User')
const Event = require('../models/Event')
const Feedback = require('../models/Feedback')
const Donation = require('../models/Donation')
const Department = require('../models/Department')

exports.getHomePage = (req,res) => {
    res.render('faculty/home', {
        title:"Home",
        success : req.flash('success'),
        faculty : true
    })
}
exports.getSignupPage = async (req,res) => {
    const departments = await Department.find({}).lean()
    res.render('faculty/signup', {
        title : "Signup",
        success : req.flash('success'),
        error : req.flash('error'),
        department : departments
    })
}
exports.postSignupPage = async (req,res) => {
    try {
        const facultyExist = await Faculty.findOne({ email:req.body.email }).lean()
        if (facultyExist) {
          req.flash('error','User already exist')
          return res.redirect('/faculty/signup')
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
          req.flash('success','Your account has been created successfully!')
          res.redirect('/faculty/login')
        } else {
          req.flash('error','Passwords does not match')
          res.redirect('/faculty/signup')
        }
      } catch (error) {
        res.render('errors/500', { title : "Internal Server Error" })
      }
}
exports.getLoginPage = (req,res) => {
    res.render('faculty/login', {
        success : req.flash('success'),
        error : req.flash('error'),
        title : "Login"
    })
}
exports.postLoginPage = async (req,res) => {
    const { email, password } = req.body
    try {
      const faculty = await Faculty.findOne({ email }).lean()
      if (!faculty) {
        req.flash('error','Invalid Email Address')
        return res.redirect('/faculty/login')
      }
      console.log(password);
      if (faculty.password == password) {   
        req.session.faculty = faculty;
        req.session.facultyAuth = true;
        req.flash('success','Login Success!')
        res.redirect('/faculty')
      } else {
        req.flash('error','Invalid Password')
        res.redirect('/faculty/login')
      }
    } catch (error) {
      res.render('errors/500', { title : "Internal Server Error" })
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

exports.getDonationsPage = (req,res) => {
  res.render('faculty/add-donations', {
    title : "Add Donations",
    faculty : true
  })
}

exports.postDonationsPage = async (req,res) => {
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

  const newDonation = new Donation({
     imageUrl : uploadUrl,
     title : req.body.main,
     description : req.body.description
  })
  await newDonation.save()
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