const express = require('express');
const dotenv = require('dotenv')
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const flash = require('connect-flash')
const { engine } = require('express-handlebars')
const dbConnection = require('./config/dbConnection')
const alumniRouter = require('./routes/alumniRoute')
const facultyRouter = require('./routes/facultyRoute')
const adminRouter = require('./routes/adminRoute')
// Environment Variable
dotenv.config()

const app = express();

// Database Connection
dbConnection.dbConnect()

app.use(methodOverride('_method'))
app.use(morgan(':method :url :status'))

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : { maxAge : 1000 * 60 * 60 * 24 }
}))
app.use(cookieParser())
app.use(flash())
app.use(fileUpload())

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
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req,res) => {
    res.render('get-started', { title : "Get Started"})
})

// Routes
app.use('/alumni', alumniRouter)
app.use('/faculty', facultyRouter)
app.use('/admin', adminRouter)

// Catch 404
app.use((req,res,next) => {
    res.render('errors/404', { title : "Page Not Found"})
})
// Port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));