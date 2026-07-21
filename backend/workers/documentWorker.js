require("dotenv").config();

console.log("🔥 DOCUMENT WORKER STARTED");

const { Worker } = require("bullmq");
const fs = require("fs");
const path = require("path");

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

        try{

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



            const uploadDir = path.resolve(
                __dirname,
                "../uploads"
            );


            console.log(
                "Worker upload directory:",
                uploadDir
            );


            console.log(
                "Files inside uploads:",
                fs.existsSync(uploadDir)
                ? fs.readdirSync(uploadDir)
                : "Folder not found"
            );



            const filePath = path.resolve(
                uploadDir,
                document.filename
            );



            console.log(
                "Reading PDF:",
                filePath
            );


            console.log(
                "File exists:",
                fs.existsSync(filePath)
            );



            if(!fs.existsSync(filePath)){

                throw new Error(
                    "PDF file not found: " + filePath
                );

            }



            // Read PDF

            const pdfBuffer = fs.readFileSync(
                filePath
            );


            console.log(
                "Starting PDF text extraction..."
            );


            const parser = new PDFParse({

                data: pdfBuffer

            });


            const pdfData = await parser.getText();


            console.log(
                "✅ PDF TEXT EXTRACTION COMPLETED"
            );



            const pages = pdfData.pages;


            console.log(
                "Total Pages:",
                pages.length
            );



            let chunks = [];



            pages.forEach(page=>{


                const pageChunks = chunkText(
                    page.text
                );


                pageChunks.forEach(chunk=>{


                    chunks.push({

                        ...chunk,

                        pageNumber:
                        page.pageNumber

                    });


                });


            });



            console.log(
                "Total chunks:",
                chunks.length
            );


            console.log(
                "✅ CHUNK CREATION COMPLETED"
            );



            const vectors = [];



            console.log(
                "🚀 STARTING EMBEDDING GENERATION"
            );



            for(
                let i = 0;
                i < chunks.length;
                i++
            ){


                console.log(
                    `Generating embedding ${i+1}/${chunks.length}`
                );


                const vector =
                await generateEmbedding(
                    chunks[i].content
                );


                console.log(
                    `Embedding completed ${i+1}/${chunks.length}`
                );



                vectors.push({

                    id:
                    `${documentId}_chunk_${i}`,


                    values:
                    vector,


                    metadata:{

                        documentId:
                        documentId.toString(),


                        text:
                        chunks[i].content,


                        chunkIndex:
                        i,


                        pageNumber:
                        chunks[i].pageNumber,


                        filename:
                        document.filename

                    }

                });


            }



            console.log(
                "Uploading vectors to Pinecone..."
            );



            await uploadVectors(
                vectors
            );



            console.log(
                "✅ ALL VECTORS UPLOADED"
            );



            await Document.findByIdAndUpdate(

                documentId,

                {

                    status:"completed",

                    totalChunks:
                    chunks.length

                }

            );



            console.log(
                "🎉 DOCUMENT PROCESSING COMPLETED"
            );


        }
        catch(error){


            console.error(
                "❌ WORKER ERROR:",
                error
            );


            throw error;

        }


    },


    {
        connection: redisConnection
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