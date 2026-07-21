require("dotenv").config();

const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const { Worker } = require("bullmq");

const redisConnection = require("../config/redis");
const connectDB = require("../config/db");

const Document = require("../models/Document");

const { PDFParse } = require("pdf-parse");
const fs = require("fs");
const path = require("path");

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



            // Get document from MongoDB
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



            /*
                Create correct absolute path
            */

            const filePath = path.resolve(
                __dirname,
                "../uploads",
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



            // Extract text
            const parser = new PDFParse({

                data: pdfBuffer

            });



            const pdfData = await parser.getText();



            const pages = pdfData.pages;



            console.log(
                "Total Pages:",
                pages.length
            );



            // Create chunks

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
                "Total chunks created:",
                chunks.length
            );




            const vectors = [];



            for(
                let i = 0;
                i < chunks.length;
                i++
            ){


                const vector = await generateEmbedding(
                    chunks[i].content
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


                        filename:
                        document.filename,


                        pageNumber:
                        chunks[i].pageNumber

                    }

                });



                console.log(
                    `Embedded chunk ${i+1}/${chunks.length}`
                );


            }



            await uploadVectors(
                vectors
            );



            console.log(
                "All vectors uploaded to Pinecone"
            );



            // Update status

            await Document.findByIdAndUpdate(

                documentId,

                {

                    status:"completed",

                    totalChunks:
                    chunks.length

                }

            );



            console.log(
                "Document processing completed"
            );


        }
        catch(error){

            console.error(
                "Worker Error:",
                error
            );


            throw error;

        }


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