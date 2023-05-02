
const data = require('./Movie Data/data.json');

const express = require('express');

const server = express();

const cors = require('cors');

const PORT = 3000;

const status500 = {
    "status": 500,
    "responseText": "Sorry, something went wrong"
};

const status404 = {
    "status": 404,
    "responseText": "Sorry, page not found error"
};



server.use(cors()) ;

server.get('/', (req, res) => {
    const movie = new Data(data.title,data.poster_path,data.overview);

    res.send(movie);
})

server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
})

server.get('/error', (req, res) => {
    res.send(error());
})
// server.get('*',(req,res)=>{
//     res.status(404).send(status404);

// })

server.use(function (req, res) {
    res.status(404).send(status404);
});


function Data(title,poster_path,overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

server.use(function (error, req, res, next) {
    res.status(500).send(status500);
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})