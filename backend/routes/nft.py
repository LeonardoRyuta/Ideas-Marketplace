from fastapi import APIRouter
from services.nft_metadata import get_nft_metadata

router = APIRouter()

@router.get("/metadata/{token_id}")
def fetch_nft_metadata(token_id: int):
    """
    Retrieves metadata for a given NFT token ID.
    """
    metadata = get_nft_metadata(token_id)
    return metadata
