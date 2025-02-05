from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# Define request schema
class IdeaInput(BaseModel):
    title: str
    description: str

@router.post("/score")
def get_ai_score(idea: IdeaInput):
    """
    Returns an AI-generated score for an idea.
    """
    #TODO score = calculate_score(idea.title, idea.description) 
    score = {
        "originality": "32",
        "feasibility": "22",
        "market_demand": "90",
        "final_score": "30"
    }
    return {"message": f"AI Score for: {idea.title}", "score": score}
