const Chat = require("../models/Chat");


const getChats = async(req,res)=>{

    try{

        const { documentId } = req.params;


        const chats = await Chat.find({
            documentId
        })
        .sort({
            createdAt:-1
        });



        res.json(chats);


    }
    catch(error){

        console.log(
            "Chat fetch error:",
            error
        );


        res.status(500).json({

            message:"Failed to fetch chats"

        });

    }

};



module.exports = {
    getChats
};