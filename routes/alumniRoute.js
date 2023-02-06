const express = require('express')
const { verifyUserAuth } = require('../middlewares/auth')
const alumniController = require('../controllers/alumniController')
const router = express.Router()

router.get('/', verifyUserAuth,alumniController.getHomePage)
router.post('/signup', alumniController.postSignupPage)
router.get('/signup', alumniController.getSignupPage)
router.post('/login', alumniController.postLoginPage)
router.get('/login', alumniController.getLoginPage)
router.get('/logout', verifyUserAuth,alumniController.alumniLogout)
router.get('/events', verifyUserAuth ,alumniController.getEventsPage)
router.get('/feedback', verifyUserAuth ,alumniController.getFeedbackPage)
router.post('/feedback', verifyUserAuth ,alumniController.postFeedbackPage)
router.get('/achievements',verifyUserAuth, alumniController.getAchievementsPage)
router.get('/profile', verifyUserAuth ,alumniController.getProfilePage)

module.exports = router