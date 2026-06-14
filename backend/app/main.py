from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import upload, query, flashcards, analytics

app = FastAPI(title="StudyBrain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(query.router, prefix="/api/query", tags=["Query"])
app.include_router(flashcards.router, prefix="/api/flashcards", tags=["Flashcards"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/health")
def health_check():
    return {"status": "StudyBrain API Active"}

@app.get("/")
def root():
    return {"message": "StudyBrain API is running on Hugging Face Spaces"}
