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
    const conditions = [];
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key) && key !== "sortBy" && key !== "order" && key !== "limit" && key !== "offset") {
        if (typeof req.query[key] !== 'string' || req.query[key].length > 255) {
          return res.status(400).send({ message: "Invalid query parameters" });
        }
        conditions.push(`"${key}" = $${queryParams.length + 1}`);
        queryParams.push(req.query[key].replace(/[^a-zA-Z0-9_ -]/g, ''));
      }
    }
  
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
  
    if (req.query.sortBy && req.query.order) {
      if (["asc", "desc"].includes(req.query.order.toLowerCase())) {
        query += ` ORDER BY "${req.query.sortBy}" ${req.query.order}`;
      } else {
        return res.status(400).send({ message: "Invalid sort order" });
      }
    }
  
    if (req.query.limit) {
      if (!Number.isInteger(parseInt(req.query.limit))) {
        return res.status(400).send({ message: "Limit must be an integer" });
      }
      query += ` LIMIT $${queryParams.length + 1}`;
      queryParams.push(parseInt(req.query.limit));
    }
  
    if (req.query.offset) {
      if (!Number.isInteger(parseInt(req.query.offset))) {
        return res.status(400).send({ message: "Offset must be an integer" });
      }
      query += ` OFFSET $${queryParams.length + 1}`;
      queryParams.push(parseInt(req.query.offset));
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
        `SELECT * FROM "Movie" WHERE title = $1`,
        [title]
      );
  
      if (existingMovieRows.length > 0) {
        res
          .status(409)
          .send({ message: "Movie with the same title already exists" });
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

  const updateMoviesData = async (req, res) => {
    const movieId = parseInt(req.params.id);
    const {
      title,
      duration,
      description,
      poster_url,
      youtube_link,
      release_date,
    } = req.body;
  
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
    getMovies,
    addMovie,
    updateMoviesData,
    deleteMovie,
  };
  