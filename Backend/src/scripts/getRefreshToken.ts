import express from 'express';
import open from 'open';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

const clientId = "120082169705-99f9502l5poulsg0iqtja7j356nbjena.apps.googleusercontent.com";
const clientSecret = "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";
const redirectUri = 'http://localhost:3000/oauth2callback';
const scope = 'https://www.googleapis.com/auth/adwords';

app.get('/start', async (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  await open(authUrl);
  res.send('✅ Google OAuth flow started. Check your browser!');
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;

  if (!code || typeof code !== 'string') {
    res.status(400).send('Missing code');
    return;
  }

  try {
    const tokenRes = await axios.post<{ access_token: string; refresh_token: string }>('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
    });

    const { access_token, refresh_token } = tokenRes.data;

    console.log('\n🎉 Success!\n');
    console.log('Access Token:\n', access_token);
    console.log('\nRefresh Token:\n', refresh_token);
    console.log('\n✅ Save the refresh token securely in your .env file');

    res.send('✅ Refresh token received. Check your terminal!');
  } catch (error: any) {
    console.error('Error exchanging code:', error.response?.data || error.message);
    res.status(500).send('Failed to exchange code');
  }
});

app.listen(port, () => {
  console.log(`🚀 Open http://localhost:${port}/start to begin the Google OAuth flow`);
});
