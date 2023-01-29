module.exports = {
    verifyUserAuth : (req,res,next) => {
        if(req.session.userAuth) {
            next()
        } else {
            res.redirect('/alumni/login')
        }
    },
    verfyFacultyAuth : (req,res,next) => {
        if(req.session.facultyAuth) {
            next()
        } else {
            res.redirect('/faculty/login')
        }
    },
    verifyAdminAuth : (req,res,next) => {
        if(req.session.adminAuth) {
            next()
        } else {
            res.redirect('/admin/login')
        }
    }
}