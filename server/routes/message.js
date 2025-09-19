const express = require('express');
const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/authCheck');
const messageCtrl = require('../controller/messageController');

router.post('/', authCheck, messageCtrl.create);
router.get('/', authCheck, adminCheck, messageCtrl.list);
router.delete('/:id', authCheck, adminCheck, messageCtrl.remove);

module.exports = router
