// Load environment variables from .env file. (ID & SECRET)
require('dotenv').config()

// Retrieve Spotify API credentials from environment variables 
const client_id = process.env.ID
const client_secret = process.env.SECRET

// Function to get an access token from Spotify using Client Credentials Flow
// This authentication is server-to-serve communication
// No user login required, cannot access user-specifed data 
async function getToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials', // specify authentication grant type
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Encode client ID and Secret as Base64 for authorization
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
    },
  });

  // Return the access token response as JSON
  return await response.json();
}

// Function to fetch track information from Spotify using the access token
// Spotify Web API endpoint should be 'api.spotify.com'
async function getTrack(access_token) {
  const response = await fetch("https://api.spotify.com/v1/tracks/2CGNAOSuO1MEFCbBRgUzjd", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  });
  // return track info as JSON
  return await response.json();
}

// Obtain token, then fetch and log the track info 
getToken().then(response => {
  getTrack(response.access_token).then(profile => {
    console.log(profile); // print track information to the console
  })
});