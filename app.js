// importing express
const express = require('express');
const path = require('path');
const request = require('request');

// Creating Server
const app = express();
const PORT = 8888

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
});
app.use("/static", express.static(path.join(__dirname, 'public')));


// Home
app.get("/", (req, res) => {
    // console.log("index")
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
});

// Logged In
app.get("/logged", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'logged.html'))
});







