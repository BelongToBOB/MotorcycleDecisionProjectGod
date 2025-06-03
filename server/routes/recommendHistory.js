const express = require('express');
const router = express.Router();
const historyCtrl = require('../controller/recommendHistoryController');
const { authCheck } = require('../middlewares/authCheck'); 

router.post('/', authCheck, historyCtrl.create);
router.get('/mine', authCheck, historyCtrl.listMine);
router.get('/', authCheck, historyCtrl.listAll); 

module.exports = router;
