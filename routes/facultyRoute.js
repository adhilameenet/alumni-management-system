const express = require('express')
const facultyController = require('../controllers/facultyController')
const router = express.Router()

router.get('/', facultyController.getHomePage)

module.exports = router 