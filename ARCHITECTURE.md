# 🏗️ StudyBrain System Architecture

This document outlines the technical architecture of the **Smart Study Companion (StudyBrain)**, a production-ready RAG (Retrieval-Augmented Generation) SaaS platform.

---

## 🛠️ High-Level Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15+ (App Router, JS, Tailwind v4) | App-style UI, Client-side Auth, Sticky Interfaces |
| **Backend** | FastAPI (Python) | RAG Pipeline, PDF Processing, Vector Logic |
| **Database** | Supabase (PostgreSQL) | User Metadata, Document Records, Chat History |
| **Auth** | Supabase Auth (Google OAuth) | Identity Management & JWT issuance |
| **Vector DB** | Pinecone | Semantic "Brain" storage & high-speed retrieval |
| **LLM / Embeddings** | Fireworks AI | Llama 3/DeepSeek (Chat) & Nomic (Embeddings) |

---

## 🔄 1. Data Ingestion Pipeline (Upload Flow)
When a user uploads a PDF, the system follows this sequence:

1.  **Extraction**: `PyMuPDF` scans the PDF and extracts raw text.
2.  **Chunking**: `tiktoken` splits text into 500-token chunks with 100-token overlap to maintain context.
3.  **Embedding**: Chunks are sent to Fireworks AI (`nomic-embed-text-v1.5`) with the `search_document:` prefix.
4.  **Vector Storage**: Vectors are stored in **Pinecone** with metadata: `{user_id, doc_id, text}`.
5.  **Metadata Storage**: A record is created in **Supabase** `documents` table to track status.
6.  **Background Task**: The entire process runs as a `FastAPI BackgroundTask`, allowing the user to continue using the app immediately.

---

## 🔍 2. RAG Query Pipeline (Chat Flow)
When a user asks a question, the "Retrieval-Augmented Generation" process kicks in:

1.  **Query Embedding**: The user's question is prefixed with `search_query:` and converted to a vector.
2.  **Semantic Search**: Pinecone returns the top 8 most relevant text chunks, filtered strictly by the user's `user_id`.
3.  **Context Construction**: Relevant chunks (score > 0.3) are merged into a "Context Block."
4.  **Strict Grounding**: The prompt is sent to the LLM (DeepSeek/Llama) with a "Strict AI Study Assistant" system prompt.
5.  **Response**: The AI generates a structured Markdown response based **ONLY** on the retrieved chunks.
6.  **Persistence**: The Q&A pair is saved to the Supabase `chat_messages` table for history persistence.

---

## 🔐 3. Security & Multi-Tenancy
The system ensures data privacy through a two-layer security model:

*   **Layer 1 (Application)**: Every API request to the backend must include a Supabase JWT. The backend validates this token and extracts the `user_id`.
*   **Layer 2 (Database)**: **Supabase Row Level Security (RLS)** policies ensure a user can only `SELECT` or `INSERT` rows where the `user_id` matches their own.
*   **Layer 3 (Vector)**: Pinecone metadata filtering ensures that even though all vectors live in one index, search results never include data from other users.

---

## 📂 4. Project Structure

### Backend (`/backend`)
*   `app/main.py`: Entry point and CORS configuration.
*   `app/routes/`: API endpoints (Upload, Query, Analytics).
*   `app/services/`: Core logic (RAG orchestrator, Embedding generator, Pinecone client).
*   `app/utils/`: Helper functions (Text chunking).

### Frontend (`/frontend`)
*   **App-Style Layout**: Implements a full-screen (`h-screen`) fixed-viewport design with internal scrolling (`overflow-hidden` at root, `overflow-y-auto` for content).
*   **Sticky Chat Interface**: Features a persistent bottom-anchored chat input with high-density backdrop blurs and optimized mobile responsiveness.
*   **Responsive Navigation**: Adaptive tab-based navigation that shows descriptive labels on desktop/tablets and collapses to icons-only on mobile devices.
*   **Auth Guarding**: Reinforced security flow using `onAuthStateChange` and `getSession` checks to prevent unauthorized access to `/dashboard/*` and automatically redirect authenticated users away from landing/login pages.
*   **Modern Styling**: Utilizes Tailwind CSS v4 features for glassmorphism, text-glow effects, and custom scrollbar styling.

---

## 📈 5. Scalability Considerations
*   **Stateless Backend**: The FastAPI server is stateless and can be horizontally scaled using Docker.
*   **Serverless Vectors**: Pinecone Serverless handles billions of vectors without managing infrastructure.
*   **Asynchronous Tasks**: Background workers ensure that large file processing never blocks the main API thread.
