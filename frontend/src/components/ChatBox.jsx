import { useState } from "react";
import api from "../api/api";


function ChatBox(){

    const [question,setQuestion] = useState("");
    const [answer,setAnswer] = useState("");
    const [loading,setLoading] = useState(false);


    const askQuestion = async()=>{

        if(!question){
            return;
        }


        try{

            setLoading(true);
            setAnswer("");


            const response = await api.post(
                "/query",
                {
                    question: question
                }
            );


            setAnswer(
                response.data.answer
            );


        }
        catch(error){

            console.log(error);

            setAnswer(
                "Something went wrong ❌"
            );

        }
        finally{

            setLoading(false);

        }

    };


    return(

        <div className="mt-10 flex flex-col items-center gap-4">


            <textarea

                value={question}

                onChange={(e)=>setQuestion(e.target.value)}

                placeholder="Ask something from your document..."

                className="border p-3 w-[500px] h-32 rounded-lg"

            />


            <button

                onClick={askQuestion}

                className="bg-black text-white px-6 py-2 rounded-lg"

            >

                {
                    loading 
                    ? "Thinking..."
                    : "Ask"
                }

            </button>



            {
                answer && (

                    <div className="border p-5 w-[500px] rounded-lg">

                        <h2 className="font-bold mb-2">
                            Answer:
                        </h2>


                        <p>
                            {answer}
                        </p>


                    </div>

                )
            }


        </div>

    )

}


export default ChatBox;