const express = require("express");

const router = express.Router();

const {
    askQuestion
} = require("../controllers/queryController");


router.post(
    "/",
    askQuestion
);


module.exports = router;