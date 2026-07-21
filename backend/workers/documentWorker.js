require("dotenv").config();
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const connectDB = require("../config/db");

const Document = require("../models/Document");

const { PDFParse } = require("pdf-parse");
const fs = require("fs");

const chunkText = require("../utils/textChunker");

const { generateEmbedding } = require("../services/embeddingService");
const { uploadVectors } = require("../services/pineconeService");


// Connect MongoDB for worker process
connectDB();

const extractPages = async(buffer)=>{

    const pdf = await pdfjsLib.getDocument({
        data: buffer
    }).promise;


    let pages = [];


    for(let i=1;i<=pdf.numPages;i++){

        const page = await pdf.getPage(i);

        const content = await page.getTextContent();


        const text = content.items
            .map(item=>item.str)
            .join(" ");


        pages.push({

            pageNumber:i,

            text:text

        });

    }


    return pages;

};
const worker = new Worker(
    "document-processing",

    async (job) => {

        console.log("Processing job:", job.id);


        const { documentId } = job.data;


        // Fetch document from MongoDB
        const document = await Document.findById(documentId);


        if (!document) {
            throw new Error("Document not found");
        }


        console.log(
            "Processing file:",
            document.filename
        );


        // Read PDF file
        const pdfBuffer = fs.readFileSync(
            document.filePath
        );


        // Extract PDF text
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

    const pageChunks = chunkText(page.text);


    pageChunks.forEach(chunk=>{

        chunks.push({

            ...chunk,

            pageNumber: page.pageNumber

        });

    });

});


        console.log(
            "Total chunks created:",
            chunks.length
        );


        

        const vectors = [];


for(let i = 0; i < chunks.length; i++){

    const vector = await generateEmbedding(
        chunks[i].content
    );


    vectors.push({

        id: `${documentId}_chunk_${i}`,

        values: vector,

metadata:{
    documentId: documentId.toString(),
    text: chunks[i].content,
    chunkIndex: i,
    filename: document.filename
}
    });


    console.log(
        `Embedded chunk ${i+1}/${chunks.length}`
    );
}



await uploadVectors(vectors);


console.log("All vectors uploaded to Pinecone");



        // Update document status
        await Document.findByIdAndUpdate(
            documentId,
            {
                status: "completed",
                totalChunks: chunks.length
            }
        );


        console.log(
            "Document processing completed"
        );

    },


    {
        connection: redisConnection
    }

);


// Worker events

worker.on(
    "completed",
    (job) => {
        console.log(
            `Job ${job.id} completed`
        );
    }
);


worker.on(
    "failed",
    (job, err) => {

        console.log(
            `Job ${job.id} failed`,
            err.message
        );

    }
);