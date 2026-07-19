const pinecone = require("../config/pinecone");


const getIndex = () => {
    return pinecone.index(
        process.env.PINECONE_INDEX_NAME
    );
};


const uploadVectors = async (vectors) => {

    const index = getIndex();

    const batchSize = 50;


    for(let i = 0; i < vectors.length; i += batchSize){

        const batch = vectors.slice(
            i,
            i + batchSize
        );


        await index.upsert({
            records: batch
        });


        console.log(
            `Uploaded ${Math.min(i + batchSize, vectors.length)}/${vectors.length}`
        );
    }

};


module.exports = {
    uploadVectors
};