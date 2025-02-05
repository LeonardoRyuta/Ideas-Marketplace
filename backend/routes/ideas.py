from fastapi import APIRouter
from pydantic import BaseModel

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
    idea_dict["id"] = len(ideas) + 1  # Assign a simple ID
    ideas.append(idea_dict)
    return {"message": "Idea submitted successfully", "idea": idea_dict}

@router.get("/list")
def list_ideas():
    return {"ideas": ideas}


