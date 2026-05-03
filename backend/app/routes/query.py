from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from ..services.rag import handle_rag_query
from ..services.supabase_auth import verify_token

router = APIRouter()

class QueryRequest(BaseModel):
    question: str

@router.post("/")
async def ask_question(req: QueryRequest, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing auth token")
    
    token = authorization.split(" ")[1]
    user_id = verify_token(token)
    
    answer = handle_rag_query(req.question, user_id)
    
    # Save to Supabase for persistence
    try:
        from ..services.supabase_auth import supabase
        supabase.table('chat_messages').insert([
            {'user_id': user_id, 'role': 'user', 'content': req.question},
            {'user_id': user_id, 'role': 'ai', 'content': answer}
        ]).execute()
    except Exception as e:
        print(f"FAILED TO SAVE CHAT: {str(e)}")
        # We don't fail the request if saving history fails
        
    return {"answer": answer}
