const User = require("../models/User");
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
  res.render("alumni/home", {
    title: "Home",
    user: true,
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
    if (req.body.password == req.body.confirmpassword) {
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        batch: req.body.batch,
        startyear: req.body.startyear,
        endyear: req.body.endyear,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });
      await user.save();
      req.flash("success", "Your account has been created successfully!");
      res.redirect("/alumni/login");
    } else {
      req.flash("error", "Passwords does not match");
      res.redirect("/alumni/signup");
    }
  } catch (error) {
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
  const departments = await Department.find({}).lean();
  res.render("alumni/feedback", {
    title: "Feedback",
    user: true,
    department : departments
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

exports.getEventsPage = async (req, res) => {
  const allEvents = await Event.find({}).lean();
  res.render("alumni/view-events", {
    title: "Events",
    event: allEvents,
    user: true,
  });
};

exports.getProfilePage = async (req, res) => {
  const departments = await Department.find({}).lean();
  res.render("alumni/profile", {
    districts: generateDistricts(),
    bloodgroups : generateBloodGroups(),
    department: departments,
    title: "Profile",
    user: true,
  });
};

exports.getAchievementsPage = async (req, res) => {
  const allAchievements = await Achievement.find({}).lean();
  res.render("alumni/achievements", {
    title: "Achievements",
    achievement: allAchievements,
    user: true,
  });
};

exports.getDonationsPage = async (req, res) => {
  const allDonations = await Donation.find({}).lean();
  res.render("alumni/donations", {
    title: "Donations",
    donation: allDonations,
    user: true,
  });
};
