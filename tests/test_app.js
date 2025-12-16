import ../backend/app.js as app

function getTokenTest(){
  if(app.getToken() == null){
    throw;
  };
  return 1;
};

function spotifyFetchTest() {
  if(app.spotifyFetch(`https://api.spotify.com/v1/search?q=constant_companions&type=album&limit=5` == null){
    throw;
  };
  return 1;
};

function lastfmFetchTest(){
  if(app.lastfmFetch(`method=artist.gettoptracks&artist=JamieP`) == null){
    throw;
  };
  return 1;
};
