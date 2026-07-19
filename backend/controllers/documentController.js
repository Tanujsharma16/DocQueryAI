const { PDFParse } = require("pdf-parse");
const path = require("path");
const chunkText = require("../utils/textChunker");
const documentQueue = require("../queues/documentQueue");
const Document = require("../models/Document");
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


module.exports = { uploadDocument };