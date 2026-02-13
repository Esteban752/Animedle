CREATE TABLE users(
    id SERIAL UNIQUE,
    username VARCHAR(50) PRIMARY KEY,
    score INT
);

CREATE TABLE password(
    userName VARCHAR(50) PRIMARY KEY REFERENCES users(username),
    userPassword VARCHAR(50)
);


CREATE TABLE anime(
    id SERIAL PRIMARY KEY,
    anilistid INTEGER UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    romaji VARCHAR(150),
    genres JSONB,
    tags JSONB,
    year INTEGER NOT NULL,
    source VARCHAR NOT NULL,
    synonyms JSONB,
    cover VARCHAR NOT NULL,
    studio VARCHAR(50) NOT NULL,
    characters JSONB,
    popularity INTEGER NOT NULL
);

CREATE TABLE opening(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    artist VARCHAR(50) NOT NULL,
    animeid SERIAL REFERENCES anime(id) 
);

CREATE TABLE date(
    date DATE PRIMARY KEY
);

CREATE TABLE dayscore(
    userName VARCHAR(50) REFERENCES users(username) NOT NULL,
    date DATE REFERENCES date(date) NOT NULL,
    score INT,
    PRIMARY KEY (userName,date)
);
