exports.getHomePage = (req,res) => {
    res.render('faculty/home', {
        title:"Home",
        user : true
    })
}