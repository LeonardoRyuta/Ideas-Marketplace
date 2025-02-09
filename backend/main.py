from fastapi import FastAPI
from routes import ideas,scoring,nft
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(
    title="Idea Marketplace API",
    description="An API for submitting and ""patenting"" ideas as NFTs",
    version="1.0"
)

origins = ["http://127.0.0.1:5173", "http://localhost:5173"]

app.add_middleware(

    CORSMiddleware,

    allow_origins=origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)

# Include API routes
app.include_router(ideas.router, prefix="/ideas", tags=["Ideas"])
app.include_router(scoring.router, prefix="/scoring", tags=["AI Scoring"])
app.include_router(nft.router, prefix="/nft", tags=["NFT Metadata"])

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to the Idea Marketplace API"}

# uvicorn main:app --reload  <<<<< To run
