require("dotenv").config();

const { deleteVectors } = require("./services/pineconeService");


const documentId = "6a5da6492b98e378ffd72524";


deleteVectors(documentId)
.then(()=>{
    console.log("Done");
    process.exit();
})
.catch(err=>{
    console.log(err);
    process.exit(1);
});