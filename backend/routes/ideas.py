from fastapi import APIRouter
from pydantic import BaseModel
from services.ipfs_service import upload_to_ipfs
router = APIRouter()

# Define Pydantic model for request validation
class IdeaCreate(BaseModel):
    title: str
    description: str

# Temp storage till we setup DB
ideas = []

@router.post("/submit")
def submit_idea(idea: IdeaCreate):
    idea_dict = idea.dict()

    # Upload idea to IPFS
    ipfs_hash = upload_to_ipfs(idea_dict)
    if not ipfs_hash:
        return {"error": "Failed to upload idea to IPFS"}

    # Store locally (for now)
    idea_dict["id"] = len(ideas) + 1
    idea_dict["ipfs_hash"] = ipfs_hash
    ideas.append(idea_dict)

    return {
        "message": "Idea submitted successfully",
        "idea": idea_dict
    }
@router.get("/list")
def list_ideas():
    return {"ideas": ideas}


