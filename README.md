# DocQuery AI 🤖

An AI-powered document question answering system built using RAG (Retrieval Augmented Generation).

DocQuery AI allows users to upload PDF documents and ask questions. The system retrieves relevant information from documents using semantic search and generates accurate answers using Google Gemini LLM.

---

## 🚀 Features

- Upload PDF documents
- Extract text from PDF files
- Automatic text chunking
- Generate embeddings using Google Gemini
- Store embeddings in Pinecone Vector Database
- Semantic similarity search
- AI-generated answers from uploaded documents
- Background document processing using Redis and BullMQ
- React-based chat interface

---

## 🏗️ Architecture


User
|
| Upload PDF
↓
React Frontend
|
↓
Node.js + Express Backend
|
├── MongoDB Atlas
| |
| └── Document Metadata
|
├── Redis + BullMQ
| |
| └── Background Processing Queue
|
↓
PDF Processing Worker
|
├── PDF Text Extraction
├── Text Chunking
└── Gemini Embeddings
|
↓
Pinecone Vector Database
|
↓
User Question
|
↓
Question Embedding
|
↓
Similarity Search
|
↓
Relevant Context
|
↓
Google Gemini LLM
|
↓
Final Answer


---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios


### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Redis
- BullMQ


### AI / Vector Database

- Google Gemini API
- Pinecone Vector Database
- RAG Architecture

---

## 📂 Project Structure


DocQueryAI

├── backend
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── services
│ ├── workers
│ ├── config
│ ├── utils
│ └── server.js
│
└── frontend
├── src
├── components
├── pages
└── App.jsx


---

## ⚙️ Setup Instructions

## Backend Setup

Go to backend folder:

```bash
cd backend
npm install
npm run dev

Create a .env file inside backend folder:

PORT=5000

MONGO_URI=

GEMINI_API_KEY=

PINECONE_API_KEY=

PINECONE_INDEX_NAME=

Run the background worker:

node workers/documentWorker.js
Frontend Setup

Go to frontend folder:

cd frontend
npm install
npm run dev
🔄 How It Works
User uploads a PDF document.
Backend stores document information in MongoDB.
Redis queue sends document processing jobs.
Worker extracts text from PDF.
Text is divided into smaller chunks.
Gemini generates embeddings for chunks.
Embeddings are stored in Pinecone.
User asks a question.
Question is converted into an embedding.
Pinecone retrieves relevant document chunks.
Gemini generates the final answer using retrieved context.
🔮 Future Improvements
Multiple document management
Chat history
User authentication
Document-wise conversations
Source citation with page numbers
Better UI/UX
Cloud deployment
👨‍💻 Author

Tanuj Sharma