# DocQueryAI 🤖

## AI-Powered Document Question Answering System using RAG

DocQueryAI is an AI-powered document question-answering platform that allows users to upload PDF documents and ask questions based on their content.

The application uses **Retrieval Augmented Generation (RAG)** architecture, where relevant information is retrieved from uploaded documents using vector similarity search and then provided to an LLM to generate accurate and context-aware responses.

---

# 🚀 Features

- 📄 Upload PDF documents
- 🔍 Extract text from PDF files
- ✂️ Split documents into meaningful chunks
- 🧠 Generate text embeddings
- 🗄️ Store embeddings in Pinecone Vector Database
- 🔎 Perform semantic similarity search
- 💬 Ask questions from uploaded documents
- 🤖 Generate AI responses using Google Gemini
- ⚡ Context-aware answers using RAG pipeline
- 🌐 Fully deployed frontend and backend

---

# 🏗️ System Architecture

```
                    User
                      |
                      |
              React Frontend
                      |
                      |
            Node.js + Express API
                      |
                      |
          PDF Processing Pipeline
                      |
        --------------------------------
        |                              |
 Text Extraction                 Text Chunking
        |
        |
 Embedding Generation
        |
        |
 Pinecone Vector Database
        |
        |
 User Query Processing
        |
        |
 Similarity Search
        |
        |
 Relevant Context + Query
        |
        |
 Google Gemini LLM
        |
        |
     Final Response
```

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## AI / Machine Learning

- Retrieval Augmented Generation (RAG)
- Google Gemini API
- Text Embeddings
- Pinecone Vector Database

## Document Processing

- PDF Text Extraction
- Text Chunking
- Semantic Search

---

# 🔄 Application Workflow

## 1. Document Upload

User uploads a PDF document through the React frontend.

The backend receives the document and starts the processing pipeline.

```
PDF Upload
     |
     ↓
Backend API
```

---

## 2. Text Extraction

The uploaded PDF is converted into machine-readable text.

```
PDF Document

      ↓

Extracted Text
```

---

## 3. Text Chunking

Large documents are divided into smaller chunks because AI models have limited context windows.

Example:

```
Document

Chunk 1
Chunk 2
Chunk 3
...
```

Chunking improves retrieval accuracy and reduces unnecessary processing.

---

## 4. Embedding Generation

Each document chunk is converted into a numerical vector representation called an embedding.

Example:

```
Text:

"Normalization reduces database redundancy"


        ↓


[0.234, 0.567, 0.891 ...]
```

These vectors represent the semantic meaning of the text.

---

## 5. Vector Storage

The generated embeddings are stored in Pinecone Vector Database.

Pinecone enables efficient similarity search between user queries and stored document information.

---

## 6. Question Answering

When a user asks a question:

```
User Question

        ↓

Convert Query into Embedding

        ↓

Search Similar Vectors in Pinecone

        ↓

Retrieve Relevant Document Chunks

        ↓

Send Context + Question to Gemini

        ↓

Generate Final Answer
```

---

# 🧠 RAG Architecture

RAG stands for **Retrieval Augmented Generation**.

Instead of directly asking an LLM to answer, RAG first retrieves relevant information from external sources and then uses that information to generate a response.

## Benefits of RAG:

- Improves answer accuracy
- Reduces hallucination
- Works with private documents
- Provides context-aware responses

---

# 🔍 Semantic Search

Traditional search works on exact keyword matching.

Semantic search understands the meaning behind queries.

Example:

Query:

```
"What is database normalization?"
```

Can retrieve:

```
"Normalization reduces duplicate data in databases."
```

Even if exact words are different.

---

# 📂 Project Structure

```
DocQueryAI

│
├── frontend
│   │
│   ├── src
│   ├── components
│   ├── pages
│   └── App.jsx
│
│
├── backend
│   │
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── services
│   ├── config
│   └── server.js
│
│
└── README.md
```

---

# 🌐 Deployment

The application is deployed using cloud platforms.

## Frontend

- Deployed using **Vercel**
- React + Vite frontend is hosted on Vercel

## Backend

- Deployed using **Render**
- Node.js + Express.js backend is hosted on Render

## Environment Variables

The following environment variables are configured securely:

- MongoDB Connection URI
- Google Gemini API Key
- Pinecone API Key
- Pinecone Configuration

---

# 🎯 Challenges Solved

- Processing large PDF documents efficiently
- Converting unstructured text into searchable vectors
- Implementing semantic search instead of keyword search
- Integrating LLM responses with user-provided documents
- Building an end-to-end AI application

---

# 🔮 Future Improvements

- User authentication
- Chat history
- Multiple document management
- Document sharing
- Improved retrieval algorithms
- Better response evaluation

---

# 👨‍💻 Author

**Tanuj Sharma**

GitHub:
https://github.com/Tanujsharma16
