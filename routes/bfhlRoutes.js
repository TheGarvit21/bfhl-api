const express = require("express");
const router = express.Router();
const bfhlController = require("../controllers/bfhlController");

router.get("/health", bfhlController.getHealth);
router.post("/bfhl", bfhlController.processBfhl);

module.exports = router;
