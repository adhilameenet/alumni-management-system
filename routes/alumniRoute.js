const express = require('express')
const alumniController = require('../controllers/alumniController')
const router = express.Router()

router.get('/', alumniController.getHomePage)
router.get('/about', alumniController.getAboutPage)
router.get('/events', alumniController.getEventsPage)
router.get('/gallery', alumniController.getGalleryPage)
router.get('/signup', alumniController.getSignupPage)
router.post('/signup', alumniController.postSignupPage)
router.get('/login', alumniController.getLoginPage)
router.post('/login', alumniController.postLoginPage)
router.get('/feedback', alumniController.getFeedbackPage)
router.post('/feedback', alumniController.postFeedbackPage)
router.get('/profile', alumniController.getAlumniProfilePage)

module.exports = router