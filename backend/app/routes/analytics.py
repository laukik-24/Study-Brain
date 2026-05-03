from fastapi import APIRouter, Header, HTTPException
from ..services.supabase_auth import verify_token

router = APIRouter()

@router.get("/")
async def get_analytics(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing auth token")
    
    # Placeholder for analytics logic
    return {
        "topics_studied": 10,
        "queries_count": 50,
        "weak_topics": ["Quantum Physics", "Organic Chemistry"]
    }
