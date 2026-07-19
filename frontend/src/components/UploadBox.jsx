import { useState } from "react";
import api from "../api/api";


function UploadBox(){

    const [file,setFile] = useState(null);
    const [message,setMessage] = useState("");


    const uploadPDF = async()=>{

        if(!file){
            setMessage("Please select a PDF");
            return;
        }


        const formData = new FormData();

        formData.append(
            "pdf",
            file
        );


        try{

            setMessage("Uploading...");


            const response = await api.post(
                "/documents/upload",
                formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
            );


            setMessage(
                "PDF uploaded successfully ✅"
            );


            console.log(response.data);


        }
        catch(error){

            console.log(error);

            setMessage(
                "Upload failed ❌"
            );

        }

    };


    return(

        <div className="mt-10 flex flex-col items-center gap-4">


            <input
                type="file"
                accept="application/pdf"
                onChange={(e)=>setFile(e.target.files[0])}
                className="border p-2"
            />


            <button
                onClick={uploadPDF}
                className="bg-black text-white px-6 py-2 rounded-lg"
            >
                Upload PDF
            </button>


            <p>
                {message}
            </p>


        </div>

    )

}


export default UploadBox;