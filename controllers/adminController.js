exports.getHomePage = (req,res) => {
    res.render('admin/home', {
        title:"Home",
        user : true
    })
}