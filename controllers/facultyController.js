const path = require("path");
const { v4 } = require("uuid");
const { generateYears } = require("../helpers/helper");
const Achievement = require("../models/Achievement");
const Faculty = require("../models/Faculty");
const User = require("../models/User");
const Event = require("../models/Event");
const Feedback = require("../models/Feedback");
const Donation = require("../models/Donation");
const Department = require("../models/Department");

exports.getHomePage = async (req, res) => {
  const noOfVerifiedAlumni = await User.find({ isVerified: true, batch:req.session.faculty.department }).count();
  const noOfUnverifiedAlumni = await User.find({ isVerified: false, batch:req.session.faculty.department }).count();
  const noOfEvents = await Event.find({}).count();
  const noOfAchievements = await Achievement.find({batch:req.session.faculty.department}).count();
  const noOfAlumniFeedbacks = await Feedback.find({batch:req.session.faculty.department}).count();
  res.render("faculty/home", {
    title: "Home",
    faculty: req.session.faculty,
    noOfVerifiedAlumni,
    noOfUnverifiedAlumni,
    noOfEvents,
    noOfAchievements,
    noOfAlumniFeedbacks
  });
};
exports.getSignupPage = async (req, res) => {
  const departments = await Department.find({}).lean();
  res.render("faculty/signup", {
    title: "Signup",
    success: req.flash("success"),
    error: req.flash("error"),
    department: departments,
  });
};
exports.postSignupPage = async (req, res) => {
  try {
    const facultyExist = await Faculty.findOne({
      email: req.body.email,
    }).lean();
    if (facultyExist) {
      req.flash("error", "User already exist");
      return res.redirect("/faculty/signup");
    }
    if (req.body.password == req.body.confirmpassword) {
      const faculty = new Faculty({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        department: req.body.department,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });
      await faculty.save();
      req.flash(
        "success",
        "Registration submitted. Please wait for verification."
      );
      res.redirect("/faculty/login");
    } else {
      req.flash("error", "Passwords does not match");
      res.redirect("/faculty/signup");
    }
  } catch (error) {
    res.render("errors/500", { title: "Internal Server Error" });
  }
};
exports.getLoginPage = (req, res) => {
  res.render("faculty/login", {
    success: req.flash("success"),
    error: req.flash("error"),
    title: "Login",
  });
};
exports.postLoginPage = async (req, res) => {
  const { email, password } = req.body;
  try {
    const faculty = await Faculty.findOne({ email }).lean();
    if (!faculty) {
      req.flash("error", "Invalid Email Address");
      return res.redirect("/faculty/login");
    }
    console.log(password);
    if (faculty.password == password) {
      if (!faculty.isVerified) {
        req.flash("error", "Not Verified by Admin");
        return res.redirect("/faculty/login");
      }
      req.session.faculty = faculty;
      req.session.facultyAuth = true;
      res.redirect("/faculty");
    } else {
      req.flash("error", "Invalid Password");
      res.redirect("/faculty/login");
    }
  } catch (error) {
    res.render("errors/500", { title: "Internal Server Error" });
  }
};
exports.getVerifyAlumniPage = async (req, res) => {
  const pendingAlumni = await User.find({ isVerified: false, batch:req.session.faculty.department}).lean();
  res.render("faculty/verify-alumni", {
    title: "Verify Alumni",
    faculty: req.session.faculty,
    alumni: pendingAlumni,
  });
};

exports.postVerifyAlumni = async (req, res) => {
  try {
    const alumniId = req.params.id;
    await User.findByIdAndUpdate(alumniId, { isVerified: true });
    res.redirect("/faculty/verify-alumni");
  } catch (error) {
    res.render("errors/500", {
      title: "Internal Server Error",
    });
  }
};

exports.getAddEventPage = async (req, res) => {
  const departments = await Department.find({}).lean();
  res.render("faculty/add-events", {
    title: "Add Events",
    faculty: req.session.faculty,
    department: departments,
    years: generateYears(),
  });
};

exports.getLogout = (req, res) => {
  req.session.faculty = null;
  req.session.facultyAuth = false;
  res.redirect("/faculty/login");
};

exports.postAddEventPage = async (req, res) => {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length == 0) {
    return res.status(400).json({ message: "No file were uploaded" });
  }
  sampleFile = req.files.sampleFile;
  const imageExtension = sampleFile.name.split(".")[1];
  const uploadUrl = v4() + `.${imageExtension}`;
  uploadPath = path.join(__dirname, "..", "public", "uploads", uploadUrl);
  console.log(uploadPath);
  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  });

  const newEvent = new Event({
    imageUrl: uploadUrl,
    date: req.body.date,
    mainHeading: req.body.main,
    subHeading: req.body.sub,
    description: req.body.description,
  });
  await newEvent.save();
  res.redirect("/faculty");
};

