import React from "react";


function ChatHistory({
    history,
    onSelectChat
   
}){


    return(

        <div className="w-[300px] min-h-screen border-r p-4">







            <h2 className="text-xl font-bold mb-4">

                Recent Chats

            </h2>





            {
                history.length === 0

                ?

                <p className="text-gray-500">

                    No chats yet

                </p>


                :


                history.map((chat,index)=>(


                    <div

                    key={index}

                    onClick={()=>onSelectChat(chat)}

                    className="p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100"


                    >

                        <p className="text-sm truncate">

                            {chat.question}

                        </p>


                    </div>


                ))

            }




        </div>

    )

}



export default ChatHistory;