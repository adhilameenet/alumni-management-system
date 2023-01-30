const Faculty = require('../models/Faculty')
const Department = require('../models/Department')

exports.getHomePage = (req,res) => {
    res.render('admin/home', {
        title:"Home",
        success : req.flash('success'),
        admin : true
    })
}
exports.getLoginPage = (req,res) => {
    res.render('admin/login', {
        error : req.flash('error'),
        title : "Login"
    })
}
exports.postLoginPage = (req,res) => {
    const { email,password } = req.body;
    const adminEmail = 'admin@gmail.com'
    const adminPassword = 'admin123'
    if(email == adminEmail && password == adminPassword) {
        req.session.admin = adminEmail;
        req.session.adminAuth = true;
        req.flash('success','Login Success!')
        res.redirect('/admin')
    } else {
        req.flash('error', 'Invalid Email or Password')
        res.redirect('/admin/login')
    }
}

exports.getDepartmentsPage = async (req,res) => {
    const allDepartments = await Department.find({}).lean()
    res.render("admin/departments", {
        admin : true,
        title : "Departments",
        department : allDepartments
    })
}
exports.postAddDepartment = async (req,res) => {
    const { department } = req.body;
    const newDepartment = new Department({
        name : department
    })
    await newDepartment.save()
    res.redirect('/admin/departments')
}

exports.getVerifyFacultyPage = async (req,res) => {
    const pendingFaculty = await Faculty.find({}).lean()
    res.render('admin/verify-faculty', {
        admin : true,
        title : "Faculty Verification",
        faculty : pendingFaculty
    })
}

exports.deleteAllDepartment =  async (req,res) => {
    await Department.deleteMany({})
    res.redirect('/admin/departments')
}

exports.getLogout = (req,res) => {
    req.session.admin = null;
    req.session.adminAuth = false;
    res.redirect('/admin/login')
}