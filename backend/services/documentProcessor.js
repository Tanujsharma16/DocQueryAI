const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const chunkText = require("../utils/textChunker");
const Document = require("../models/Document");

const { generateEmbedding } = require("./embeddingService");
const { uploadVectors } = require("./pineconeService");


const BATCH_SIZE = 20;


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



        const pages = pdfData.pages;



        let chunks=[];



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



        const vectors=[];



        for(
            let start=0;
            start<chunks.length;
            start+=BATCH_SIZE
        ){


            const batch = chunks.slice(
                start,
                start+BATCH_SIZE
            );



            console.log(
                `Processing batch ${start}-${start+batch.length}`
            );



            const embeddings = await Promise.all(

                batch.map(chunk=>

                    generateEmbedding(
                        chunk.content
                    )

                )

            );



            embeddings.forEach(
                (vector,index)=>{


                    const chunkIndex =
                    start+index;



                    vectors.push({

                        id:
                        `${documentId}_chunk_${chunkIndex}`,


                        values:
                        vector,


                        metadata:{

                            documentId:
                            documentId.toString(),

                            text:
                            batch[index].content,

                            chunkIndex,

                            pageNumber:
                            batch[index].pageNumber,

                            filename:
                            document.filename

                        }

                    });


                }

            );


            console.log(
                `Completed ${Math.min(start+BATCH_SIZE,chunks.length)}/${chunks.length}`
            );


        }



        console.log(
            "Uploading vectors..."
        );



        await uploadVectors(
            vectors
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


    }

};



module.exports = processDocument;