require('dotenv').config();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const { oleCheckJWT } = require("../middleware");

const Pool = require('pg').Pool;

// Read variables from .env file
const DATABASE_USER_NAME = process.env.DATABASE_USER_NAME;
const DATABASE_HOST_NAME = process.env.DATABASE_HOST_NAME;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_PORT = process.env.DATABASE_PORT;

// Create DATABASE_LINK using variables from .env file
const DATABASE_LINK = `postgres://${DATABASE_USER_NAME}:${DATABASE_PASSWORD}@${DATABASE_HOST_NAME}:${DATABASE_PORT}/${DATABASE_NAME}?options=-c search_path=public`;

const connectionString = DATABASE_LINK;

const poolDB = new Pool({
  connectionString,
});

const addMovie = async (req, res) => {
  const client = await poolDB.connect();
  const {
    title,
    director_first_name,
    director_last_name,
    director_nationality,
    duration,
    description,
    poster_url,
    youtube_link,
    release_date,
  } = req.body;

  try {
    await client.query("BEGIN");

    const { rows: existingDirectorRows } = await client.query(
      `SELECT id_director FROM "Director" WHERE first_name = $1 AND last_name = $2`,
      [director_first_name, director_last_name]
    );

    let directorId;

    if (existingDirectorRows.length > 0) {
      directorId = existingDirectorRows[0].id_director;
    } else {
      const { rows: newDirectorRows } = await client.query(
        `INSERT INTO "Director" (first_name, last_name, nationality)
             VALUES ($1, $2, $3) RETURNING id_director`,
        [director_first_name, director_last_name, director_nationality]
      );

      directorId = newDirectorRows[0].id_director;
    }

    const { rows: existingMovieRows } = await client.query(
      `SELECT * FROM "Movie" WHERE title = $1 AND id_director = $2 AND duration = $3 AND
          description = $4 AND poster_url = $5 AND youtube_link = $6 AND release_date = $7`,
      [
        title,
        directorId,
        duration,
        description,
        poster_url,
        youtube_link,
        release_date,
      ]
    );

    if (existingMovieRows.length > 0) {
      res
        .status(409)
        .send({ message: "Movie with the same data already exists" });
      await client.query("ROLLBACK");
    } else {
      const { rows: movieRows } = await client.query(
        `INSERT INTO "Movie" (title, id_director, duration, description, poster_url, youtube_link, release_date )
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          title,
          directorId,
          duration,
          description,
          poster_url,
          youtube_link,
          release_date,
        ]
      );

      await client.query("COMMIT");
      res
        .status(201)
        .json({ movie: movieRows[0], message: "Movie added successfully" });
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send({ message: "Failed to add movie" });
  } finally {
    client.release();
  }
};

const getMovies = async (req, res) => {
  const {
    title,
    duration,
    description,
    poster_url,
    youtube_link,
    release_date,
  } = req.query;
  const client = await poolDB.connect();
  let selectColumns = "*";

  if (Object.keys(req.query).length === 1) {
    // Add conditions for each column as needed
  }

  let query = `SELECT ${selectColumns} FROM "Movie"`;
  const queryParams = [];
  let queryConditions = "";

  if (title) {
    queryParams.push(title);
    queryConditions += ` AND title = $${queryParams.length}`;
  }

  if (duration) {
    queryParams.push(duration);
    queryConditions += ` AND duration = $${queryParams.length}`;
  }

  if (description) {
    queryParams.push(description);
    queryConditions += ` AND description = $${queryParams.length}`;
  }

  if (poster_url) {
    queryParams.push(poster_url);
    queryConditions += ` AND poster_url = $${queryParams.length}`;
  }

  if (youtube_link) {
    queryParams.push(youtube_link);
    queryConditions += ` AND youtube_link = $${queryParams.length}`;
  }

  if (release_date) {
    queryParams.push(release_date);
    queryConditions += ` AND release_date = $${queryParams.length}`;
  }

  if (queryConditions) {
    query += ` WHERE ${queryConditions.slice(5)}`;
  }

  try {
    const { rows: movieRows } = await client.query(query, queryParams);

    if (movieRows.length === 0) {
      res.status(404).send({ message: "Movies not found" });
    } else {
      res.status(200).json(movieRows);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get movies list" });
  } finally {
    client.release();
  }
};

const getMovieById = async (req, res) => {
  const movieId = parseInt(req.params.id);
  const client = await poolDB.connect();

  try {
    const { rows: movieRows } = await client.query(
      `SELECT movie.*, director.first_name, director.last_name, director.nationality
             FROM "Movie" AS movie
             INNER JOIN "Director" AS director ON movie.id_director = director.id_director
             WHERE movie.id_movie = $1`,
      [movieId]
    );

    if (movieRows.length === 0) {
      res.status(404).send({ message: "Movie not found" });
    } else {
      res.status(200).json(movieRows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get movie by id" });
  } finally {
    client.release();
  }
};

const updateMoviesData = async (req, res) => {
  const movieId = parseInt(req.params.id);
  const { title, duration, description, poster_url, youtube_link, release_date } = req.body;

  let query = 'UPDATE "Movie" SET';
  const queryParams = [];
  let queryUpdates = "";

  if (title) {
    queryParams.push(title);
    queryUpdates += `, title = $${queryParams.length}`;
  }

  if (duration) {
    queryParams.push(duration);
    queryUpdates += `, duration = $${queryParams.length}`;
  }

  if (description) {
    queryParams.push(description);
    queryUpdates += `, description = $${queryParams.length}`;
  }

  if (poster_url) {
    queryParams.push(poster_url);
    queryUpdates += `, poster_url = $${queryParams.length}`;
  }

  if (youtube_link) {
    queryParams.push(youtube_link);
    queryUpdates += `, youtube_link = $${queryParams.length}`;
  }

  if (release_date) {
    queryParams.push(release_date);
    queryUpdates += `, release_date = $${queryParams.length}`;
  }

  if (!queryUpdates) {
    res.status(400).send({ message: "No data to update" });
    return;
  }

  query += `${queryUpdates.slice(2)} WHERE id_movie = $${
    queryParams.length + 1
  }`;
  queryParams.push(movieId);

  const client = await poolDB.connect();

  try {
    const { rowCount } = await client.query(query, queryParams);

    if (rowCount === 0) {
      res.status(404).send({ message: "Movie not found" });
    } else {
      res.status(200).send({ message: "Movie updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to update movie data" });
  } finally {
    client.release();
  }
};

const deleteMovie = async (req, res) => {
  const movieId = parseInt(req.params.id);
  const client = await poolDB.connect();

  try {
    const { rowCount } = await client.query(
      'DELETE FROM "Movie" WHERE id_movie = $1',
      [movieId]
    );

    if (rowCount === 0) {
      res.status(404).send({ message: "Movie not found" });
    } else {
      res.status(200).send({ message: "Movie deleted successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to delete movie" });
  } finally {
    client.release();
  }
};

module.exports = {
  addMovie,
  getMovies,
  getMovieById,
  updateMoviesData,
  deleteMovie,
};
