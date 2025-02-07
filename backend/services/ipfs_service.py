import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_KEY = os.getenv("PINATA_SECRET_KEY")
PINATA_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS"

def upload_to_ipfs(data: dict):
    """
    Uploads idea data to IPFS via Pinata API.
    """
    headers = {
        "Content-Type": "application/json",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_KEY,
    }

    response = requests.post(PINATA_URL, headers=headers, data=json.dumps({"pinataContent": data}))

    if response.status_code == 200:
        return response.json().get("IpfsHash")  # Returns the unique IPFS hash
    else:
        print("Error:", response.text)
        return None
