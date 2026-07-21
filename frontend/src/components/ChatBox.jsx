import { useState, useEffect, useRef } from "react";
import api from "../api/api";
import ChatHistory from "./ChatHistory";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


function ChatBox(){


    const [question,setQuestion] = useState("");

    const [loading,setLoading] = useState(false);

    const [documents,setDocuments] = useState([]);

    const [selectedDocument,setSelectedDocument] = useState("");

    const [history,setHistory] = useState([]);

    const [messages,setMessages] = useState([]);


    const chatEndRef = useRef(null);






    const fetchDocuments = async()=>{

        try{

            const response = await api.get(
                "/documents"
            );

            setDocuments(response.data);

        }
        catch(error){

            console.log(
                "Document fetch error",
                error
            );

        }

    };








    const fetchHistory = async(id)=>{

        try{

            const response = await api.get(
                `/chats/${id}`
            );


            setHistory(response.data);


        }
        catch(error){

            console.log(error);

        }

    };









    useEffect(()=>{

        fetchDocuments();

    },[]);









    useEffect(()=>{

        chatEndRef.current?.scrollIntoView({

            behavior:"smooth"

        });


    },[messages]);









    const selectDocument=(id)=>{


        setSelectedDocument(id);

        setMessages([]);

        fetchHistory(id);


    };












    const askQuestion=async()=>{


        if(!question){

            return;

        }


        if(!selectedDocument){

            return;

        }



        const userMessage={

            role:"user",

            text:question

        };



        setMessages(prev=>[

            ...prev,

            userMessage

        ]);



        setQuestion("");



        try{


            setLoading(true);



            const response = await api.post(

                "/query",

                {

                    question,

                    documentId:selectedDocument

                }

            );





            const aiMessage={

                role:"ai",

                text:response.data.answer

            };





            setMessages(prev=>[

                ...prev,

                aiMessage

            ]);



            fetchHistory(
                selectedDocument
            );


        }
        catch(error){


            console.log(error);


            setMessages(prev=>[

                ...prev,

                {

                    role:"ai",

                    text:"Something went wrong ❌"

                }

            ]);

        }
        finally{


            setLoading(false);


        }


    };












    const deleteDocument=async(id)=>{


        try{


            await api.delete(

                `/documents/${id}`

            );



            fetchDocuments();



            if(selectedDocument===id){


                setSelectedDocument("");

                setMessages([]);

                setHistory([]);

            }


        }
        catch(error){

            console.log(error);

        }


    };









    return(


        <div className="flex min-h-screen">





            {/* Sidebar */}

            <ChatHistory


                history={history}


                onSelectChat={(chat)=>{


                    setMessages([


                        {

                            role:"user",

                            text:chat.question

                        },


                        {

                            role:"ai",

                            text:chat.answer

                        }


                    ]);


                }}



            />













            {/* Main Area */}


            <div className="flex-1 flex flex-col items-center gap-5 p-8">





                <h1 className="text-3xl font-bold">

                    Ask Anything From Your Documents

                </h1>









                {/* Documents */}


                <div className="flex flex-col gap-3">


                {
                    documents.map((doc)=>(


                        <div


                        key={doc._id}


                        onClick={()=>{


                            if(doc.status==="completed"){

                                selectDocument(doc._id);

                            }


                        }}



                        className={

                            `border p-3 rounded-lg w-[500px]
                            flex justify-between items-center cursor-pointer
                            ${
                                selectedDocument===doc._id
                                ?
                                "border-2 border-black"
                                :
                                ""
                            }`

                        }


                        >



                            <div>


                                <p>

                                    📄 {doc.filename}

                                </p>



                                <p className="text-sm text-gray-500">

                                    Status: {doc.status}

                                </p>


                            </div>






                            <button


                            onClick={(e)=>{


                                e.stopPropagation();


                                deleteDocument(doc._id);


                            }}



                            className="bg-red-600 text-white px-3 py-1 rounded"

                            >

                                Delete


                            </button>




                        </div>


                    ))
                }


                </div>














                {/* Messages */}


                <div className="w-[600px] flex flex-col gap-4">



                {

                    messages.map((msg,index)=>(



                        <div

                        key={index}


                        className={

                            msg.role==="user"

                            ?

                            "self-end bg-black text-white p-3 rounded-lg max-w-[80%]"

                            :

                            "self-start bg-gray-200 p-3 rounded-lg max-w-[80%]"

                        }


                        >


                            <ReactMarkdown


                            components={{


                                code({node,inline,className,children,...props}){


                                    const match =
                                    /language-(\w+)/.exec(
                                        className || ""
                                    );



                                    return !inline && match ?


                                    (

                                    <SyntaxHighlighter

                                    style={oneDark}

                                    language={match[1]}

                                    PreTag="div"

                                    {...props}

                                    >

                                    {
                                        String(children)
                                        .replace(/\n$/,"")
                                    }


                                    </SyntaxHighlighter>


                                    )


                                    :


                                    (

                                    <code {...props}>

                                        {children}

                                    </code>

                                    );


                                }


                            }}


                            >


                                {msg.text}


                            </ReactMarkdown>



                        </div>


                    ))

                }






                {
                    loading && (


                        <div className="self-start bg-gray-200 p-3 rounded-lg">

                            Thinking...

                        </div>


                    )
                }





                <div ref={chatEndRef}></div>



                </div>












                <textarea


                value={question}


                onChange={(e)=>setQuestion(e.target.value)}


                placeholder="Ask something from your document..."


                className="border p-3 w-[600px] h-32 rounded-lg"



                />









                <button


                onClick={askQuestion}


                className="bg-black text-white px-6 py-2 rounded-lg"


                >

                    {
                        loading
                        ?
                        "Thinking..."
                        :
                        "Ask"
                    }


                </button>







            </div>





        </div>


    )


}


export default ChatBox;