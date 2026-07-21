const path = require("path");
const fs = require("fs");

const Document = require("../models/Document");

const processDocument = require("../services/documentProcessor");

const { deleteVectors } = require("../services/pineconeService");



const uploadDocument = async (req, res) => {

    try {


        if (!req.files || !req.files.pdf) {

            return res.status(400).json({

                success:false,

                message:"Please upload a PDF file"

            });

        }



        const pdf = req.files.pdf;



        if(pdf.mimetype !== "application/pdf"){

            return res.status(400).json({

                success:false,

                message:"Only PDF files are allowed"

            });

        }




        const existingDocument = await Document.findOne({

            filename: pdf.name

        });



        if(existingDocument){

            return res.status(400).json({

                success:false,

                message:"Document already exists"

            });

        }




        const uploadDir = path.join(

            __dirname,

            "../uploads"

        );



        if(!fs.existsSync(uploadDir)){

            fs.mkdirSync(uploadDir,{

                recursive:true

            });

        }




        const uploadPath = path.join(

            uploadDir,

            pdf.name

        );





        // Save PDF

        await pdf.mv(uploadPath);



        console.log(
            "PDF saved:",
            uploadPath
        );



        console.log(
            "File exists:",
            fs.existsSync(uploadPath)
        );





        // Create document record

        const document = await Document.create({

            filename: pdf.name,

            filePath: uploadPath,

            status:"uploaded",

            totalPages:0,

            totalChunks:0

        });




        console.log(

            "Document saved:",

            document._id

        );






        // Start processing

        processDocument(

            document._id

        )
        .catch(error=>{


            console.log(

                "Document processing failed:",

                error.message

            );


        });






        return res.status(200).json({

            success:true,

            message:"PDF uploaded successfully. Processing started.",

            documentId:document._id,

            fileName:pdf.name,

            status:"uploaded"

        });




    }
    catch(error){


        console.log(

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




        // Delete Pinecone vectors

        await deleteVectors(id);





        // Delete file

        if(fs.existsSync(document.filePath)){


            fs.unlinkSync(

                document.filePath

            );


        }





        // Delete MongoDB record

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





module.exports = {

    uploadDocument,

    getDocuments,

    deleteDocument

};