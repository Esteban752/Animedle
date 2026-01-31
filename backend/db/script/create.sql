CREATE TABLE user(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    score INT
);

CREATE TABLE password(
    userId SERIAL PRIMARY KEY,
    userPassword VARCHAR(50)
    FOREIGN KEY (userId) REFERENCES users(id)
);


CREATE TABLE anime(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    romaji VARCHAR(50),
    genres TEXT[],
    tags TEXT[],
    year DATE NOT NULL,
    studio VARCHAR(50) NOT NULL,
    character TEXT[]
);

CREATE TABLE opening(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    artist VARCHAR(50) NOT NULL,
    animeid VARCHAR(50) REFERENCES anime(id) 
);

CREATE TABLE dayscore(
    userId SERIAL REFERENCES users(id) NOT NULL,
    date DATE REFERENCES date(date) NOT NULL,
    score INT,
    PRIMARY KEY (userId,date)
);

CREATE TABLE date(
    date DATE PRIMARY KEY
);
