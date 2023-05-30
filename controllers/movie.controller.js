require("dotenv").config();
const poolDB = require('../db/db.js');

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

  const queryParams = [];
  let queryConditions = "";
  const conditionsMapping = {
    id: { value: id, column: "m.id_movie" },
    title: { value: title, column: "m.title" },
    duration: { value: duration, column: "m.duration" },
    description: { value: description, column: "m.description" },
    poster_url: { value: poster_url, column: "m.poster_url" },
    youtube_link: { value: youtube_link, column: "m.youtube_link" },
    release_date: { value: release_date, column: "m.release_date" },
    first_name: { value: first_name, column: "d.first_name" },
    last_name: { value: last_name, column: "d.last_name" },
    nationality: { value: nationality, column: "d.nationality" },
  };

  Object.keys(conditionsMapping).forEach((key) => {
    const condition = conditionsMapping[key];
    if (condition.value) {
      queryParams.push(condition.value);
      queryConditions += ` AND ${condition.column} = $${queryParams.length}`;
    }
  });

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
