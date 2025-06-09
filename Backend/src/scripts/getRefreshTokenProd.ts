import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port =  3000;

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const redirectUri = 'https://smarketing.cs.colman.ac.il:3000/oauth2callback'; 
const scope = 'https://www.googleapis.com/auth/adwords';

app.get('/start', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
  res.send(
    `<a href="${authUrl}">Click here to start Google OAuth flow</a><br>
    (You must open this link in your browser)`
  );
  console.log('Send this link to your browser to start OAuth:', authUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;

  if (!code || typeof code !== 'string') {
    console.error('❌ Missing code in callback');
    res.status(400).send('Missing code');
    return;
  }

  try {
    console.log('🔄 Exchanging code for tokens...');
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
    });

    interface TokenResponse {
      access_token: string;
      refresh_token: string;
    }

    const { access_token, refresh_token } = tokenRes.data as TokenResponse;

    console.log('\n🎉 Success!\n');
    console.log('Access Token:\n', access_token);
    console.log('\nRefresh Token:\n', refresh_token);
    console.log('\n✅ Save the refresh token securely in your .env file');

    res.send('✅ Refresh token received. Check your server logs!');
  } catch (error: any) {
    console.error('❌ Error exchanging code:', error.response?.data || error.message);
    res.status(500).send('Failed to exchange code');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`Go to https://smarketing.cs.colman.ac.il/start to begin the Google OAuth flow`);
});