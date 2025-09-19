const express = require("express");
const router = express.Router();
const { getDynamicCriteriaOptions } = require("../controller/criteriaController");

router.get("/options", getDynamicCriteriaOptions);

module.exports = router
