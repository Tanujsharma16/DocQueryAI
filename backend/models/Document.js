const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "uploaded",
                "processing",
                "completed",
                "failed"
            ],
            default: "uploaded"
        },

        totalPages: {
            type: Number,
            default: 0
        },

        totalChunks: {
            type: Number,
            default: 0
        },
        filePath: {
    type: String,
    required: true
}
    },
    {
        timestamps: true
    }
);


const Document = mongoose.model("Document", documentSchema);

module.exports = Document;