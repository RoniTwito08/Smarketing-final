import { useEffect, useState } from "react";
import axios from "axios";
 
const CLIENT_ID = "120082169705-99f9502l5poulsg0iqtja7j356nbjena.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000"; // תחליף לפי הצורך
const SCOPE = "https://www.googleapis.com/auth/adwords";

const GoogleAdsConnect = () => {
  const [tokens, setTokens] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", SCOPE);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    window.location.href = authUrl.toString();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      const fetchTokens = async () => {
        try {
          const res = await axios.post("https://oauth2.googleapis.com/token", new URLSearchParams({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code"
          }).toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
          });

          setTokens(res.data);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.error_description || err.message);
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred");
          }
        }
      };

      fetchTokens();
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Connect your Google Ads Account</h2>
      <button onClick={handleConnect}>Connect to Google Ads</button>

      {tokens && (
        <div style={{ marginTop: 20 }}>
          <h3>✅ Tokens received:</h3>
          <pre>{JSON.stringify(tokens, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, color: "red" }}>
          <h3>❌ Error:</h3>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
};

export default GoogleAdsConnect;
