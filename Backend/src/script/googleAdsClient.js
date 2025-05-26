const axios = require('axios');

// === Config ===
const GOOGLE_CLIENT_ID = "120082169705-99f9502l5poulsg0iqtja7j356nbjena.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_ADS_DEVELOPER_TOKEN = "XXcmQ5vGmimaFrWTG-zr5A";
const GOOGLE_ADS_REFRESH_TOKEN = "1//036tqhygzDZzNCgYIARAAGAMSNwF-L9IrSdBMOa4nR24KOHK-ZHae68QvxqagH2SQHi6AuN7J8Rh9zqwJGidFmLexnMyyGKjQmNE";

const CLIENT_CUSTOMER_ID = "5582899409"; // Customer (no dashes)
const LOGIN_CUSTOMER_ID = "5175124700";  // Manager (no dashes)

// === Step 1: Get Access Token from Refresh Token ===
async function getAccessToken() {
  const tokenUrl = "https://oauth2.googleapis.com/token";
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: GOOGLE_ADS_REFRESH_TOKEN,
    grant_type: "refresh_token"
  });

  try {
    const response = await axios.post(tokenUrl, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    return response.data.access_token;
  } catch (error) {
    console.error("❌ Failed to get access token:", error.response?.data || error.message);
    throw error;
  }
}

// === Step 2: Fetch Campaigns ===
async function getCampaigns() {
  const accessToken = await getAccessToken(); 

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "developer-token": GOOGLE_ADS_DEVELOPER_TOKEN,
    "login-customer-id": LOGIN_CUSTOMER_ID
  };

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status
    FROM campaign
    LIMIT 10
  `;

  try {
    const response = await axios.post(
      `https://googleads.googleapis.com/v17/customers/${CLIENT_CUSTOMER_ID}/googleAds:search`,
      { query },
      { headers }
    );

    console.log("✅ Campaigns:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Error fetching campaigns:", error.response?.data || error.message);
  }
}

// === Run it ===
getCampaigns();
