require("dotenv").config();
const moment = require("moment");

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

const buildWhereClauseAndParams = (queryParameters, cinemaHallIds) => {
  let whereClause = "WHERE s.id_cinema_hall = ANY($1) AND s.archived = false";
  let queryParams = [cinemaHallIds];
  let counter = 2;

  for (const key in queryParameters) {
    if (queryParameters.hasOwnProperty(key)) {
      whereClause += ` AND ${key} = $${counter}`;
      queryParams.push(queryParameters[key]);
      counter++;
    }
  }

  return { whereClause, queryParams };
};

const getScreenings = async (req, res) => {
  const { name } = req.params;
  const client = await poolDB.connect();

  try {
    const getCinemaHallsQuery = `
      SELECT ch.id_cinema_hall
      FROM "Cinema_Hall" ch
      JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
      WHERE c.name = $1
    `;
    const { rows: cinemaHallRows } = await client.query(getCinemaHallsQuery, [
      name,
    ]);

    if (cinemaHallRows.length === 0) {
      res.status(404).send({ message: "Cinema or Hall not found" });
      return;
    }

    const cinemaHallIds = cinemaHallRows.map((row) => row.id_cinema_hall);

    const { whereClause, queryParams } = buildWhereClauseAndParams(
      req.query,
      cinemaHallIds
    );

    const query = `
    SELECT s.id_screening, s.id_cinema_hall, m.id_movie, m.title, m.poster_url, m.duration, st.language, st.subtitle, s.date, s.time, string_agg(g.name, ',') as genres
    FROM "Screening" s
    JOIN "Cinema_Hall" ch ON ch.id_cinema_hall = s.id_cinema_hall
    JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
    JOIN "Movie" m ON m.id_movie = s.id_movie
    JOIN "Screening_Type" st ON st.id_screening_type = s.id_screening_type
    LEFT JOIN "Movie_Genre" mg ON mg.id_movie = m.id_movie
    LEFT JOIN "Genre" g ON g.id_genre = mg.id_genre
    ${whereClause}
    GROUP BY s.id_screening, m.id_movie, m.title, m.poster_url, m.duration, st.language, st.subtitle, s.date, s.time
    `;

    const { rows: screeningRows } = await client.query(query, queryParams);
    const screeningRowsString = JSON.stringify(screeningRows);
    const inputJson = JSON.parse(screeningRowsString);

    const outputJson = inputJson.reduce((accumulator, item) => {
      const existingMovieIndex = accumulator.findIndex(
        (movie) => movie.id_movie === item.id_movie
      );

      const genres = item.genres ? item.genres.split(",") : [];

      const screening = {
        id_screening: item.id_screening,
        language: item.language,
        subtitle: item.subtitle,
        date: item.date,
        time: moment(item.time, "HH:mm:ss").format("HH:mm"),
      };

      if (existingMovieIndex !== -1) {
        accumulator[existingMovieIndex].screenings.push(screening);
        accumulator[existingMovieIndex].screenings.sort((a, b) =>
          moment(a.time, "HH:mm").isAfter(moment(b.time, "HH:mm")) ? 1 : -1
        );
      } else {
        accumulator.push({
          id_movie: item.id_movie,
          title: item.title,
          poster_url: item.poster_url,
          duration: item.duration,
          genres: genres,
          screenings: [screening],
        });
      }

      return accumulator;
    }, []);

    if (screeningRows.length === 0) {
      res.status(200).send({ message: "Screenings not found" });
    } else {
      res.status(200).json(outputJson);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get screenings list" });
  } finally {
    client.release();
  }
};

const getScreeningByName = async (req, res) => {
  const { name, screeningName } = req.params;
  const client = await poolDB.connect();

  try {
    const getCinemaHallsQuery = `
      SELECT ch.id_cinema_hall
      FROM "Cinema_Hall" ch
      JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
      WHERE c.name = $1
    `;
    const { rows: cinemaHallRows } = await client.query(getCinemaHallsQuery, [
      name,
    ]);

    if (cinemaHallRows.length === 0) {
      res.status(404).send({ message: "Cinema or Hall not found" });
      return;
    }

    const cinemaHallIds = cinemaHallRows.map((row) => row.id_cinema_hall);

    const query = `
      SELECT s.id_screening, m.id_movie, m.title, m.poster_url, m.duration, m.description, d.first_name, d.last_name, d.nationality, string_agg(g.name, ',') as genres, st.language, st.subtitle, s.date, s.time
      FROM "Screening" s
      JOIN "Cinema_Hall" ch ON ch.id_cinema_hall = s.id_cinema_hall
      JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
      JOIN "Movie" m ON m.id_movie = s.id_movie
      JOIN "Director" d ON d.id_director = m.id_director
      JOIN "Screening_Type" st ON st.id_screening_type = s.id_screening_type
      LEFT JOIN "Movie_Genre" mg ON mg.id_movie = m.id_movie
      LEFT JOIN "Genre" g ON g.id_genre = mg.id_genre
      WHERE s.id_cinema_hall = ANY($1) AND s.archived = false AND m.title = $2
      GROUP BY s.id_screening, m.id_movie, m.title, m.poster_url, m.duration, m.description, d.first_name, d.last_name, d.nationality, st.language, st.subtitle, s.date, s.time
    `;
    const queryParams = [cinemaHallIds, screeningName];

    const { rows: screeningRows } = await client.query(query, queryParams);

    if (screeningRows.length === 0) {
      res.status(200).send({ message: "Screening not found" });
    } else {
      const screening = screeningRows[0];
      const outputJson = {
        id_movie: screening.id_movie,
        title: screening.title,
        genres: screening.genres.split(","),
        first_name: screening.first_name,
        last_name: screening.last_name,
        nationality: screening.nationality,
        duration: screening.duration,
        description: screening.description,
        poster_url: screening.poster_url,
        screenings: [
          {
            id_screening: screening.id_screening,
            language: screening.language,
            subtitle: screening.subtitle,
            date: screening.date,
            time: moment(screening.time, "HH:mm:ss").format("HH:mm"),
          },
        ],
      };

      res.status(200).json(outputJson);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get screening" });
  } finally {
    client.release();
  }
};

module.exports = {
  getScreenings,
  getScreeningByName,
};
