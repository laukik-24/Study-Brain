import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key=os.environ.get("SSC_FIREWORKS_API_KEY"),
)

models_to_test = [
    "accounts/fireworks/models/deepseek-v3", # Standard deepseek
    "accounts/fireworks/models/deepseek-v4-pro", # From your list
    "accounts/fireworks/models/kimi-k2p5", # From your list
    "accounts/fireworks/models/glm-5", # From your list
    "accounts/fireworks/models/llama-v3p1-8b-instruct", # Default
]

for model in models_to_test:
    try:
        print(f"Testing model: {model}")
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Say hello"}],
            max_tokens=10
        )
        print(f"✅ SUCCESS: {model} responded: {response.choices[0].message.content}")
        break
    except Exception as e:
        print(f"❌ FAILED: {model} - {str(e)}")
