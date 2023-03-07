const express = require('express')
const adminController = require('../controllers/adminController')
const { verifyAdminAuth } = require('../middlewares/auth')
const router = express.Router()

router.get('/', verifyAdminAuth ,adminController.getHomePage)
router.get('/login', adminController.getLoginPage)
router.post('/login', adminController.postLoginPage)
router.get('/departments', verifyAdminAuth , adminController.getDepartmentsPage)
router.post('/departments', verifyAdminAuth , adminController.postAddDepartment)
router.get('/faculty-verification',verifyAdminAuth, adminController.getVerifyFacultyPage)
router.post('/faculty-verification/:id', verifyAdminAuth, adminController.postVerifyFacultyPage)
router.delete('/departments/delete-all', verifyAdminAuth , adminController.deleteAllDepartment)
router.get('/logout', verifyAdminAuth , adminController.getLogout)

module.exports = router
