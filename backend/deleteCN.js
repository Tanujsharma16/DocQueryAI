require("dotenv").config();

const pinecone = require("./config/pinecone");

const index = pinecone.index(
    process.env.PINECONE_INDEX_NAME
);


async function deleteCN(){

    await index.deleteMany({
        filter:{
            filename:"CN.pdf"
        }
    });


    console.log("CN.pdf vectors deleted");
}


deleteCN();