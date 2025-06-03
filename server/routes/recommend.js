const express = require('express');
const router = express.Router();
const recommendController = require('../controller/recommendController');

router.post('/', recommendController.recommend);

module.exports = router;