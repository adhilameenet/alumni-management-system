exports.getHomePage = (req,res) => {
    res.render('home', {
        title:"Home"
    })
}
exports.getSignupPage = (req,res) => {
    res.render('alumni/signup' , {
        title:"Signup",
        user: true
    })
}
exports.postSignupPage = (req,res) => {
    console.log(req.body)
}