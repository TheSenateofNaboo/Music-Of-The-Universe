// Load environment variables from .env file. (ID & SECRET)
require('dotenv').config()

// Load Express & fetch library
const express = require('express');
const app = express();

// Allow CORS
const cors = require('cors');
app.use( cors ({ origin: "*" }));

fetch("https://api.spotify.com/...");

// Retrieve Spotify API credentials from .env
const client_id = process.env.ID;
const client_secret = process.env.SECRET;

// Last.fm credentials from .env
const lastfm_id = process.env.LASTFM_ID;
const lastfm_secret = process.env.LASTFM_SECRET;

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
    Function refreshes the spotify token per api call to ensure the current token doesn't expire
*/
async function spotifyFetch(url) {
  const token = await getToken();
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
}

/*
  ------------Last.fm Fetch Helper------------
*/
async function lastfmFetch(params) {
  const url =  `http://ws.audioscrobbler.com/2.0/?${params}&api_key=${lastfm_id}&format=json`;
  const response = await fetch(url);
  return response.json();
}

/*
  ------------Routes------------
  Spotify Endpoints
*/

// search (track/artist/album)
app.get('/api/search', async (req, res) => { 
  try {
    const { q, type } = req.query;

    if (!q || !type) {
      return res.status(400).json({ error: "Missing q or type parameter." });
    }

    const data = await spotifyFetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}&limit=10`
    );

    res.json(data);

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search Spotify." });
  }
});

// Get track info
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

/*
  ------------Recommendations------------
  type=track  -> similar tracks
  type=artist -> similar artists -> top tracks
  type=album  -> album -> pick track -> similar tracks
*/
app.get('/api/recommendations', async (req, res) => {
  const { type, query } = req.query;

  let seedArtist;
  let seedTrack;
  let lastfmResults = [];

  // ---------- ALBUM ----------
  if (type === "album") {
    const albumSearch = await spotifyFetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=1`
    );

    const albumItem = albumSearch.albums?.items?.[0];

    const album = await spotifyFetch(
      `https://api.spotify.com/v1/albums/${albumItem.id}`
    );

    const albumTrack = album.tracks.items[0];
    seedTrack = albumTrack.name;
    seedArtist = album.artists[0].name;

    const data = await lastfmFetch(
      `method=track.getsimilar&artist=${encodeURIComponent(seedArtist)}&track=${encodeURIComponent(seedTrack)}`
    );

    lastfmResults = data.similartracks?.track || [];
  }

  // ---------- TRACK ----------
  else if (type === "track") {
    const spotifySearch = await spotifyFetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`
    );

    const seedItem = spotifySearch.tracks?.items?.[0];
    seedTrack = seedItem.name;
    seedArtist = seedItem.artists[0].name;

    const data = await lastfmFetch(
      `method=track.getsimilar&artist=${encodeURIComponent(seedArtist)}&track=${encodeURIComponent(seedTrack)}`
    );

    lastfmResults = data.similartracks?.track || [];
  }

  // ---------- ARTIST ----------
  else if (type === "artist") {
    const spotifySearch = await spotifyFetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=1`
    );

    const seedItem = spotifySearch.artists?.items?.[0];
    seedArtist = seedItem.name;

    const sim = await lastfmFetch(
      `method=artist.getsimilar&artist=${encodeURIComponent(seedArtist)}`
    );

    const similarArtists = sim.similarartists?.artist || [];

    for (const a of similarArtists.slice(0, 5)) {
      const top = await lastfmFetch(
        `method=artist.gettoptracks&artist=${encodeURIComponent(a.name)}`
      );

      const firstTrack = top.toptracks?.track?.[0];
      if (firstTrack) lastfmResults.push(firstTrack);
    }
  }

  // ---------- Last.fm -> Spotify ----------
  const spotifyRecommendations = [];

  for (const item of lastfmResults.slice(0, 10)) {
    const spotifySearch = await spotifyFetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(item.name + " " + item.artist.name)}&type=track&limit=1`
    );

    const match = spotifySearch.tracks?.items?.[0];
    if (match) {
      spotifyRecommendations.push(match);
    }
  }

  res.json({
    type,
    seed: { artist: seedArtist, track: seedTrack || null },
    recommendations: spotifyRecommendations
  }); 
});

// start server
app.listen(3000, () => {
  console.log("server running on port 3000");
});