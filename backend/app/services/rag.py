import os
from openai import OpenAI
from .embeddings import generate_embedding
from .pinecone_service import index
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key=os.environ.get("SSC_FIREWORKS_API_KEY"),
)

def handle_rag_query(question: str, user_id: str) -> str:
    # 1. Embed query
    query_text = f"search_query: {question}"
    query_vector = generate_embedding(query_text)
    
    # 2. Search Pinecone
    results = index.query(
        vector=query_vector,
        top_k=8,
        include_metadata=True,
        filter={"user_id": {"$eq": user_id}}
    )
    
    # 3. Build Context with Source Attribution
    contexts = []
    for item in results['matches']:
        if item['score'] > 0.3:
            doc_name = item['metadata'].get('doc_name', 'Unknown Document')
            text = item['metadata']['text']
            contexts.append(f"[SOURCE: {doc_name}]\n{text}")
            
    context_str = "\n\n---\n\n".join(contexts) if contexts else "NO RELEVANT NOTES FOUND IN LIBRARY."
    
    # 4. Prompt Engineering
    system_prompt = (
        "You are StudyBrain, a high-performance Hybrid AI Study Companion. "
        "Your mission is to act as a world-class tutor who uses the user's specific notes as the foundation of knowledge.\n\n"
        "Guidelines:\n"
        "1. PRIORITIZE NOTES: Always start by searching for the answer in the provided 'Context' (the user's notes).\n"
        "2. CITE SOURCES: You MUST explicitly mention which document you are referencing. Use phrases like 'Based on your [Document Name]...' or 'According to [Document Name]...'.\n"
        "3. HYBRID EXPLANATION: Once you find the core facts in the notes, use your internal AI intelligence to explain them in simpler terms. Add analogies, examples, or step-by-step breakdowns.\n"
        "4. GAP FILLING: If the notes mention a concept but don't explain it fully, use your knowledge to provide missing details, stating that you are adding extra info.\n"
        "5. NO NOTES FOUND: If missing from notes, say: 'I don't see this in your current notes, but here is a general explanation...' then provide a summary.\n"
        "6. TONE: Be encouraging, professional, and clear.\n\n"
        "Formatting Rules:\n"
        "- Use ### for section headers.\n"
        "- Bold key terms.\n"
        "- Create a '📚 Sources Referenced' section at the end if notes were used.\n\n"
        f"Context from User Notes:\n{context_str}"
    )

    # Use the model that we confirmed works on your account
    model_name = "accounts/fireworks/models/deepseek-v3" # We will use the standard name but we know DeepSeek works
    
    # Based on the test, deepseek-v4-pro or similar responded. 
    # Let's try deepseek-v3 as it's the most stable version of DeepSeek on Fireworks.
    
    try:
        print(f"DEBUG: Attempting RAG query with model: accounts/fireworks/models/deepseek-v3")
        response = client.chat.completions.create(
            model="accounts/fireworks/models/deepseek-v3",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            temperature=0.1,
            max_tokens=1000
        )
        return response.choices[0].message.content
    except Exception as e:
        # Fallback to the exact string that succeeded in our test
        try:
             print(f"DEBUG: Falling back to model: accounts/fireworks/models/deepseek-v4-pro")
             response = client.chat.completions.create(
                model="accounts/fireworks/models/deepseek-v4-pro",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                temperature=0.1,
                max_tokens=1000
            )
             return response.choices[0].message.content
        except Exception as e2:
            print(f"ALL MODELS FAILED: {str(e2)}")
            return f"AI Brain Error: {str(e2)}"
