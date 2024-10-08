let redirect = "http://localhost:8888/logged";
let client_id = "YOUR CLIENT ID";
let client_secret = "YOUR CLIENT SECRET";

// Spotify API Endpoints
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const CURRENT_TRACK = "https://api.spotify.com/v1/me/player/currently-playing";
const RECOMMENDATION = "https://api.spotify.com/v1/recommendations";


// Spotify OAuth
function authorize() {
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-read-playback-state user-top-read user-read-currently-playing playlist-read-private";
    window.location.href = url;
}

// Controls page behaviour upon successful (or not) user authentication
function pageLoaded() {
    if (window.location.search.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        let error = urlParams.get('error');
        if(error == null) {
            handleRedirect();
        } else {
            window.location.href = "http://localhost:8888";
        }
    }
}

// Retrieves code from http response
function handleRedirect() {
    let code = getCode();
    getToken(code);
    console.log(code);
    window.history.pushState("", "", redirect);
}

function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }

    return code;
}

// Building body for the token POST request
function getToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect);
    callAuthApi(body);
}

// General function that makes POST requests for authorization (token, referesh)
function callAuthApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", "Basic " + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthResponse;
}

function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthApi(body);
}

function handleAuthResponse() {
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if (data.access_token != undefined) {
            access_token = data.access_token;
            console.log("Token: " + access_token);
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token != undefined){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token)
        }
    } else {
        console.log(this.responseText);
    }
}

// General function that makes requests to various Spotify API endpoints
function callAPI(method, target, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, target, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("access_token")); 
    xhr.send(body);
    xhr.onload = callback;
}

// Retrieving User's current playing track
function currentSongResponse() {
    if(this.status == 200){
        let data = JSON.parse(this.responseText);

        let songName = data.item.name;
        let songId = data.item.id;
        let artistName = data.item.artists[0].name;
        let artistId = data.item.artists[0].id;
        let currentSongHTMl = document.getElementById("current-song");

        localStorage.setItem("song_id", songId);
        localStorage.setItem("artist_id", artistId);
        localStorage.setItem("cover_art_url", data.item.album.images[0].url);
    
        currentSongHTMl.innerHTML = `Currently Playing: ${songName}, by ${artistName}`.toUpperCase();
        changeGradient();

    }
    else if (this.status == 401){
        refreshAccessToken();
    } else {
        alert(this.responseText);
    }
}

function handleRecommendationResponse() {
    if(this.status == 200) {
        let data = JSON.parse(this.responseText);
        console.log(data);
        let recommendedTrack = data.tracks[0].name;
        let recommendedId = data.tracks[0].id;
        let trackArtist = data.tracks[0].artists[0].name;

        let recommendationHTML = document.getElementById("recommendation");
        recommendationHTML.innerHTML = `You May Like: ${recommendedTrack}, by ${trackArtist}`.toUpperCase();
    
    } else {
        alert(this.responseText);
    }
    
    
}

function getCurrentSong() {
    callAPI("GET", CURRENT_TRACK, null, currentSongResponse);
}

function getRecommendation() {
    let params = "?limit=1";
    params += `&seed_artists=${localStorage.getItem("artist_id")}`;
    params += `&seed_tracks=${localStorage.getItem("song_id")}`;
    callAPI("GET", RECOMMENDATION + params, null, handleRecommendationResponse);
}

// Changes gradient depending on current track's cover art
function changeGradient(){
    var imageUrl = localStorage.getItem("cover_art_url");

    Vibrant.from(imageUrl).getPalette()
        .then((palette) => {
            var V = palette.Vibrant._rgb;
            var LV = palette.LightVibrant._rgb;
            var M = palette.DarkMuted._rgb

            var shape1 = document.querySelector(".bg-shape1");
            shape1.style.backgroundColor = `rgb(${V[0]},${V[1]},${V[2]})`;
            
            var shape2 = document.querySelector(".bg-shape2");
            shape2.style.backgroundColor = `rgb(${LV[0]},${LV[1]},${LV[2]})`;

            var shape3 = document.querySelector(".bg-shape3");
            shape3.style.backgroundColor = `rgb(${V[0]},${V[1]},${V[2]})`; 

            var songElement = document.querySelector(".user-items");
            songElement.style.color = `rgb(${M[0]},${M[1]},${M[2]})`;

            var recommendationElement = document.getElementById("recommendation");
            recommendationElement.style.color = `rgb(${M[0]},${M[1]},${M[2]})`;
        })
        .catch((err) => {
            console.error('Error extracting colors:', err);
        });
}

