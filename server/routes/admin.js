const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const { authCheck, adminOnly } = require('../middlewares/authCheck')

router.get('/admin', authCheck, adminOnly, adminController.getAllAdmins)
router.get('/admin/:id', authCheck, adminOnly, adminController.getAdminById)
router.put('/admin/:id', authCheck, adminOnly, adminController.updateAdmin)
router.delete('/admin/:id', authCheck, adminOnly, adminController.deleteAdmin)

module.exports = router

