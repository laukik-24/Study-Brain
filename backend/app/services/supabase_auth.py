import os
from supabase import create_client, Client
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SSC_SUPABASE_URL")
key: str = os.environ.get("SSC_SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

def verify_token(token: str) -> str:
    if not token or token == "undefined" or token == "null":
        raise HTTPException(status_code=401, detail="Invalid token: Token is empty or undefined")
        
    try:
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid auth token: User not found")
        return str(user.user.id)
    except Exception as e:
        # We log the error type but NOT the token itself
        print(f"JWT VERIFICATION FAILED: {type(e).__name__}")
        raise HTTPException(status_code=401, detail="Authentication failed")
