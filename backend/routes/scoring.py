import requests
import base64
import os
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from services.ipfs_service import upload_to_ipfs

# Load environment variables
load_dotenv()

router = APIRouter()

# Correct API URL (Update to match your agent)
AGENT_API_URL = "https://autonome.alt.technology/pot-bzefdg/3d76617f-e298-0e06-9503-5b690247c2d2/message"

# Authentication Credentials
BASIC = os.getenv("BASIC")

if not BASIC:
    raise ValueError("❌ BASIC authentication token is missing from .env!")

class IdeaCreate(BaseModel):
    title: str
    description: str

ideas = []  # Temporary storage (replace with DB later)

def send_agent_request(message: str):
    """
    Sends a request to the agent using POST and ensures proper headers & JSON data format.
    """
    auth_token = BASIC

    headers = {
        "Content-Type": "application/json",  # Ensures the agent interprets JSON
        "Authorization": f"Basic {auth_token}"
    }

    data = {"text": message}  # JSON body payload

    print("\n🔹 Sending POST Request to Agent:")
    print(f"URL: {AGENT_API_URL}")
    print(f"Headers: {headers}")
    print(f"Payload: {data}")

    response = requests.post(AGENT_API_URL, json=data, headers=headers)  # Ensure JSON format

    print("\n🔹 Response from Agent:")
    print(f"Status Code: {response.status_code}")

    try:
        response_json = response.json()
        print("\n🔹 Parsed JSON Response:", response_json)
        return response_json
    except Exception as e:
        print("\n❌ Error Parsing JSON Response:", str(e))
        return {"error": "Invalid JSON response"}

@router.post("/submit")
def submit_idea(idea: IdeaCreate):
    """
    Submits an idea, uploads it to IPFS, and retrieves an AI score from the agent.
    """
    idea_dict = idea.dict()

    # Upload idea to IPFS
    ipfs_hash = upload_to_ipfs(idea_dict)
    if not ipfs_hash:
        return {"error": "Failed to upload idea to IPFS"}

    # Get AI-generated score from the agent
    ai_prompt = f"Score the following idea based on originality, feasibility, market demand, complexity, completeness:\n\nTitle: {idea.title}\nDescription: {idea.description}\nProvide only a structured JSON output for the scores only."
    ai_score = send_agent_request(ai_prompt)

    # Store locally (for now)
    idea_dict["id"] = len(ideas) + 1
    idea_dict["ipfs_hash"] = ipfs_hash
    idea_dict["ai_score"] = ai_score  # Store AI score with the idea
    ideas.append(idea_dict)

    return {
        "message": "Idea submitted successfully",
        "idea": idea_dict
    }
