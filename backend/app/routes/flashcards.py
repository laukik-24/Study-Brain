from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from ..services.supabase_auth import verify_token

router = APIRouter()

@router.post("/generate")
async def generate_flashcards(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing auth token")
    
    # Placeholder for flashcard generation logic
    return {"message": "Flashcards generated", "flashcards": []}
