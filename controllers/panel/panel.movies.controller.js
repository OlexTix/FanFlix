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
  try {
    // Extract query parameters from the request
    const queryParams = req.query;

    // Check if 'titles' query parameter is used
    if ('titles' in queryParams) {
      return res.status(400).json({ error: "Invalid query parameter 'titles'" });
    }

    // Define an array to store the conditions
    const conditions = [];

    // Iterate over the query parameters
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
        // Add the condition to the array
        conditions.push(`"Movie".${key} = '${value}'`);
      }
    }

    // Build the SQL query using the conditions
    let query = `
      SELECT 
        "Movie".id_movie,
        "Movie".title,
        "Director".id_director,
        "Director".first_name AS director_first_name,
        "Director".last_name AS director_last_name,
        "Director".nationality AS director_nationality,
        "Movie".duration,
        "Movie".description,
        "Movie".poster_url,
        "Movie".youtube_link,
        "Movie".release_date,
        ARRAY_AGG("Genre".name) AS genres
      FROM 
        "Movie"
        JOIN "Director" ON "Movie".id_director = "Director".id_director
        LEFT JOIN "Movie_Genre" ON "Movie".id_movie = "Movie_Genre".id_movie
        LEFT JOIN "Genre" ON "Movie_Genre".id_genre = "Genre".id_genre`;

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      GROUP BY 
        "Movie".id_movie,
        "Director".id_director,
        "Director".first_name,
        "Director".last_name`;

    const { rows } = await poolDB.query(query);

    if (rows.length === 0) {
      // No movies found
      return res.status(404).json({ error: "No movies found" });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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
    genres,
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

      const movieId = movieRows[0].id_movie;

      if (!Array.isArray(genres) || genres.length === 0) {
        res.status(400).send({ message: "'genres' must be a non-empty array" });
        await client.query("ROLLBACK");
        return;
      }

      for (let genre of genres) {
        let { rows: existingGenreRows } = await client.query(
          `SELECT id_genre FROM "Genre" WHERE name = $1`,
          [genre]
        );

        let genreId;

        if (existingGenreRows.length > 0) {
          genreId = existingGenreRows[0].id_genre;
        } else {
          const { rows: newGenreRows } = await client.query(
            `INSERT INTO "Genre" (name) VALUES ($1) RETURNING id_genre`,
            [genre]
          );

          genreId = newGenreRows[0].id_genre;
        }

        await client.query(
          `INSERT INTO "Movie_Genre" (id_movie, id_genre)
                   VALUES ($1, $2)`,
          [movieId, genreId]
        );
      }

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

  const client = await poolDB.connect();

  try {
    const { rows } = await client.query(
      'SELECT * FROM "Movie" WHERE id_movie = $1',
      [movieId]
    );

    if (rows.length === 0) {
      res.status(404).send({ message: "Movie not found" });
      return;
    }

    const movie = rows[0];
    const updatedMovieData = {
      title: title || movie.title,
      duration: duration || movie.duration,
      description: description || movie.description,
      poster_url: poster_url || movie.poster_url,
      youtube_link: youtube_link || movie.youtube_link,
      release_date: release_date || movie.release_date,
    };

    await client.query(
      'UPDATE "Movie" SET title=$1, duration=$2, description=$3, poster_url=$4, youtube_link=$5, release_date=$6 WHERE id_movie=$7',
      [
        updatedMovieData.title,
        updatedMovieData.duration,
        updatedMovieData.description,
        updatedMovieData.poster_url,
        updatedMovieData.youtube_link,
        updatedMovieData.release_date,
        movieId,
      ]
    );

    res.status(200).send({ message: "Movie updated successfully" });
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
    await client.query('BEGIN');

    const { rows: genres } = await client.query(
      'DELETE FROM "Movie_Genre" WHERE id_movie = $1 RETURNING *',
      [movieId]
    );

    const { rows: screenings } = await client.query(
      'DELETE FROM "Screening" WHERE id_movie = $1 RETURNING *',
      [movieId]
    );

    const { rowCount } = await client.query(
      'DELETE FROM "Movie" WHERE id_movie = $1',
      [movieId]
    );

    if (rowCount === 0) {
      await client.query('ROLLBACK');
      res.status(404).send({ message: "Movie not found" });
    } else {
      await client.query('COMMIT');
      res.status(200).send({ message: `Movie and ${screenings.length} associated screenings and ${genres.length} associated genres deleted successfully` });
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send({ message: "Failed to delete movie, its screenings, and associated genres" });
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
