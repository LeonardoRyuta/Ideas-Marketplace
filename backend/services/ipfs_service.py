import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_KEY = os.getenv("PINATA_SECRET_KEY")
PINATA_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS"

def upload_to_ipfs(data):
    """
    Uploads idea data to IPFS via Pinata API.
    """
    headers = {
        "Content-Type": "application/json",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_KEY,
    }
    print("EEEEE", data.get("title") )
    response = requests.post(
            PINATA_URL,
            headers=headers,
            data=json.dumps({
                "pinataContent": data,  # The actual content being uploaded
                "pinataMetadata": {
                    "name": data.get("title")  # Use the title as the file name
                }
            })
        )

    if response.status_code == 200:
        return response.json().get("IpfsHash")  # Returns the unique IPFS hash
    else:
        print("Error:", response.text)
        return None


def list_ipfs_files():
    print("AAAAA")
    """
    Fetches a list of all files uploaded to IPFS via Pinata.
    """
    url = "https://api.pinata.cloud/data/pinList"

    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_KEY,
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        files = response.json()["rows"]
        return [
            {"ipfs_hash": file["ipfs_pin_hash"], "name": file.get("metadata", {}).get("name", "Unnamed File")}
            for file in files
        ]
    else:
        return {"error": "Failed to fetch files from IPFS", "details": response.text}
    
import requests

def get_ipfs_idea(ipfs_hash: str):
    """
    Fetches an idea's content from IPFS using its hash (CID).
    """
    ipfs_url = f"https://ipfs.io/ipfs/{ipfs_hash}"
    response = requests.get(ipfs_url)

    if response.status_code == 200:
        try:
            return response.json()  # If stored content is JSON
        except ValueError:
            return {"error": "The file content is not in JSON format", "raw_data": response.text}
    else:
        return {"error": "Failed to retrieve idea from IPFS", "details": response.text}
