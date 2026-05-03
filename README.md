# 🧠 StudyBrain: Your Private AI Neural Tutor

**StudyBrain** is a high-performance, production-ready RAG (Retrieval-Augmented Generation) platform designed to turn your study materials into a searchable neural knowledge base. By combining modern vector search with advanced language models, StudyBrain allows students to query thousands of pages of notes and textbooks with 100% data privacy and textbook-quality explanations.

---

## ✨ Core Features

- **Isolated Intelligence**: Every document is indexed into a unique, encrypted vector partition. Your data is mathematically invisible to other users.
- **Neural Synthesis**: Powered by **Llama 3.1** and **DeepSeek**, providing accurate explanations grounded strictly in your provided curriculum.
- **App-Style UI/UX**: A sleek, modern full-screen interface featuring a sticky chat experience, glassmorphism aesthetics, and instant response streaming.
- **Responsive by Design**: A seamless experience across desktop and mobile, with adaptive navigation that collapses to icon-only views on small screens.
- **Reinforced Security**: Native Supabase Auth integration with automatic route protection and session-aware redirections.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4 (Modern properties & Theming)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Server**: FastAPI (Python 3.12)
- **RAG Pipeline**: Custom orchestrator with `PyMuPDF` & `tiktoken`
- **Vector Database**: Pinecone Serverless
- **LLM & Embeddings**: Fireworks AI (Llama 3.1 / DeepSeek / Nomic)
- **Database & Auth**: Supabase (PostgreSQL + RLS)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ & npm
- Python 3.12+
- Supabase, Pinecone, and Fireworks AI API Keys

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env based on .env.example
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create .env.local based on .env.local.example
npm run dev
```

---

## 🏗️ Architecture & Documentation
For a deep dive into the system design, please refer to:
- [🏗️ System Architecture](./ARCHITECTURE.md)
- [📊 Data Flow Diagram](./DIAGRAM.md)

---

## 🔐 Security & Privacy
StudyBrain uses **Supabase Row Level Security (RLS)** and **Pinecone Metadata Filtering** to ensure that your data is never leaked or used to train public models. All processing happens in isolated environments, ensuring your intellectual property remains private.

---

## 📈 Roadmap
- [ ] Multi-file cross-referencing in chat
- [ ] Auto-generated flashcards from lecture notes
- [ ] Collaborative "Study Rooms" with shared vector partitions
- [ ] Mobile app (Compose Multiplatform)

---
© 2026 StudyBrain Systems • Built for High Performance Students.
