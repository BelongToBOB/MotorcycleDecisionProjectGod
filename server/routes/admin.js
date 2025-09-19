const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { authCheck, adminOnly } = require('../middlewares/authCheck');

router.get('/', authCheck, adminOnly, adminController.getAllAdmins);
router.get('/:id', authCheck, adminOnly, adminController.getAdminById);
router.put('/:id', authCheck, adminOnly, adminController.updateAdmin);
router.delete('/:id', authCheck, adminOnly, adminController.deleteAdmin);

module.exports = router
