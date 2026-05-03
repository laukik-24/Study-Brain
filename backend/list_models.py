import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key=os.environ.get("SSC_FIREWORKS_API_KEY"),
)

try:
    # Attempt to list models (some providers support this)
    models = client.models.list()
    print("Available Models:")
    for model in models:
        print(model.id)
except Exception as e:
    print(f"Failed to list models: {str(e)}")
