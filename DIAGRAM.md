# 📊 StudyBrain Architecture Diagram

This diagram visualizes the data flow for both **Document Ingestion** and **RAG Query** pipelines, optimized for dark mode.

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '#3b82f6', 'edgeLabelBackground':'#1a1a1a', 'tertiaryColor': '#1a1a1a'}}}%%
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

    %% Dark Mode Styles
    style User_Interface fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#f8fafc
    style API_Gateway fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#f8fafc
    style Ingestion_Flow fill:#064e3b,stroke:#10b981,stroke-dasharray: 5 5,color:#f8fafc
    style Query_Flow fill:#451a03,stroke:#f59e0b,stroke-dasharray: 5 5,color:#f8fafc
    
    %% Node Specific Styles
    style Dashboard fill:#3b82f6,color:#fff,stroke-width:0px
    style B2 fill:#4f46e5,color:#fff,stroke-width:0px
    style D2 fill:#4f46e5,color:#fff,stroke-width:0px
```

---

## 🎨 How to view this diagram:
1.  **GitHub**: Renders automatically and looks best in GitHub's **Dark Mode**.
2.  **VS Code**: Install the "Markdown Preview Mermaid Support" extension.
3.  **Online**: Copy the code block above and paste it into the [Mermaid Live Editor](https://mermaid.live/).

---

### 📝 Flow Summary:
*   **App-Style Layout**: Root level `h-screen` and `overflow-hidden` ensures a stable viewport where only content scrolls.
*   **Responsive Nav**: Tab labels are conditionally rendered based on viewport width (`sm:inline`).
*   **Green Path (Ingestion)**: Heavy processing is offloaded to background tasks to keep the UI snappy.
*   **Gold Path (Query)**: Real-time retrieval and generation.
*   **Red Gateway**: Security layer validating every request using Supabase JWT.
