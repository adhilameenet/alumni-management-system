const express = require('express')
const facultyController = require('../controllers/facultyController')
const { verfyFacultyAuth } = require('../middlewares/auth')
const router = express.Router()

router.get('/',verfyFacultyAuth, facultyController.getHomePage)
router.get('/signup', facultyController.getSignupPage)
router.post('/signup', facultyController.postSignupPage)
router.get('/login', facultyController.getLoginPage)
router.post('/login', facultyController.postLoginPage)
router.get('/verify-alumni',verfyFacultyAuth, facultyController.getVerifyAlumniPage)
router.get('/add-events',verfyFacultyAuth, facultyController.getAddEventPage)
router.post('/add-events',verfyFacultyAuth, facultyController.postAddEventPage)
router.get('/feedbacks',verfyFacultyAuth, facultyController.getAllFeedbackPage)
router.get('/logout',verfyFacultyAuth, facultyController.getLogout)

module.exports = router  