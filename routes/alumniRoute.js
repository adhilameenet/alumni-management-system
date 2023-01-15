const express = require('express')
const alumniController = require('../controllers/alumniController')
const router = express.Router()

router.get('/', alumniController.getHomePage)
router.get('/signup', alumniController.getSignupPage)
router.post('/signup', alumniController.postSignupPage)

module.exports = router