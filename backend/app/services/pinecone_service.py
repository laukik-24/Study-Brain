import os
import time
from pinecone import Pinecone
from .embeddings import generate_embeddings
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(api_key=os.environ.get("SSC_PINECONE_API_KEY"))
index_name = os.environ.get("SSC_PINECONE_INDEX_NAME")
index = pc.Index(index_name)

def index_document(user_id: str, doc_id: str, doc_name: str, chunks: list[str]):
    start_time = time.time()
    print(f"🚀 STARTING INDEXING: {doc_name} ({len(chunks)} chunks)")
    
    # Nomic-embed-text performs better with a prefix for documents
    prefixed_chunks = [f"search_document: {c}" for c in chunks]
    
    # Generate embeddings for all chunks
    # This is usually the bottleneck for larger files
    print(f"📡 Generating embeddings for {len(chunks)} chunks...")
    emb_start = time.time()
    embeddings = generate_embeddings(prefixed_chunks)
    print(f"✅ Embeddings generated in {time.time() - emb_start:.2f} seconds.")
    
    vectors = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        vectors.append({
            "id": f"{doc_id}_{i}",
            "values": embedding,
            "metadata": {
                "user_id": user_id,
                "doc_id": doc_id,
                "doc_name": doc_name,
                "text": chunk
            }
        })
    
    # Upsert in batches of 100
    print(f"📤 Upserting {len(vectors)} vectors to Pinecone...")
    upsert_start = time.time()
    for i in range(0, len(vectors), 100):
        batch = vectors[i:i+100]
        index.upsert(vectors=batch)
        print(f"   .. Progress: {min(i+100, len(vectors))}/{len(vectors)} vectors uploaded")
    
    print(f"✨ INDEXING COMPLETE in {time.time() - start_time:.2f} seconds.")
