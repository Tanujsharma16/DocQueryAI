const express = require("express");

const router = express.Router();


const {
    uploadDocument,
    getDocuments
} = require("../controllers/documentController");



router.post(
    "/upload",
    uploadDocument
);


router.get(
    "/",
    getDocuments
);



module.exports = router;