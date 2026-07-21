const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const chunkText = require("../utils/textChunker");
const Document = require("../models/Document");

const { generateEmbedding } = require("./embeddingService");
const { uploadVectors } = require("./pineconeService");


const processDocument = async(documentId)=>{

    try{

        const document = await Document.findById(
            documentId
        );


        if(!document){
            throw new Error("Document not found");
        }


        console.log(
            "Processing:",
            document.filename
        );


        const pdfBuffer = fs.readFileSync(
            document.filePath
        );


        const parser = new PDFParse({
            data:pdfBuffer
        });


        const pdfData = await parser.getText();


        console.log(
            "PDF extracted"
        );


        const pages = pdfData.pages;


        let chunks=[];


        pages.forEach(page=>{


            const pageChunks =
            chunkText(page.text);


            pageChunks.forEach(chunk=>{


                chunks.push({

                    ...chunk,

                    pageNumber:
                    page.pageNumber

                });


            });


        });



        console.log(
            "Chunks:",
            chunks.length
        );



        const vectors=[];


        for(
            let i=0;
            i<chunks.length;
            i++
        ){

            const vector =
            await generateEmbedding(
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

                    chunkIndex:i,

                    filename:
                    document.filename

                }

            });


            console.log(
                `Embedding ${i+1}/${chunks.length}`
            );

        }



        await uploadVectors(
            vectors
        );


        await Document.findByIdAndUpdate(

            documentId,

            {
                status:"completed",
                totalChunks:chunks.length
            }

        );


        console.log(
            "Processing completed"
        );


    }
    catch(error){

        console.log(
            "Processing Error:",
            error
        );


        await Document.findByIdAndUpdate(

            documentId,

            {
                status:"failed"
            }

        );


        throw error;

    }

};


module.exports = processDocument;