const express = require('express');
const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/authCheck');
const messageCtrl = require('../controller/messageController');

// User ส่ง message (ต้อง login)
router.post('/', authCheck, messageCtrl.create);

// Admin ดู message
router.get('/', authCheck, adminCheck, messageCtrl.list);

// Admin ลบ message
router.delete('/:id', authCheck, adminCheck, messageCtrl.remove);

module.exports = router;
