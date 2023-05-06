DROP TABLE IF EXISTS movie;

CREATE TABLE IF NOT EXISTS movie(
    id SERIAL PRIMARY KEY,
    moviename VARCHAR(255),
    yearofmovie VARCHAR(255),
    rate VARCHAR(20)
);
