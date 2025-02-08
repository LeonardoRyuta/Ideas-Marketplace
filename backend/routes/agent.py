import requests
import base64
import os
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from services.ipfs_service import upload_to_ipfs,list_ipfs_files,get_ipfs_idea
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
def send_agent_request(message: str, mode: str = "score"):
    """
    Sends a request to the agent for either idea scoring or matching.
    Mode can be:
    - "score" (default): Evaluates the idea.
    - "match": Finds similar ideas.
    """
    auth_token = BASIC

    headers = {
        "Content-Type": "application/json",  # Ensures the agent interprets JSON
        "Authorization": f"Basic {auth_token}"
    }

    data = {"text": message}  # JSON body payload

    print(f"\n🔹 Sending POST Request to Agent (Mode: {mode}):")
    print(f"URL: {AGENT_API_URL}")
    print(f"Headers: {headers}")
    print(f"Payload: {data}")

    response = requests.post(AGENT_API_URL, json=data, headers=headers)

    print(f"\n🔹 Response from Agent (Mode: {mode}):")
    print(f"Status Code: {response.status_code}")

    try:
        response_json = response.json()
        print("\n🔹 Parsed JSON Response:", response_json)

        text = response_json[0]['text']


        

        if mode == "match":
            try:
                # Extract the text content from AI response
                print("\n🔹 Raw AI Response:", text)

                # Use regex to find the specific 'matching_ideas' JSON inside the text
                match = re.search(r"\{'matching_ideas': (\[.*?\])\}", text)

                if match:
                    json_matches = match.group(0)  # Extract the full dictionary part
                    print("\n🔹 Matched JSON String:", json_matches)

                    # Convert single quotes to double quotes for JSON compatibility
                    json_matches = json_matches.replace("'", '"')

                    # Parse into a proper JSON dictionary
                    matches_dict = json.loads(json_matches)

                    print("\n🔹 Parsed JSON:", matches_dict)

                    return matches_dict  # Returns the {"matching_ideas": [...]} format

                else:
                    print("\n❌ ERROR: Could not find 'matching_ideas' in response:", text)
                    return {"error": "Invalid AI response format", "raw_output": text}

            except Exception as e:
                print("\n❌ ERROR IN MATCHING:", str(e))
                return {"error": "Exception occurred while processing AI response", "details": str(e)}



        # Default (score mode)
        json_scores = re.search(r'\{.*\}', text).group()
        scores = json.loads(json_scores)
        print("SCORES: ", scores)
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
You must return the response **EXACTLY in JSON format** with NO extra text.  
DO NOT include explanations, summaries, or human-readable feedback.  
If the idea lacks any required implementation details (technology, software, or algorithms), return ONLY this exact JSON:

```json
"Incomplete Description"
If the idea is complete, return ONLY the structured JSON output in this format:
{{
    "originality": 7,
    "feasibility": 8,
    "market_demand": 9,
    "complexity": 6,
    "completeness": 8
}}
IMPORTANT:

Return ONLY the JSON response.
DO NOT add any text, labels, or explanations outside the JSON.
The response MUST be in valid JSON format.
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


@router.post("/match")
def matchIdea(description: str):
    """
    Matches ideas stored on IPFS against a given description 
    and retrieves full idea details for matched ideas.
    """
    # Get matching IPFS hashes from AI
    match_result = ai_match(description)

    if "matching_ideas" not in match_result:
        return {"error": "AI did not return a valid match result", "details": match_result}

    matched_hashes = match_result["matching_ideas"]

    # Retrieve full idea details from IPFS for matched ideas
    matched_ideas = []
    for ipfs_hash in matched_hashes:
        idea_content = get_ipfs_idea(ipfs_hash)
        matched_ideas.append({"ipfs_hash": ipfs_hash, "content": idea_content})

    return {"matched_ideas": matched_ideas}


def ai_match(message: str):
    """
    Sends a request to AI to find matching ideas based on the provided description.
    """
    # Fetch stored ideas from IPFS
    ideas = list_ipfs_files()

    if "error" in ideas:
        return ideas  # Return the error if fetching IPFS fails

    # Extract only the idea names (titles)
    idea_names = [idea["name"] for idea in ideas]

    # AI Matching Prompt
    ai_prompt = f"""
    You are an AI assistant designed to evaluate and classify ideas for a decentralized marketplace.
    
    ### Step 1: Contextual Evaluation  
    Before providing feedback, categorize the following ideas stored on IPFS based on their similarities to the given description.  
    - List of existing ideas:  
    {ideas}

    ### Step 2: Matching Task  
    Find the ideas that closely match this description: "{message}".  
    Return ONLY a structured JSON list of matching IPFS hashes.

    ### Example Input:
    "A decentralized finance (DeFi) system for microloans."

    ### Example Output:
    {{"matching_ideas": ["QmXyZ123456...", "QmABC987654..."]}}
    
    DO NOT return a general assessment. If no match is found, return an empty list: {{"matching_ideas": []}}
    """

    # Send request to AI agent in "match" mode
    return send_agent_request(ai_prompt, mode="match")



