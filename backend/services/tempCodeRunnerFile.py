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
