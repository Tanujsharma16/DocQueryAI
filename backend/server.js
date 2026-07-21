console.log("🔥 DOCUMENT WORKER STARTED");
require("dotenv").config();

require("./config/redis");
require("./worker/documentWorker");


const app = require("./app");
const connectDB = require("./config/db");


const PORT = process.env.PORT || 5000;


connectDB();


app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});