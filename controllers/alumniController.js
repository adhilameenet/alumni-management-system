const { v4 } = require("uuid");
const path = require("path");
const User = require("../models/User");
const Settings = require('../models/Settings')
const Feedback = require("../models/Feedback");
const Achievement = require("../models/Achievement");
const Donation = require("../models/Donation");
const Department = require("../models/Department");
const Event = require("../models/Event");
const {
  generateYears,
  generateDistricts,
  generateBloodGroups,
} = require("../helpers/helper");

exports.getHomePage = async (req, res) => {
  const allEvents = await Event.find({}).lean();
  const allDonations = await Donation.find({}).lean();
  const allAchievements = await Achievement.find({}).lean();
  const settings = await Settings.find().lean()
  res.render("alumni/home", {
    title: "Home",
    user: req.session.user,
    event:allEvents,
    donation : allDonations,
    achievement : allAchievements,
    settings
  });
};

exports.getSignupPage = async (req, res) => {
  const departments = await Department.find({}).lean();
  res.render("alumni/signup", {
    title: "Alumni Signup",
    error: req.flash("error"),
    department: departments,
    years: generateYears(),
  });
};
exports.postSignupPage = async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email }).lean();
    if (userExist) {
      req.flash("error", "User already exist");
      res.redirect("/alumni/signup");
    }
    let isChecked;
    if(req.body.isdonor == 'on') {
      isChecked = true;
    } else {
      isChecked = false;
    }
    console.log(isChecked)
    if (req.body.password == req.body.confirmpassword) {
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        batch: req.body.batch,
        startyear: req.body.startyear,
        endyear: req.body.endyear,
        isDonor: isChecked,
        password: req.body.password,  
        confirmpassword: req.body.confirmpassword,
      });
      await user.save();
      req.flash(
        "success",
        "Registration submitted. Please wait for verification."
      );
      res.redirect("/alumni/login");
    } else {
      req.flash("error", "Passwords does not match");
      res.redirect("/alumni/signup");
    }
  } catch (error) {
    console.log(error)
    res.render("errors/500", { title: "Internal Server Error" });
  }
};
exports.getLoginPage = (req, res) => {
  res.render("alumni/login", {
    title: "Alumni Login",
    success: req.flash("success"),
    error: req.flash("error"),
  });
};
exports.postLoginPage = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).lean();
    console.log(user);
    if (!user) {
      req.flash("error", "Invalid Email Address");
      return res.redirect("/alumni/login");
    }
    if (user.password == password) {
      if (!user.isVerified) {
        req.flash("error", "Not Verified by Admin");
        return res.redirect("/alumni/login");
      }
      req.session.user = user;
      req.session.userAuth = true;
      res.redirect("/alumni");
    } else {
      req.flash("error", "Invalid Password");
      res.redirect("/alumni/login");
    }
  } catch (error) {
    res.render("errors/500", { title: "Internal Server Error" });
  }
};

exports.alumniLogout = (req, res) => {
  req.session.user = null;
  req.session.userAuth = false;
  res.redirect("/alumni/login");
};

exports.getFeedbackPage = async (req, res) => {
  const userDetails = await User.find({_id:req.session.user._id}).lean()
  res.render("alumni/feedback", {
    title: "Feedback",
    user: req.session.user,
    userDetails
  });
};
exports.postFeedbackPage = async (req, res) => {
  const { name, batch, message } = req.body;
  try {
    const newFeedback = new Feedback({
      name,
      batch,
      message,
    });
    await newFeedback.save();
    res.redirect("/alumni");
  } catch (error) {
    res.render("errors/500", { title: "Internal Server Error!" });
  }
};


exports.getProfilePage = async (req, res) => {
  const userProfile = await User.findOne({ _id: req.session.user._id }).lean();
  res.render("alumni/profile", {
    districts: generateDistricts(),
    bloodgroups: generateBloodGroups(),
    title: "Profile",
    user: req.session.user,
    userProfile,
    error: req.flash("error"),
  });
};

exports.postAlumniProfile = async (req, res) => {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length == 0) {
    req.flash("error", "No files were uploaded");
    return res.redirect("/alumni/profile");
  }
  sampleFile = req.files.sampleFile;
  const uploadUrl = sampleFile.name;
  uploadPath = path.join(__dirname, "..", "public", "uploads", uploadUrl);
  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      return res.render("errors/500", {
        title: "Internal Server Error",
      });
    }
  });
  try {
    const myProfile = await User.findOne({ _id: req.session.user._id });
    myProfile.imageUrl = uploadUrl;
    myProfile.firstname = req.body.firstname;
    myProfile.lastname = req.body.lastname;
    myProfile.email = req.body.email;
    myProfile.phone = req.body.phone;
    myProfile.whatsapp = req.body.whatsapp;
    myProfile.bloodgroup = req.body.bloodgroup;
    myProfile.gender = req.body.gender;
    myProfile.batch = req.body.batch;
    myProfile.startyear = req.body.startyear;
    myProfile.endyear = req.body.endyear;
    myProfile.district = req.body.district;
    myProfile.location = req.body.location;
    await myProfile.save();
    res.redirect("/alumni");
  } catch (error) {
    return res.render("errors/500", {
      title: "Internal Server Error",
    });
  }
};

exports.getConnectAlumni = async (req,res) => {
  const alumni = await User.find({}).lean()
  res.render('alumni/connect-alumni', {
    title : "Connect Alumni",
    user : req.session.user,
    alumni
  })
}