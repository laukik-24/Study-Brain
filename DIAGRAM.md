# 📊 StudyBrain Architecture Diagram

This diagram visualizes the data flow for both **Document Ingestion** and **RAG Query** pipelines.

```mermaid
graph TD
    subgraph User_Interface ["💻 Frontend (Next.js)"]
        Landing[Landing Page] -->|Session Check| Dashboard
        Login[Login Page] -->|Session Check| Dashboard
        Dashboard[Protected Dashboard] -->|No Session| Login
        
        A[Upload PDF] --> B[POST /api/upload]
        C[Ask Question] --> D[POST /api/query]
    end

    subgraph API_Gateway ["🐍 Backend (FastAPI)"]
        B --> B1{Auth Verify}
        B1 -- Success --> B2[Background Task]
        
        D --> D1{Auth Verify}
        D1 -- Success --> D2[Process Query]
    end

    subgraph Ingestion_Flow ["📥 Ingestion Pipeline"]
        B2 --> E[PyMuPDF: Extract Text]
        E --> F[tiktoken: Chunking]
        F --> G[Fireworks: Embed Chunks]
        G --> H[(Pinecone: Upsert Vectors)]
        H --> I[(Supabase: Save Metadata)]
    end

    subgraph Query_Flow ["🔍 RAG Query Pipeline"]
        D2 --> J[Fireworks: Embed Query]
        J --> K[Pinecone: Top-K Search]
        K --> L[Construct Contextual Prompt]
        L --> M[Fireworks: Chat Completion]
        M --> N[(Supabase: Save Chat History)]
        N --> O[Return Markdown Response]
    end

    O --> |Render| C
    I --> |Success Msg| A

    style User_Interface fill:#f0f7ff,stroke:#0066cc,stroke-width:2px
    style API_Gateway fill:#fff5f5,stroke:#cc0000,stroke-width:2px
    style Ingestion_Flow fill:#f0fff4,stroke:#008000,stroke-dasharray: 5 5
    style Query_Flow fill:#fffaf0,stroke:#d4a017,stroke-dasharray: 5 5
```


---

### 📝 Flow Summary:
*   **App-Style Layout**: Root level `h-screen` and `overflow-hidden` ensures a stable viewport where only content scrolls.
*   **Responsive Nav**: Tab labels are conditionally rendered based on viewport width (`sm:inline`).
*   **Green Path (Ingestion)**: Heavy processing is offloaded to background tasks to keep the UI snappy.
*   **Gold Path (Query)**: Real-time retrieval and generation.
*   **Red Gateway**: Security layer validating every request using Supabase JWT.
