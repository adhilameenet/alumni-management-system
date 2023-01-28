const Department = require('../models/Department')

exports.getHomePage = (req,res) => {
    res.render('admin/home', {
        title:"Home",
        admin : true
    })
}
exports.getLoginPage = (req,res) => {
    res.render('admin/login', {
        title : "Login"
    })
}
exports.postLoginPage = (req,res) => {
    res.redirect('/admin')
}


exports.getDepartmentsPage = async (req,res) => {
    const allDepartments = await Department.find({}).lean()
    res.render("admin/departments", {
        title : "Departments",
        department : allDepartments,
        admin : true
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
exports.deleteAllDepartment =  async (req,res) => {
    await Department.deleteMany({})
    res.redirect('/admin/departments')
}