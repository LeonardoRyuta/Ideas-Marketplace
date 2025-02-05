from fastapi import FastAPI
from routes import ideas,scoring

# Initialize FastAPI app
app = FastAPI(
    title="Idea Marketplace API",
    description="An API for submitting and ""patenting"" ideas as NFTs",
    version="1.0"
)

# Include API routes
app.include_router(ideas.router, prefix="/ideas", tags=["Ideas"])
app.include_router(scoring.router, prefix="/scoring", tags=["AI Scoring"])

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to the Idea Marketplace API"}

# uvicorn main:app --reload  <<<<< To run
