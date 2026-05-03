import os
import time
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key=os.environ.get("SSC_FIREWORKS_API_KEY"),
)

def generate_embeddings(texts: list[str]) -> list[list[float]]:
    model = os.environ.get("SSC_EMBEDDING_MODEL", "nomic-ai/nomic-embed-text-v1.5")
    all_embeddings = []
    # Larger batch size to reduce network overhead
    batch_size = 32
    
    total_texts = len(texts)
    print(f"   .. API: Starting embedding generation for {total_texts} items in batches of {batch_size}")
    
    for i in range(0, total_texts, batch_size):
        batch_start = time.time()
        batch = texts[i : i + batch_size]
        response = client.embeddings.create(
            model=model,
            input=batch,
        )
        all_embeddings.extend([data.embedding for data in response.data])
        
        elapsed = time.time() - batch_start
        print(f"   .. API: Processed {min(i+batch_size, total_texts)}/{total_texts} (Batch took {elapsed:.2f}s)")
        
    return all_embeddings

def generate_embedding(text: str) -> list[float]:
    return generate_embeddings([text])[0]
