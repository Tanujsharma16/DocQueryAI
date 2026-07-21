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
                success:false,
                message:"Please upload a PDF file"
            });
        }


        const pdf = req.files.pdf;


        // Check PDF type
        if(pdf.mimetype !== "application/pdf"){
            return res.status(400).json({
                success:false,
                message:"Only PDF files are allowed"
            });
        }



        // Check duplicate document
        const existingDocument = await Document.findOne({
            filename: pdf.name
        });


        if(existingDocument){

            return res.status(400).json({
                success:false,
                message:"Document already exists"
            });

        }



        // Create uploads directory if not exists
        const uploadDir = path.join(
            __dirname,
            "../uploads"
        );


        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir,{
                recursive:true
            });
        }



        // Complete file path
       const uploadPath = path.resolve(
    uploadDir,
    pdf.name
);



        // Save file first
        await pdf.mv(uploadPath);



        console.log("PDF saved at:", uploadPath);

        console.log(
            "File exists:",
            fs.existsSync(uploadPath)
        );



        // Read file from disk
        const buffer = fs.readFileSync(uploadPath);



        // Extract PDF text
        const parser = new PDFParse({
            data:buffer
        });



        const pdfData = await parser.getText();



        const chunks = chunkText(
            pdfData.text
        );



        // Save document details
        const document = await Document.create({

            filename:pdf.name,

            filePath:uploadPath,

            status:"uploaded",

            totalPages:pdfData.total,

            totalChunks:chunks.length

        });



        console.log(
            "Document saved:",
            document._id
        );



        // Add job to queue
      await documentQueue.add(
    "process-document",
    {
        documentId:document._id
    }
);


        console.log(
            "Job added to Redis queue"
        );



        return res.status(200).json({

            success:true,

            message:"PDF uploaded successfully",

            documentId:document._id,

            fileName:pdf.name,

            totalPages:pdfData.total,

            textLength:pdfData.text.length,

            chunks:chunks.length,

            textPreview:
            pdfData.text.substring(0,500)

        });



    }
    catch(error){

        console.error(
            "Upload Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:"Failed to upload PDF",

            error:error.message

        });

    }

};




const getDocuments = async(req,res)=>{

    try{

        const documents = await Document.find()
        .select(
            "filename status totalPages totalChunks createdAt"
        );


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


        const {id}=req.params;



        const document = await Document.findById(id);



        if(!document){

            return res.status(404).json({
                message:"Document not found"
            });

        }



        // Delete vectors
        await deleteVectors(id);



        // Delete file
        if(fs.existsSync(document.filePath)){

            fs.unlinkSync(document.filePath);

        }



        // Delete DB record
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



module.exports={
    uploadDocument,
    getDocuments,
    deleteDocument
};