exports.getAllFeedbackPage = async (req, res) => {
  const alumniFeedback = await Feedback.find({batch:req.session.faculty.department}).sort({ createdAt: -1 }).lean();
  const feedbackCount = await Feedback.find({batch: req.session.faculty.department}).count();
  res.render("faculty/alumni-feedback", {
    title: "Feedback",
    faculty: req.session.faculty,
    feedback: alumniFeedback,
    feedbackCount
  });
};
exports.getAddAchievementsPage = async (req, res) => {
  const departments = await Department.find({}).lean();
  res.render("faculty/add-achievements", {
    title: "Add Achievements",
    years: generateYears(),
    department: departments,
    faculty: req.session.faculty,
  });
};

exports.postAddAchievementPage = async (req, res) => {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length == 0) {
    return res.status(400).json({ message: "No file were uploaded" });
  }
  sampleFile = req.files.sampleFile;
  const imageExtension = sampleFile.name.split(".")[1];
  const uploadUrl = v4() + `.${imageExtension}`;
  uploadPath = path.join(__dirname, "..", "public", "uploads", uploadUrl);
  console.log(uploadPath);
  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  });

  const newAchievement = new Achievement({
    imageUrl: uploadUrl,
    name: req.body.name,
    batch: req.body.batch,
    startyear: req.body.startyear,
    endyear: req.body.endyear,
    description: req.body.description,
  });
  await newAchievement.save();
  res.redirect("/faculty");
};

exports.getViewAchievements = async (req,res) => {
  const achievements = await Achievement.find({}).lean()
  const achievementCount = await Achievement.find({}).count()
  res.render('faculty/view-achievements', {
    title : "Achievements",
    faculty : req.session.faculty,
    achievements,
    achievementCount
  })
}

exports.getViewEvents = async (req,res) => {
  const event = await Event.find({}).lean()
  const eventCount = await Event.find().count();
  res.render('faculty/view-events', {
    title : "Events",
    faculty : req.session.faculty,
    event,
    eventCount
  })
}

exports.getAllAlumniPage = async (req, res) => {
  console.log(req.session)
  const allAlumni = await User.find({ isVerified: true , batch: req.session.faculty.department }).lean();
  const alumniCount = await User.find({ isVerified: true , batch: req.session.faculty.department }).count();
  res.render("faculty/all-alumni", {
    title: "All Alumni",
    alumni: allAlumni,
    faculty: req.session.faculty,
    alumniCount
  });
};

exports.getSingleAlumniDetails = async (req,res) => {
  const alumniId = req.params.id;
  const alumniDetails = await User.findOne({_id:alumniId}).lean()
  res.render('faculty/alumni-details', {
    title : alumniDetails.firstname,
    faculty : req.session.faculty,
    alumniDetails
  }) 
}

exports.getAlumniReport = async (req,res) => {
  const alumni = await User.find({isVerified:true, batch:req.session.faculty.department}).lean()
  const alumniCount = await User.find({isVerified:true, batch:req.session.faculty.department}).count()
  res.render('faculty/alumni-report', {
    title : "Alumni Report",
    faculty : req.session.faculty,
    alumni,
    alumniCount
  })
}

exports.deleteOneEvent = async (req,res) => {
  const eventId = req.params.id;
  await Event.findOneAndRemove({_id:eventId});
  res.redirect('/faculty/view-events')
}

exports.deleteOneAchievement = async (req,res) => {
  const achievementId = req.params.id;
  await Achievement.findOneAndRemove({_id:achievementId});
  res.redirect('/faculty/view-achievements');
}

exports.getEditEventPage = async (req,res) => {
  const eventId = req.params.id;
  const editEvent = await Event.findOne({_id:eventId}).lean();
  res.render('faculty/edit-event', {
    title:"Edit Event",
    faculty:req.session.faculty,
    editEvent
  })
}

exports.postEditEvent = async (req,res) => {
  try {
    const eventId = req.params.id;
    const myEvent = await Event.findOne({ _id: eventId });
    myEvent.date = req.body.date;
    myEvent.mainHeading = req.body.main;
    myEvent.subHeading = req.body.sub;
    myEvent.description = req.body.description;
    await myEvent.save();
    res.redirect("/faculty/view-events");
  } catch (error) {
    return res.render("errors/500", {
      title: "Internal Server Error",
    });
  }
}

exports.getEditAchievement = async (req,res) => {
  const achievementId = req.params.id;
  const editAchievement = await Achievement.findOne({_id:achievementId}).lean()
  res.render('faculty/edit-achievement', {
    title:"Edit Achievment",
    faculty : req.session.faculty,
    editAchievement
  })
}

exports.postEditAchievement = async (req,res) => {
  try {
    const achievementId = req.params.id;
    const myAchievement = await Achievement.findOne({_id:achievementId});
    myAchievement.name = req.body.name;
    myAchievement.batch = req.body.batch;
    myAchievement.startyear = req.body.startyear;
    myAchievement.endyear = req.body.endyear;
    myAchievement.description = req.body.description;
    await myAchievement.save();
    res.redirect("/faculty/view-achievements");
  } catch (error) {
    return res.render("errors/500", {
      title: "Internal Server Error",
    });
  }
}