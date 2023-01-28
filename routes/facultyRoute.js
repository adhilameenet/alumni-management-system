const express = require('express')
const facultyController = require('../controllers/facultyController')
const router = express.Router()

router.get('/', facultyController.getHomePage)
router.get('/signup', facultyController.getSignupPage)
router.get('/login', facultyController.getLoginPage)
router.get('/verify-alumni', facultyController.getVerifyAlumniPage)
router.get('/add-events', facultyController.getAddEventPage)
router.post('/add-events', facultyController.postAddEventPage)
router.get('/all-feedback', facultyController.getAllFeedbackPage)

module.exports = router  