const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);


const generateAnswer = async(question, context)=>{

const model = genAI.getGenerativeModel({
    model:"gemini-2.5-flash"
});

    const prompt = `
You are an AI assistant that answers questions based only on the given context.

Context:
${context}


Question:
${question}


Instructions:
- Give a clear and accurate answer.
- If the answer is not present in the context, say "I don't know based on the document."
- Do not make up information.
`;


    const result = await model.generateContent(prompt);


    return result.response.text();

};


module.exports = {
    generateAnswer
};