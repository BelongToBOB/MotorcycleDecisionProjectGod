const express = require('express');
const router = express.Router();
const { adminCheck, authCheck } = require('../middlewares/authCheck');
const statisticController = require('../controller/statisticController');

// Only admin can view
router.get('/', authCheck, adminCheck, statisticController.overview);

module.exports = router;
