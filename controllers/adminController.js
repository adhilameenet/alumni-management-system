const Faculty = require("../models/Faculty");
const Department = require("../models/Department");

exports.getHomePage = async (req, res) => {
  const noOfVerifiedFaculty = await Faculty.find({ isVerified: true }).count();
  const noOfUnverifiedFaculty = await Faculty.find({
    isVerified: false,
  }).count();
  const noOfDepartments = await Department.find({}).count();
  res.render("admin/home", {
    title: "Home",
    success: req.flash("success"),
    admin: req.session.admin,
    noOfVerifiedFaculty,
    noOfUnverifiedFaculty,
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
    req.flash("success", "Login Success!");
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
  res.render("admin/all-faculty", {
    title: "All Faculty",
    faculty: faculties,
    admin: req.session.admin,
  });
};

exports.deleteAllDepartment = async (req, res) => {
  await Department.deleteMany({});
  res.redirect("/admin/departments");
};

exports.getLogout = (req, res) => {
  req.session.admin = null;
  req.session.adminAuth = false;
  res.redirect("/admin/login");
};
