const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

router.get('/', adminController.getHomePage)
router.get('/login', adminController.getLoginPage)
router.post('/login', adminController.postLoginPage)
router.get('/departments', adminController.getDepartmentsPage)
router.post('/departments', adminController.postAddDepartment)
router.post('/departments/delete-all', adminController.deleteAllDepartment)


module.exports = router