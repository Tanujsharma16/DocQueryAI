# DocQueryAI 🤖

## AI-Powered Document Question Answering System using RAG

DocQueryAI is an AI-based document analysis and question-answering system that allows users to upload PDF documents and ask questions from them. The system uses **Retrieval Augmented Generation (RAG)** to retrieve relevant information from documents and generate accurate responses using Large Language Models.

Instead of relying only on keyword search, DocQueryAI uses **semantic search** with embeddings and vector databases to understand the meaning of queries and find relevant document content.

---

# 🚀 Features

- 📄 Upload PDF documents
- 🔍 Extract text from PDF files
- ✂️ Split documents into smaller chunks
- 🧠 Generate semantic embeddings for document chunks
- 🗄️ Store embeddings in Pinecone Vector Database
- 🔎 Perform similarity-based semantic search
- 💬 Ask questions related to uploaded documents
- 🤖 Generate AI-powered answers using Google Gemini
- ⚡ Context-aware responses using RAG pipeline

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
             Document Processing
                      |
        -----------------------------
        |                           |
   PDF Text Extraction          Chunking
        |
        |
 Embedding Generation
        |
        |
 Pinecone Vector Database
        |
        |
 User Query Embedding
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
     Final Answer
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

## Artificial Intelligence

- Retrieval Augmented Generation (RAG)
- Google Gemini API
- Text Embeddings
- Pinecone Vector Database

## Document Processing

- PDF Text Extraction
- Text Chunking
- Semantic Search

---

# 🔄 How It Works

## 1. Document Upload

User uploads a PDF document through the React frontend.

The backend receives the file and starts the document processing pipeline.

---

## 2. Text Extraction

The PDF content is extracted into raw text.

Example:

```
PDF Document
      |
      ↓
Extracted Text
```

---

## 3. Text Chunking

Large documents are divided into smaller chunks because Large Language Models have limited context windows.

Example:

```
Document

Chunk 1
Chunk 2
Chunk 3
...
```

---

## 4. Embedding Generation

Each chunk is converted into a numerical vector representation called an embedding.

Example:

```
Text

"Database normalization reduces redundancy"

          ↓

[0.234, 0.567, 0.891 ...]
```

These embeddings represent the semantic meaning of the text.

---

## 5. Vector Storage

Generated embeddings are stored in Pinecone Vector Database.

Pinecone enables fast similarity search between user queries and document content.

---

## 6. Question Answering

When a user asks a question:

```
User Question

        ↓

Convert Question into Embedding

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

# 🧠 What is RAG?

RAG (Retrieval Augmented Generation) combines information retrieval with generative AI.

Instead of directly asking an LLM to answer, RAG first retrieves relevant information from external documents and then provides that information to the LLM to generate a more accurate response.

Benefits:

- Better accuracy
- Reduced hallucination
- Works with private documents
- Provides context-aware answers

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

# 🔑 Key Concepts Used

## Embeddings

Embeddings convert text into numerical vectors that capture semantic meaning.

This allows the system to compare meanings instead of only matching keywords.

---

## Vector Database

Unlike traditional databases that search exact values, vector databases perform similarity searches based on meaning.

Example:

Query:

```
"What is database normalization?"
```

can find:

```
"Normalization reduces duplicate data in databases"
```

even if exact words are different.

---

## Semantic Search

Semantic search understands the intent behind a query instead of only matching keywords.

---

# 🎯 Challenges Solved

- Handling large PDF documents
- Converting unstructured text into searchable vectors
- Improving answer accuracy using retrieved context
- Connecting LLM responses with user-provided documents

---

# 🔮 Future Improvements

- User authentication
- Chat history storage
- Multiple document management
- Document sharing
- Improved retrieval algorithms
- Deployment with cloud infrastructure

---

# 👨‍💻 Author

**Tanuj Sharma**

GitHub:
https://github.com/Tanujsharma16
