const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema(
    {

        documentId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Document",

            required: true

        },


        question: {

            type: String,

            required: true

        },


        answer: {

            type: String,

            required: true

        }


    },
    {
        timestamps:true
    }
);



const Chat = mongoose.model(
    "Chat",
    chatSchema
);



module.exports = Chat;