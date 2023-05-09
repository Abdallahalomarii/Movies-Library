DROP TABLE IF EXISTS movie;

CREATE TABLE IF NOT EXISTS movie(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date DATE,
    poster_path VARCHAR(255),
    overview VARCHAR(255)
);