const pinecone = require("../config/pinecone");


const index = pinecone.index(
    process.env.PINECONE_INDEX_NAME
);



const searchVectors = async(queryVector, documentId)=>{


    const results = await index.query({

        vector: queryVector,

        topK: 5,

        includeMetadata: true,

        filter:{
            documentId: documentId
        }

    });


    return results.matches;

};



module.exports = {
    searchVectors
};