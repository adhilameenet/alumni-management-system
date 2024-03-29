const express = require('express')
const facultyController = require('../controllers/facultyController')
const { verfyFacultyAuth } = require('../middlewares/auth')
const router = express.Router()

router.get('/',verfyFacultyAuth, facultyController.getHomePage)
router.get('/signup', facultyController.getSignupPage)
router.post('/signup', facultyController.postSignupPage)
router.get('/login', facultyController.getLoginPage)
router.post('/login', facultyController.postLoginPage)
router.get('/all-alumni', verfyFacultyAuth , facultyController.getAllAlumniPage)
router.get('/all-alumni/:id', verfyFacultyAuth, facultyController.getSingleAlumniDetails)
router.get('/verify-alumni',verfyFacultyAuth, facultyController.getVerifyAlumniPage)
router.post('/verify-alumni/:id',verfyFacultyAuth, facultyController.postVerifyAlumni)
router.get('/add-events',verfyFacultyAuth, facultyController.getAddEventPage)
router.post('/add-events',verfyFacultyAuth, facultyController.postAddEventPage)
router.get('/view-events', verfyFacultyAuth, facultyController.getViewEvents)
router.post('/delete-event/:id', verfyFacultyAuth, facultyController.deleteOneEvent)
router.get('/edit-event/:id', verfyFacultyAuth, facultyController.getEditEventPage);
router.post('/edit-event/:id',verfyFacultyAuth, facultyController.postEditEvent)
router.get('/alumni-feedback',verfyFacultyAuth, facultyController.getAllFeedbackPage)
router.get('/add-achievements', verfyFacultyAuth, facultyController.getAddAchievementsPage)
router.post('/add-achievements', verfyFacultyAuth , facultyController.postAddAchievementPage)
router.get('/view-achievements', verfyFacultyAuth, facultyController.getViewAchievements)
router.get('/edit-achievement/:id', verfyFacultyAuth, facultyController.getEditAchievement);
router.post('/edit-achievement/:id', verfyFacultyAuth, facultyController.postEditAchievement);
router.post('/delete-achievement/:id', verfyFacultyAuth, facultyController.deleteOneAchievement)
router.get('/alumni-report',verfyFacultyAuth, facultyController.getAlumniReport)
router.get('/logout',verfyFacultyAuth, facultyController.getLogout)

module.exports = router  