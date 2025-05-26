import requests
import json
import urllib.parse

GOOGLE_CLIENT_ID = "120082169705-99f9502l5poulsg0iqtja7j356nbjena.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
GOOGLE_ADS_DEVELOPER_TOKEN = "XXcmQ5vGmimaFrWTG-zr5A"
GOOGLE_ADS_REFRESH_TOKEN = "1//036tqhygzDZzNCgYIARAAGAMSNwF-L9IrSdBMOa4nR24KOHK-ZHae68QvxqagH2SQHi6AuN7J8Rh9zqwJGidFmLexnMyyGKjQmNE"

CLIENT_CUSTOMER_ID = "5582899409"  # Customer (no dashes)
LOGIN_CUSTOMER_ID = "5175124700"   # Manager (no dashes)

# ---------------------------------------
# Step 1: Use refresh token to get access token
# ---------------------------------------
def get_access_token():
    url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "refresh_token": GOOGLE_ADS_REFRESH_TOKEN,
        "grant_type": "refresh_token"
    }

    response = requests.post(url, data=data)
    response.raise_for_status()
    access_token = response.json()["access_token"]
    return access_token

# ---------------------------------------
# Step 2: Make a request to Google Ads API
# ---------------------------------------
def get_campaigns():
    access_token = get_access_token()

    headers = {
        "Authorization": f"Bearer {access_token}",
        "developer-token": GOOGLE_ADS_DEVELOPER_TOKEN,
        "login-customer-id": LOGIN_CUSTOMER_ID,
    }

    query = """
    SELECT
      campaign.id,
      campaign.name,
      campaign.status
    FROM campaign
    LIMIT 10
    """

    url = f"https://googleads.googleapis.com/v17/customers/{CLIENT_CUSTOMER_ID}/googleAds:search"

    response = requests.post(
        url,
        headers=headers,
        json={"query": query.strip()}
    )

    if response.status_code == 200:
        print("✅ Campaigns:")
        print(json.dumps(response.json(), indent=2))
    else:
        print("❌ Error:", response.status_code, response.text)

# ---------------------------------------
# Run the script
# ---------------------------------------
if __name__ == "__main__":
    get_campaigns()
