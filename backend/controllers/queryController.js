const { generateEmbedding } = require("../services/embeddingService");
const { searchVectors } = require("../services/pineconeSearchService");
const { generateAnswer } = require("../services/geminiService");

const Chat = require("../models/Chat");


const askQuestion = async(req,res)=>{

    try{

        const { question, documentId } = req.body;


        if(!question){

            return res.status(400).json({
                message:"Question required"
            });

        }


        if(!documentId){

            return res.status(400).json({
                message:"Please select a document"
            });

        }



        // Generate question embedding
        const queryVector = await generateEmbedding(
            question
        );



        // Search only selected document vectors
        const results = await searchVectors(
            queryVector,
            documentId
        );



        const context = results.map(
            item => item.metadata.text
        ).join("\n\n");



        const sources = results.map(item => ({

            filename: item.metadata.filename,

            chunkIndex: item.metadata.chunkIndex

        }));



        // Generate answer
        const answer = await generateAnswer(
            question,
            context
        );



        // Save chat history
        await Chat.create({

            documentId,

            question,

            answer

        });




        return res.json({

            question,

            answer,

            sources

        });


    }
    catch(error){

        console.log(
            "QUERY ERROR:",
            error
        );


        return res.status(500).json({

            message:"Query failed"

        });

    }

};



module.exports = {

    askQuestion

};