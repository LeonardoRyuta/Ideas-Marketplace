import requests
import base64
import os
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from services.ipfs_service import upload_to_ipfs
import re
import json
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


        text = response_json[0]['text']
        try:
            json_scores = re.search(r'\{.*\}', text).group()
        except Exception as e:
            print("ERROR IN IDEA: ",text)
            return text
        scores = json.loads(json_scores)
        print("SCORES: ",scores )

        return scores
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
    ai_prompt = f"""
                    Evaluate the following idea based on these criteria:  
                    - **Originality**: How unique and innovative is the idea?  
                    - **Feasibility**: How practical is it to implement given current technology and resources?  
                    - **Market Demand**: How likely is there a need or demand for this idea?  
                    - **Complexity**: How difficult is it to develop and execute?  
                    - **Completeness**: Does the idea fully explain how it will be implemented? This includes:  
                    - **Technology stack** (e.g., AI models, APIs, programming languages, frameworks).  
                    - **Software requirements** (e.g., backend systems, databases, user interfaces).  
                    - **Algorithms or methods** (e.g., ML model type, NLP techniques, data processing).  

                    ### **Idea Submission:**  
                    - **Title**: {idea.title}  
                    - **Description**: {idea.description}  

                    ### **Instructions:**  
                    - **Strict Completeness Check:** If the description lacks any required implementation details (technology, software, or algorithms), return ONLY:  
                    ```json
                    "Incomplete Description"

                    If the idea is complete, provide ONLY a structured JSON response with scores between 1-10 for each category:
                    {{"originality": 7, "feasibility": 8, "market_demand": 9, "complexity": 6, "completeness": 8}}

                    DO NOT assume missing details. If any key component is unspecified, respond ONLY with "Incomplete Description".
                    
                    """

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
