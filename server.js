
const data = require('./Movie Data/data.json');
const express = require('express');
const server = express();
const cors = require('cors');
require('dotenv').config();

server.use(cors());
const PORT = 3000;
const axios = require('axios');
const apiKey = process.env.APIkey;


server.get('/', homeHandler)
server.get('/favorite', favoriteHandler)
server.get('/trending', trendingHandler)
server.get('/search', searchHandler)
server.get('/discover', discoverHandler)
server.get('/list', listHandler)
server.get('*', defaultErrorHandler)
server.use(error505Handler)

function homeHandler(req, res) {
    const movie = new Data(data.title, data.poster_path, data.overview);
    res.send(movie);
}
function favoriteHandler(req, res) {
    res.send("Welcome to Favorite Page");
}

function trendingHandler(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`
    try {
        axios.get(url)
            .then(data => {
                let mapData = data.data.results.map(item => {
                    let singleData = new Data(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleData
                })
                res.send(mapData);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }

    catch (error) {
        error505Handler(error, req, res)

    }
}

function searchHandler(req, res) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=The&page=2`
    try {
        axios.get(url)
            .then(resultData => {
                let mapData = resultData.data.results.map(item => {
                    let singleData = new Data(item.id, item.title, item.release_date, item.poster_path, item.overview)
                    return singleData;
                })
                res.send(mapData);
            })
            .catch((error) => {
                res.status(500).send(error());
            })

    }
    catch (error) {
        error505Handler(error, req, res);
    }
}

function discoverHandler(req, res) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=release_date.asc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate&page=3`
    try {
        axios.get(url)
            .then(resultData => {
                let mapData = resultData.data.results.map(item => {
                    let singleData = new Data(item.id, item.title, item.release_date, item.poster_path, item.overview, item.original_language)
                    return singleData;
                })
                res.send(mapData);
            })
            .catch((error) => {
                res.status(500).send(error());
            })
    }
    catch (error) {
        error505Handler(error, req, res)
    }
}
function listHandler(req, res) {
    const url = `https://api.themoviedb.org/3/list/1?api_key=${apiKey}&language=en-US`;
    try {
        axios.get(url)
            .then(resultData => {
                let mapData = resultData.data.items.map(item => {
                    let singleData = new Data(item.id, item.title,item.release_date, item.poster_path, item.overview, item.original_language, item.media_type, item.popularity)
                    return singleData;
                })
                res.send(mapData);
            }).catch((error) => {
                res.status(500).send(error());
            })
    }
    catch (error) {
        error505Handler(error, req, res)
    }
}

function defaultErrorHandler(req, res) {
    res.status(404).send(status404);
}

function Data(id, title, release_date, poster_path, overview, original_language, media_type, popularity) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
    this.original_language = original_language;
    this.media_type = media_type;
    this.popularity = popularity;
}
const status500 = {
    "status": 500,
    "responseText": "Sorry, something went wrong"
};
const status404 = {
    "status": 404,
    "responseText": "Sorry, page not found error"
};
function error505Handler(error, req, res) {
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err);
}
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})