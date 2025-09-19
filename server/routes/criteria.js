const express = require("express");
const router = express.Router();
const { getDynamicCriteriaOptions } = require("../controller/criteriaController");

router.get("/criteria-options-dynamic", getDynamicCriteriaOptions);
module.exports = router;

