const { v4 } = require("uuid");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Faculty = require("../models/Faculty");
const Settings = require('../models/Settings')
const Department = require("../models/Department");
const Donation = require('../models/Donation')
const User = require("../models/User");

exports.getHomePage = async (req, res) => {
  const noOfVerifiedFaculty = await Faculty.find({ isVerified: true }).count();
  const noOfUnverifiedFaculty = await Faculty.find({isVerified: false}).count();
  const noOfVerifiedAlumni = await User.find({isVerified:true}).count();
  const noOfDepartments = await Department.find({}).count();
  res.render("admin/home", {
    title: "Home",
    admin: req.session.admin,
    noOfVerifiedFaculty,
    noOfUnverifiedFaculty,
    noOfVerifiedAlumni,
    noOfDepartments,
  });
};
exports.getLoginPage = (req, res) => {
  res.render("admin/login", {
    error: req.flash("error"),
    title: "Login",
  });
};
exports.postLoginPage = (req, res) => {
  const { email, password } = req.body;
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";
  if (email == adminEmail && password == adminPassword) {
    req.session.admin = adminEmail;
    req.session.adminAuth = true;
    res.redirect("/admin");
  } else {
    req.flash("error", "Invalid Email or Password");
    res.redirect("/admin/login");
  }
};

exports.getDepartmentsPage = async (req, res) => {
  const allDepartments = await Department.find({}).lean();
  res.render("admin/departments", {
    admin: req.session.admin,
    title: "Departments",
    department: allDepartments,
  });
};
exports.postAddDepartment = async (req, res) => {
  const { department } = req.body;
  const newDepartment = new Department({
    name: department,
  });
  await newDepartment.save();
  res.redirect("/admin/departments");
};

exports.getVerifyFacultyPage = async (req, res) => {
  const pendingFaculty = await Faculty.find({ isVerified: false }).lean();
  res.render("admin/verify-faculty", {
    admin: req.session.admin,
    title: "Faculty Verification",
    faculty: pendingFaculty,
  });
};

exports.postVerifyFacultyPage = async (req, res) => {
  try {
    const facultyId = req.params.id;
    await Faculty.findByIdAndUpdate(facultyId, { isVerified: true });
    res.redirect("/admin/faculty-verification");
  } catch (error) {
    res.render("errors/500", {
      title: "Internal Server Error",
    });
  }
};

exports.getAllFaculty = async (req, res) => {
  const faculties = await Faculty.find({ isVerified: true }).lean();
  const facultyCount = await Faculty.find({ isVerified: true }).count();
  res.render("admin/all-faculty", {
    title: "All Faculty",
    faculty: faculties,
    admin: req.session.admin,
    facultyCount
  });
};

exports.getAllAlumni = async (req,res) => {
  const alumni = await User.find({ isVerified:true }).lean();
  const alumniCount = await User.find({ isVerified:true }).count()
  res.render('admin/all-alumni', {
    title : "All Alumni",
    alumni,
    alumniCount,
    admin : req.session.admin
  })
}

exports.deleteAllDepartment = async (req, res) => {
  await Department.deleteMany({});
  res.redirect("/admin/departments");
};

exports.getSettings = async (req,res) => {
  const settings = await Settings.findOne({}).lean()
  res.render('admin/settings', {
    title : "Settings",
    admin : req.session.admin,
    settings
  })
}

exports.postSettings = async (req,res) => {
  console.log(req.body)
  if(req.body.add) {
    try {
      const mySettings = new Settings({
        name : req.body.name,
        facebook : req.body.facebook,
        instagram : req.body.instagram,
        twitter : req.body.twitter,
        description : req.body.description
      });
      await mySettings.save()
      res.redirect('/admin/settings')
    } catch (error) {
      console.log(error)
      res.render('errors/500', {
        title : "Internal Server Error"
      })
    } 
  } else {
    try {
      let updateSettings = await Settings.findOne({})
      updateSettings.name = req.body.name;
      updateSettings.description = req.body.description;
      updateSettings.facebook = req.body.facebook;
      updateSettings.instagram = req.body.instagram;
      updateSettings.twitter = req.body.twitter;
      await updateSettings.save();
      res.redirect('/admin/settings')
    } catch (error) {
      console.log(error)
      res.render('errors/500', {
        title : "Internal Server Error"
      })
    } 
  }
}

exports.getLogout = (req, res) => {
  req.session.admin = null;
  req.session.adminAuth = false;
  res.redirect("/admin/login");
};


exports.getRecentPayments = async (req,res) => {
  try {
    const payments = await stripe.charges.list({
      limit: 30,
      status: 'succeeded',
    });
    const data = payments.data
    res.render('admin/donations', {
      title : "Recent Payments",
      data,
      admin : req.session.admin
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
}

exports.getAddDonationsPage = (req, res) => {
  res.render("admin/add-donations", {
    title: "Add Donations",
    admin: req.session.admin,
  });
};



exports.postAddDonationsPage = async (req, res) => {
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

  const newDonation = new Donation({
    imageUrl: uploadUrl,
    title: req.body.main,
    description: req.body.description,
    donationLink : req.body.donationLink
  });
  await newDonation.save();
  res.redirect("/admin");
};

exports.getViewDonations = async (req,res) => {
  const donations = await Donation.find({}).lean();
  const donationCount = await Donation.find({}).count();
  res.render('admin/view-donations', {
    title : "Donations",
    admin : req.session.admin,
    donations,
    donationCount 
  })
}

exports.deleteOneDonation = async (req,res) => {
  const donationId = req.params.id;
  await Donation.findByIdAndRemove({_id:donationId});
  res.redirect('/admin/view-donations')
}

exports.getBloodDonors = async (req,res) => {
  const donors =  await User.find({isDonor:true, isVerified:true}).lean();
  const donorsCount =  await User.find({isDonor:true, isVerified:true}).count()
  res.render('admin/blood-donor', {
    title:"Blood Donors",
    donors,
    donorsCount,
    admin : req.session.admin
  })
}

exports.getEditDonationPage = async (req,res) => {
  const donationId = req.params.id;
  const donation = await Donation.findOne({_id:donationId}).lean()
  res.render('admin/edit-donation', {
    title : "Edit Donation",
    faculty : req.session.admin,
    donation
  })
}
exports.postEditDonationPage = async (req,res) => {
  try {
    const donationId = req.params.id;
    const myDonation = await Donation.findOne({ _id:donationId });
    myDonation.title = req.body.main;
    myDonation.description = req.body.description;
    myDonation.donationLink = req.body.donationLink;
    await myDonation.save();
    res.redirect("/admin/view-donations");
  } catch (error) {
    return res.render("errors/500", {
      title: "Internal Server Error",
    });
  }
}

exports.getSingleAlumniDetails = async (req,res) => {
  const alumniId = req.params.id;
  const alumniDetails = await User.findOne({_id:alumniId}).lean()
  res.render('admin/alumni-details', {
    title : alumniDetails.firstname,
    admin : req.session.admin,
    alumniDetails
  }) 
}