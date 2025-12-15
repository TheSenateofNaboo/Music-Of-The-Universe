# MusicOfTheUniverse

## Group 2:
- Heriberto Rosa (Team Leader)
- David Varwig (Developer)
- Gunner Lewis (Developer, Documentation Lead)

## Project Description:
The project made here focuses on building a music recommendation app that allows users to broaden their
music taste and habits. Core features include searching by artist, song, or album. The recommnedations
will be generated from the Last.FM API. That means our recommendations are based off a wide range
of listening data from Spotify to Apple music. 

Our solution is a website that asks the user for a song, artist, or album that they like. The site will 
then use the Last.FM public web API to query for songs that are similar to their provided choice. 
The website then displays the results to the user as Spotify embedded links getting the song IDs from
the Spotify public API. This allows the user to easily add their songs to their liked playlist in Spotify
to listen later or add to a more specified playlist later.

## How to Run:
To run this project, you will need to have the ability to run a react application and node.js project.
Once you have the required libraries added, make sure to install these other files as well.

1. npm install cors
2. npm install dotenv

You will also need to have made an account with Spotify (can be a free account) and Last.FM (free to sign up).

1. https://www.last.fm/api
2. https://developer.spotify.com/documentation/web-api

Make sure to make an account with both and generate an ID and secret with both. You will need to make a .env file
in the backend for the APIs to work. Follow the bellow format, filling in the fields, for the .env file:

ID= 

SECRET=

LASTFM_ID=

LASTFM_SECRET=

To run the project, we will first start the react webpage. In a terminal, go to the frontend>MOTU and execute:

npm run dev

The webpage will be running on Localhost:5173. Then, in a new terminal, go to the backend folder and execute:

node app.js

The backend will now be listening on port 3000. You do not need to go to this in your browser, it only needs to
be active to listen and retrieve the results of user requests.

Finally, on the webpage, select from the dropdown what type of search you want and fill the text field with your
song, album, or artist. Finally, hit Submit. The API request may take some time to load, but after a few seconds,
the results will be listed from top-down on most similar to least similar.
