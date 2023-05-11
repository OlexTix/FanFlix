require("dotenv").config();

const Pool = require("pg").Pool;

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


const getMovies = async (req, res) => {
  const {
    id,
    title,
    duration,
    description,
    poster_url,
    youtube_link,
    release_date,
    first_name,
    last_name,
    nationality,
  } = req.query;
  const client = await poolDB.connect();

  let query = `
    SELECT 
      m.id_movie, 
      m.title, 
      array_agg(g.name) AS genres, 
      d.first_name, 
      d.last_name, 
      d.nationality, 
      m.duration, 
      m.description, 
      m.poster_url, 
      m.youtube_link, 
      m.release_date
    FROM "Movie" AS m
    INNER JOIN "Director" AS d ON m.id_director = d.id_director
    LEFT JOIN "Movie_Genre" AS mg ON m.id_movie = mg.id_movie
    LEFT JOIN "Genre" AS g ON mg.id_genre = g.id_genre
  `;

  const queryParams = [];
  let queryConditions = "";

  if (id) {
    queryParams.push(id);
    queryConditions += ` AND m.id_movie = $${queryParams.length}`;
  }

  if (title) {
    queryParams.push(title);
    queryConditions += ` AND m.title = $${queryParams.length}`;
  }

  if (duration) {
    queryParams.push(duration);
    queryConditions += ` AND m.duration = $${queryParams.length}`;
  }

  if (description) {
    queryParams.push(description);
    queryConditions += ` AND m.description = $${queryParams.length}`;
  }

  if (poster_url) {
    queryParams.push(poster_url);
    queryConditions += ` AND m.poster_url = $${queryParams.length}`;
  }

  if (youtube_link) {
    queryParams.push(youtube_link);
    queryConditions += ` AND m.youtube_link = $${queryParams.length}`;
  }

  if (release_date) {
    queryParams.push(release_date);
    queryConditions += ` AND m.release_date = $${queryParams.length}`;
  }

  if (first_name) {
    queryParams.push(first_name);
    queryConditions += ` AND d.first_name = $${queryParams.length}`;
  }

  if (last_name) {
    queryParams.push(last_name);
    queryConditions += ` AND d.last_name = $${queryParams.length}`;
  }

  if (nationality) {
    queryParams.push(nationality);
    queryConditions += ` AND d.nationality = $${queryParams.length}`;
  }

  if (queryConditions) {
    query += ` WHERE ${queryConditions.slice(5)}`;
  }

  query += ` GROUP BY m.id_movie, d.id_director`;

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

const getMovieByName = async (req, res) => {
  const movieName = req.params.movieName;
  const client = await poolDB.connect();

  try {
    const { rows: movieRows } = await client.query(
      `SELECT
        m.id_movie,
        m.title,
        array_agg(g.name) AS genres,
        d.first_name,
        d.last_name,
        d.nationality,
        m.duration,
        m.description,
        m.poster_url,
        m.youtube_link,
        m.release_date
      FROM "Movie" AS m
      INNER JOIN "Director" AS d ON m.id_director = d.id_director
      LEFT JOIN "Movie_Genre" AS mg ON m.id_movie = mg.id_movie
      LEFT JOIN "Genre" AS g ON mg.id_genre = g.id_genre
      WHERE m.title = $1
      GROUP BY m.id_movie, d.id_director`,
      [movieName]
    );

    if (movieRows.length === 0) {
      res.status(404).send({ message: "Movie not found" });
    } else {
      res.status(200).json(movieRows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get movie by name" });
  } finally {
    client.release();
  }
};

module.exports = {
  getMovies,
  getMovieByName,
};
