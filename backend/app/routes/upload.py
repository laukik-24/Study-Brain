from fastapi import APIRouter, UploadFile, File, Header, HTTPException, Form, BackgroundTasks
from ..services.pdf_parser import extract_text_from_pdf
from ..services.embeddings import generate_embeddings
from ..services.pinecone_service import index_document
from ..services.supabase_auth import verify_token
from ..utils.chunking import chunk_text
import uuid
import time

router = APIRouter()

def process_and_index(doc_db_id: str, user_id: str, doc_name: str, doc_type: str, content: bytes):
    try:
        start_process = time.time()
        # 1. Extract text
        text = extract_text_from_pdf(content)
        
        if not text.strip():
            print(f"ERROR: PDF {doc_name} is empty.")
            from ..services.supabase_auth import supabase
            supabase.table('documents').update({'status': 'failed'}).eq('id', doc_db_id).execute()
            return

        # 2. Chunk text
        chunks = chunk_text(text)
        
        # 3. Generate embeddings and index in Pinecone
        doc_id = str(uuid.uuid4()) # This is the internal vector ID
        index_document(user_id, doc_id, doc_name, chunks)
        
        # 4. Update metadata in Supabase
        from ..services.supabase_auth import supabase
        supabase.table('documents').update({
            'status': 'indexed'
        }).eq('id', doc_db_id).execute()
        
        print(f"✅ ASYNC TASK COMPLETE: {doc_name} indexed in {time.time() - start_process:.2f}s")
    except Exception as e:
        print(f"❌ ASYNC TASK FAILED for {doc_name}: {str(e)}")
        try:
            from ..services.supabase_auth import supabase
            supabase.table('documents').update({'status': 'failed'}).eq('id', doc_db_id).execute()
        except:
            pass

@router.post("/")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    doc_name: str = Form(...),
    doc_type: str = Form(...),
    authorization: str = Header(None)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing auth token")
    
    token = authorization.split(" ")[1]
    user_id = verify_token(token)
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    content = await file.read()
    
    # 1. Create record immediately so user sees it in library
    from ..services.supabase_auth import supabase
    res = supabase.table('documents').insert({
        'user_id': user_id,
        'filename': doc_name,
        'doc_type': doc_type,
        'status': 'processing'
    }).execute()
    
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create document record")
        
    doc_db_id = res.data[0]['id']
    
    # 2. Offload indexing to background
    background_tasks.add_task(process_and_index, doc_db_id, user_id, doc_name, doc_type, content)
    
    return {"message": "Upload successful! Your document is being indexed.", "doc_name": doc_name}
