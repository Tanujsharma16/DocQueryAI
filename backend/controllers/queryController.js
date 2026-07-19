const { generateEmbedding } = require("../services/embeddingService");
const { searchVectors } = require("../services/pineconeSearchService");

const { generateAnswer } = require("../services/geminiService");
const askQuestion = async(req,res)=>{

    try{

        const {question}=req.body;


        if(!question){
            return res.status(400).json({
                message:"Question required"
            });
        }


        // Question embedding
        const queryVector = await generateEmbedding(
            question
        );


        // Search Pinecone
        const results = await searchVectors(
            queryVector
        );


        const context = results.map(
    item => item.metadata.text
).join("\n\n");


const answer = await generateAnswer(
    question,
    context
);


return res.json({
    question,
    answer
});


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Query failed"
        });

    }

};


module.exports={
    askQuestion
};