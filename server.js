const express = require('express');
const dotenv = require('dotenv')
const path = require('path')
const cookieParser = require('cookie-parser')
const { engine } = require('express-handlebars')
const alumniRouter = require('./routes/alumniRoute')
const facultyRouter = require('./routes/facultyRoute')
const adminRouter = require('./routes/adminRoute')
// Environment Variable
dotenv.config()
const app = express();
// View Engine Setup
app.engine('hbs', engine({
    extname:'hbs',
    defaultLayout : 'main',
    layoutsDir : path.join(__dirname,'views','layouts'),
    partialsDir : path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
// Parse Incoming Data
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', alumniRouter)
app.use('/faculty', facultyRouter)
app.use('/admin', adminRouter)

// Catch 404
app.use((req,res,next) => {
    res.render('errors/404', {
        title : "Page Not Found"
    })
})

// Port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));