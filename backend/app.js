const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const queryRoutes = require("./routes/queryRoutes");
const documentRoutes = require("./routes/documentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    "/api/query",
    queryRoutes
);
app.use(
    fileUpload({
        limits: { fileSize: 20 * 1024 * 1024 },
    })
);

app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
    res.send("DocQuery AI API is running");
});

module.exports = app;