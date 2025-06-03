const express = require('express');
const router = express.Router();
const motoController = require('../controller/motorcycleController');
const { authCheck, adminCheck } = require('../middlewares/authCheck');

router.get('/', motoController.list);
router.get('/:id', motoController.get);

router.post('/', authCheck, adminCheck, motoController.create);
router.put('/:id', authCheck, adminCheck, motoController.update);
router.delete('/:id', authCheck, adminCheck, motoController.remove);

module.exports = router;

