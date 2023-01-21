const express = require('express')
const facultyController = require('../controllers/facultyController')
const router = express.Router()

router.get('/', facultyController.getHomePage)
router.get('/verify-alumni', facultyController.getVerifyAlumniPage)
router.get('/all-feedback', facultyController.getAllFeedbackPage)

module.exports = router  