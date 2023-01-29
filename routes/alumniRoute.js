const express = require('express')
const { verifyUserAuth } = require('../middlewares/auth')
const alumniController = require('../controllers/alumniController')
const router = express.Router()

router.get('/', verifyUserAuth,alumniController.getHomePage)
router.get('/signup', alumniController.getSignupPage)
router.post('/signup', alumniController.postSignupPage)
router.get('/login', alumniController.getLoginPage)
router.post('/login', alumniController.postLoginPage)
router.get('/logout', verifyUserAuth,alumniController.alumniLogout)
router.get('/events', verifyUserAuth ,alumniController.getEventsPage)
router.get('/feedback', verifyUserAuth ,alumniController.getFeedbackPage)
router.post('/feedback', verifyUserAuth ,alumniController.postFeedbackPage)

module.exports = router