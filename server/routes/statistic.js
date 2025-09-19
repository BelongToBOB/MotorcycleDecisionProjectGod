const express = require('express');
const router = express.Router();
const { adminCheck, authCheck } = require('../middlewares/authCheck');
const statisticController = require('../controller/statisticController');

router.get('/', authCheck, adminCheck, statisticController.overview);

module.exports = router
