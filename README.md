# Spotify Genie - Music Recommender
<img width="1512" alt="Screenshot 2024-10-08 at 12 39 33 AM" src="https://github.com/user-attachments/assets/21ec5f16-62e2-4d0d-b116-9a0cef50b98f">

This web app enhances your music experience by providing personalized recommendations based on the song you’re currently playing. Additionally, it acts as a visual music player, with dynamic, fluid
animations to match the theme of the currently playing song.

# Features
- Spotify Integration: Through Spotify's Web API, the app accesses the user's Spotify account and fetches details about the currently playing song.
- Music Recommendations: Get similar track recommendations based on the current song's artist, genre, mood, and tempo.
- Dynamic Visuals: Enjoy background animations that change color and intensity depending on the playing track.
- User Authentication: Securely login using your Spotify credentials via the Spotify OAuth process.

# Spotify Setup
- Create a Spotify Account, and go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Create an App to get your Client ID and Client Secret, and update the information in the index.js file

# Instructions
- Go to the project folder, install Nodemon - `npm install nodemon --save-dev`
- Select a Port number or use the default in app.js
- Run the server file (app.js) using the command - `npm run startServer`
- Go to **localhost:your port number**, in your browser

