const express = require('express')
const alumniController = require('../controllers/alumniController')
const router = express.Router()

router.get('/', alumniController.getHomePage)
router.get('/signup', alumniController.getSignupPage)
router.post('/signup', alumniController.postSignupPage)
router.get('/login', alumniController.getLoginPage)
router.post('/login', alumniController.postLoginPage)
router.get('/feedback', alumniController.getFeedbackPage)
router.post('/feedback', alumniController.postFeedbackPage)

module.exports = router