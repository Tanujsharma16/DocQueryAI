import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import ChatBox from "../components/ChatBox";


function Home(){

    return(

        <div className="min-h-screen">

            <Navbar />


            <div className="text-center mt-20">


                <h1 className="text-5xl font-bold">
                    Ask Anything From Your Documents
                </h1>


                <UploadBox />


                <ChatBox />


            </div>


        </div>

    )

}


export default Home;