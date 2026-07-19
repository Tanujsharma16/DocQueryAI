const pinecone = require("../config/pinecone");


const searchVectors = async (vector) => {

    const index = pinecone.index(
        process.env.PINECONE_INDEX_NAME
    );


    const result = await index.query({

        vector: vector,

        topK: 5,

        includeMetadata: true

    });


    return result.matches;

};


module.exports = {
    searchVectors
};