require("dotenv").config();

console.log("🔥 DOCUMENT WORKER STARTED");

const { Worker } = require("bullmq");
const fs = require("fs");

const redisConnection = require("../config/redis");
const connectDB = require("../config/db");

const Document = require("../models/Document");

const { PDFParse } = require("pdf-parse");

const chunkText = require("../utils/textChunker");

const { generateEmbedding } = require("../services/embeddingService");
const { uploadVectors } = require("../services/pineconeService");


// Connect MongoDB
connectDB();


const worker = new Worker(

    "document-processing",

    async(job)=>{

        console.log(
            "Processing job:",
            job.id
        );


        const { documentId } = job.data;


        const document = await Document.findById(
            documentId
        );


        if(!document){

            throw new Error(
                "Document not found"
            );

        }


        console.log(
            "Processing file:",
            document.filename
        );



        // Read PDF

        const pdfBuffer = fs.readFileSync(
            document.filePath
        );


        console.log(
            "Reading PDF:",
            document.filePath
        );


        console.log(
            "File exists:",
            fs.existsSync(document.filePath)
        );



        // Extract text

        const parser = new PDFParse({
            data: pdfBuffer
        });


        const pdfData = await parser.getText();



        const chunks = chunkText(
            pdfData.text
        );


        console.log(
            "Total chunks:",
            chunks.length
        );



        const vectors = [];



        // Sequential embedding

        for(let i = 0; i < chunks.length; i++){


            const vector = await generateEmbedding(
                chunks[i].content
            );


            vectors.push({

                id:`${documentId}_chunk_${i}`,

                values:vector,


                metadata:{

                    documentId:
                    documentId.toString(),

                    text:
                    chunks[i].content,

                    chunkIndex:i,

                    filename:
                    document.filename

                }

            });


            console.log(
                `Embedding ${i+1}/${chunks.length}`
            );


        }



        console.log(
            "Uploading vectors to Pinecone..."
        );


        await uploadVectors(
            vectors
        );



        console.log(
            "Vectors uploaded successfully"
        );



        await Document.findByIdAndUpdate(

            documentId,

            {
                status:"completed",
                totalChunks:chunks.length
            }

        );



        console.log(
            "Document processing completed"
        );



    },


    {
        connection:redisConnection
    }

);





worker.on(
    "completed",
    (job)=>{

        console.log(
            `Job ${job.id} completed`
        );

    }
);



worker.on(
    "failed",
    (job,error)=>{

        console.log(
            `Job ${job.id} failed`,
            error.message
        );

    }
);