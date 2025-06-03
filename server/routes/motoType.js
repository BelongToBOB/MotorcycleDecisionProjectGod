const express = require('express');
const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/authCheck');
const motoTypeController = require('../controller/motoTypeController');


router.get('/', motoTypeController.list); // admin หรือ user ดูก็ได้
router.get('/:id', authCheck, motoTypeController.get);
router.post('/', authCheck, adminCheck, motoTypeController.create);
router.put('/:id', authCheck, adminCheck, motoTypeController.update);
router.delete('/:id', authCheck, adminCheck, motoTypeController.remove);

module.exports = router;
