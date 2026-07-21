import axios from "axios";


const api = axios.create({
    baseURL: "https://docquery-ai-backend.onrender.com/api"
});


export default api;