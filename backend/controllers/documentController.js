const { PDFParse } = require("pdf-parse");
const path = require("path");
const chunkText = require("../utils/textChunker");
const documentQueue = require("../queues/documentQueue");
const Document = require("../models/Document");
const fs = require("fs");
const { deleteVectors } = require("../services/pineconeService");
const uploadDocument = async (req, res) => {
    try {
        // Check file exists
        if (!req.files || !req.files.pdf) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF file"
            });
        }

        const pdf = req.files.pdf;
        const existingDocument = await Document.findOne({
    filename: pdf.name
});


if(existingDocument){

    return res.status(400).json({
        message:"Document already exists"
    });

}
        const uploadPath = path.join(
    __dirname,
    "../uploads",
    pdf.name
);

await pdf.mv(uploadPath);
        // Check PDF type
        if (pdf.mimetype !== "application/pdf") {
            return res.status(400).json({
                success: false,
                message: "Only PDF files are allowed"
            });
        }

        console.log("PDF received:", pdf.name);
        console.log("PDF size:", pdf.size);


        // PDF text extraction
        const parser = new PDFParse({
            data: pdf.data
        });

        const pdfData = await parser.getText();
        const chunks = chunkText(pdfData.text);
        const document = await Document.create({
    filename: pdf.name,
    filePath: uploadPath,
    status: "uploaded",
    totalPages: pdfData.total,
    totalChunks: chunks.length
});

       console.log("Document saved:", document._id);
       await documentQueue.add("process-document", {
    documentId: document._id,
    fileName: pdf.name
});

console.log("Job added to Redis queue");
        console.log("Total chunks:", chunks.length);

        console.log("Total pages:", pdfData.total);
        console.log("Extracted characters:", pdfData.text.length);


    return res.status(200).json({
    success: true,
    message: "PDF parsed successfully",
    documentId: document._id,
    fileName: pdf.name,
    totalPages: pdfData.total,
    textLength: pdfData.text.length,
    chunks: chunks.length,
    textPreview: pdfData.text.substring(0,500)
});


    } catch (error) {

        console.error("PDF Parsing Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to parse PDF",
            error: error.message
        });
    }
};

const getDocuments = async(req,res)=>{

    try{

        const documents = await Document.find()
.select("filename status totalPages totalChunks createdAt");

        res.json(documents);

    }
    catch(error){

        res.status(500).json({
            message:"Failed to fetch documents"
        });

    }

};
const deleteDocument = async(req,res)=>{

    try{

        const { id } = req.params;


        const document = await Document.findById(id);


        if(!document){

            return res.status(404).json({
                message:"Document not found"
            });

        }



        // Delete vectors from Pinecone
        await deleteVectors(
            id
        );



        // Delete PDF file from uploads folder
        if(fs.existsSync(document.filePath)){

            fs.unlinkSync(document.filePath);

        }



        // Delete document from MongoDB
        await Document.findByIdAndDelete(id);



        res.json({

            message:"Document deleted successfully"

        });


    }
    catch(error){

        console.log(
            "Delete error:",
            error
        );


        res.status(500).json({

            message:"Failed to delete document"

        });

    }

};
module.exports = { uploadDocument,getDocuments ,deleteDocument};