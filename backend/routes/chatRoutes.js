const express = require("express");

const router = express.Router();


const {
    getChats
} = require("../controllers/chatController");



router.get(
    "/:documentId",
    getChats
);



module.exports = router;