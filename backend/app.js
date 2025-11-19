// Load environment variables from .env file. (ID & SECRET)
require('dotenv').config()

// Load Express & fetch library
const express = require('express');
fetch("https://api.spotify.com/...");
// Create express server
const app = express();

// Retrieve Spotify API credentials from environment variables 
const client_id = process.env.ID
const client_secret = process.env.SECRET

// Parse JSON in incoming requests
app.use(express.json());

/* 
------------Access Token------------
  Function to get an access token from Spotify using Client Credentials Flow
  This authentication is server-to-serve communication
  No user login required, cannot access user-specifed data 
*/
async function getToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    }
  });

  // Return the access token response as JSON
  const data = await response.json();
  return data.access_token;
}

/*
  ------------Spotify Fetch Helper------------
*/
async function spotifyFetch(url) {
  const token = await getToken();
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.json();
}

/*
  ------------Routes------------
  handles search, track, artist, album, & recommendation api calls
*/
// search
app.get('/api/search', async (req, res) => { 
  const { q, type } = req.query;
  const data = await spotifyFetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}`
  );
  res.json(data);
});

// track info
app.get('/api/track/:id', async (req, res) => {
  const data = await spotifyFetch(`https://api.spotify.com/v1/tracks/${req.params.id}`);
  res.json(data);
});

// artist info
app.get('/api/artist/:id', async (req, res) => {
  const data = await spotifyFetch(`https://api.spotify.com/v1/artists/${req.params.id}`);
  res.json(data);
});

// albums info
app.get('/api/albums/:id', async (req, res) => {
  const data = await spotifyFetch(`https://api.spotify.com/v1/albums/${req.params.id}`);
  res.json(data);
});

// start server
app.listen(3000, () => {
  console.log("server running on port 3000");
});