'use strict';
const data = require('./Movie Data/data.json');
const express = require('express');
const server = express();
const cors = require('cors');
require('dotenv').config();
const pg = require('pg');

server.use(cors());
const PORT = process.env.PORT || 3000;
const axios = require('axios');
const apiKey = process.env.APIkey;
server.use(express.json());

const client = new pg.Client(process.env.DATABASE_URL);

server.get('/', homeHandler)
server.get('/favorite', favoriteHandler)
server.get('/trending', trendingHandler)
server.get('/search', searchHandler)
server.get('/discover', discoverHandler)
server.get('/list', listHandler)
server.get('/getMovies', getMovieHandler)
server.post('/addmovie', addMovieHandler)
server.get('/getMovie', getMovieByIdHandler)
server.delete('/DELETE/:id', deleteMovieHandler)
server.put('/UPDATE/:id', updateMovieHandler)
server.get('*', defaultErrorHandler)
server.use(error505Handler)

function homeHandler(req, res) {
    const movie = new Data(data.title, data.poster_path, data.overview);
    res.send(movie);
}
function favoriteHandler(req, res) {
    res.send("Welcome to Favorite Page");
}

// API Handlers
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
                    let singleData = new Data(item.id, item.title, item.release_date, item.poster_path, item.overview, item.original_language, item.media_type, item.popularity)
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

// DataBase  Handlers

function getMovieHandler(req, res) {
    const sql = `SELECT * FROM MOVIE`;
    client.query(sql)
        .then(data => {
            res.send(data.rows);
        })
        .catch((error) => {
            error505Handler(error, req, res);
        })
}

function addMovieHandler(req, res) {
    const movie = req.body;
    const sql = `INSERT INTO movie (title,release_date,poster_path,overview)
    VALUES ($1,$2,$3,$4);`;
    const val = [movie.title, movie.release_date, movie.poster_path, movie.overview];
    client.query(sql, val)
        .then(data => {
            res.send(`the Data has been added successfully`);
            
        })
        .catch((error) => {
            error505Handler(error, req, res);
        })
}

function deleteMovieHandler(req, res) {
    const { id } = req.params;
    const sql = `DELETE FROM movie WHERE id = ${id}`;

    client.query(sql)
        .then(data => {
            res.status(202).send(data);
            console.log(`row with id: ${id} has been deleted`);
        })
        .catch((error) => {
            error505Handler(error, req, res);
        })
}

function updateMovieHandler(req, res) {
    const { id } = req.params;
    const { title, release_date, poster_path, overview } = req.body;
    const sql = `UPDATE movie 
    SET title=$1 , release_date=$2 , poster_path=$3, overview=$4
     WHERE id = ${id}; `;
    const updateVal = [title, release_date, poster_path, overview]
    client.query(sql, updateVal)
        .then(data => {
            res.send(data.rows);
        })
        .catch((error) => {
            error505Handler(error, req, res);
        })

}

function getMovieByIdHandler(req, res) {
    const id = req.query.id;
    const sql = `SELECT * FROM movie WHERE id = ${id};`;
    client.query(sql)
        .then(data => {
            res.send(data.rows);
        })
        .catch((error) => {
            error505Handler(error, req, res);
        })
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
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        })
    })
