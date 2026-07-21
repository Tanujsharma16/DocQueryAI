const express = require("express");

const router = express.Router();


const {
    uploadDocument,
    getDocuments,
    deleteDocument
} = require("../controllers/documentController");



router.post(
    "/upload",
    uploadDocument
);


router.get(
    "/",
    getDocuments
);



router.delete(
    "/:id",
    deleteDocument
);



module.exports = router;