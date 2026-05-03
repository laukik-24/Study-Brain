import tiktoken

def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 100) -> list[str]:
    # Use tiktoken to count tokens
    tokenizer = tiktoken.get_encoding("cl100k_base")
    tokens = tokenizer.encode(text)
    
    chunks = []
    for i in range(0, len(tokens), chunk_size - chunk_overlap):
        chunk_tokens = tokens[i : i + chunk_size]
        chunks.append(tokenizer.decode(chunk_tokens))
        if i + chunk_size >= len(tokens):
            break
    return chunks
