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
router.get('/all-faculty', verifyAdminAuth, adminController.getAllFaculty);
router.get('/all-alumni', verifyAdminAuth, adminController.getAllAlumni)
router.get('/all-alumni/:id', verifyAdminAuth, adminController.getSingleAlumniDetails)
router.delete('/departments/delete-all', verifyAdminAuth , adminController.deleteAllDepartment)
router.get('/settings', verifyAdminAuth, adminController.getSettings);
router.post('/settings', verifyAdminAuth, adminController.postSettings)
router.get('/add-donations', verifyAdminAuth , adminController.getAddDonationsPage)
router.post('/add-donations', verifyAdminAuth , adminController.postAddDonationsPage)
router.get('/view-donations',verifyAdminAuth, adminController.getViewDonations)
router.get('/view-donations/:id', verifyAdminAuth, adminController.getEditDonationPage)
router.post('/delete-donation/:id', verifyAdminAuth, adminController.deleteOneDonation)
router.get('/edit-donation/:id', verifyAdminAuth, adminController.getEditDonationPage)
router.post('/edit-donation/:id', verifyAdminAuth, adminController.postEditDonationPage)
router.get('/donation-reports', verifyAdminAuth, adminController.getRecentPayments)
router.get('/blood-donors', verifyAdminAuth, adminController.getBloodDonors)
// router.get('/generate-blood-donors-pdf', verifyAdminAuth, adminController.generateBloodDonorsPDF)
// router.get('/create-payment-link', verifyAdminAuth, adminController.getCreatePaymentLink);
// router.post('/create-payment-link', verifyAdminAuth, adminController.postCreatePaymentLink);
router.get('/logout', verifyAdminAuth , adminController.getLogout);

module.exports = router
