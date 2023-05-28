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

const getScreenings = async (req, res) => {
  const client = await poolDB.connect();

  let query = `
      SELECT 
        s.id_screening,
        m.title as movie_title,
        ch.hall_number,
        st.language,
        st.subtitle,
        s.date,
        s.time
      FROM "Screening" AS s
      INNER JOIN "Movie" AS m ON s.id_movie = m.id_movie
      INNER JOIN "Cinema_Hall" AS ch ON s.id_cinema_hall = ch.id_cinema_hall
      INNER JOIN "Screening_Type" AS st ON s.id_screening_type = st.id_screening_type
    `;

  const queryParams = [];
  const conditions = [];
  for (const key in req.query) {
    if (
      req.query.hasOwnProperty(key) &&
      key !== "sortBy" &&
      key !== "order" &&
      key !== "limit" &&
      key !== "offset"
    ) {
      if (typeof req.query[key] !== "string" || req.query[key].length > 255) {
        return res.status(400).send({ message: "Invalid query parameters" });
      }
      conditions.push(`"${key}" = $${queryParams.length + 1}`);
      queryParams.push(req.query[key].replace(/[^a-zA-Z0-9_ -]/g, ""));
    }
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
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

  try {
    const { rows: screeningsRows } = await client.query(query, queryParams);

    if (screeningsRows.length === 0) {
      res.status(404).send({ message: "Screenings not found" });
    } else {
      res.status(200).json(screeningsRows);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get screenings list" });
  } finally {
    client.release();
  }
};

const addScreening = async (req, res) => {
  const { title, language, subtitle, date, time } = req.body;

  const { id, hallNumber } = req.params;

  const client = await poolDB.connect();

  try {
    const checkCinemaHallQuery = `
          SELECT ch.id_cinema_hall
          FROM "Cinema_Hall" ch
          JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
          WHERE c.id_cinema = $1 AND ch.hall_number = $2
        `;
    const checkCinemaHallParams = [id, hallNumber];
    const { rows: cinemaHallRows } = await client.query(
      checkCinemaHallQuery,
      checkCinemaHallParams
    );

    if (cinemaHallRows.length === 0) {
      res.status(404).send({ message: "Cinema or Cinema Hall not found" });
      return;
    }

    const id_cinema_hall = cinemaHallRows[0].id_cinema_hall;

    const getIdsQuery = `
          SELECT m.id_movie, st.id_screening_type
          FROM "Movie" m
          JOIN "Screening_Type" st ON st.language = $1 AND st.subtitle = $2
          WHERE m.title = $3
        `;
    const getIdsQueryParams = [language, subtitle, title];
    const { rows: idRows } = await client.query(getIdsQuery, getIdsQueryParams);

    if (idRows.length === 0) {
      res.status(404).send({ message: "Movie or Screening Type not found" });
      return;
    }

    const { id_movie, id_screening_type } = idRows[0];

    const query = `
          INSERT INTO "Screening" (id_movie, id_cinema_hall, id_screening_type, date, time)
          VALUES ($1, $2, $3, $4, $5)
        `;
    const queryParams = [
      id_movie,
      id_cinema_hall,
      id_screening_type,
      date,
      time,
    ];

    await client.query(query, queryParams);
    res.status(201).send({ message: "Screening added successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to add screening" });
  } finally {
    client.release();
  }
};

const updateScreeningsData = async (req, res) => {
  const { id, hallNumber, screeningId } = req.params;
  const { title, language, subtitle, date, time } = req.body;

  const client = await poolDB.connect();

  try {
    const checkCinemaHallQuery = `
          SELECT ch.id_cinema_hall
          FROM "Cinema_Hall" ch
          JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
          WHERE c.id_cinema = $1 AND ch.hall_number = $2
        `;
    const checkCinemaHallParams = [id, hallNumber];
    const { rows: cinemaHallRows } = await client.query(
      checkCinemaHallQuery,
      checkCinemaHallParams
    );

    if (cinemaHallRows.length === 0) {
      res.status(404).send({ message: "Cinema or Cinema Hall not found" });
      return;
    }
    const id_cinema_hall = cinemaHallRows[0].id_cinema_hall;

    const getIdsQuery = `
    SELECT m.id_movie, st.id_screening_type
    FROM "Movie" m
    JOIN "Screening_Type" st ON st.language = $1 AND st.subtitle = $2
    WHERE m.title = $3
  `;
    const getIdsQueryParams = [language, subtitle, title];
    const { rows: idRows } = await client.query(getIdsQuery, getIdsQueryParams);

    if (idRows.length === 0) {
      res.status(404).send({ message: "Movie or Screening Type not found" });
      return;
    }

    const { id_movie, id_screening_type } = idRows[0];

    const updateQuery = `
    UPDATE "Screening"
    SET id_movie = $1, id_cinema_hall = $2, id_screening_type = $3, date = $4, time = $5
    WHERE id_screening = $6
  `;
    const updateQueryParams = [
      id_movie,
      id_cinema_hall,
      id_screening_type,
      date,
      time,
      screeningId,
    ];

    const result = await client.query(updateQuery, updateQueryParams);

    if (result.rowCount === 0) {
      res.status(404).send({ message: "Screening not found" });
      return;
    }

    res.status(200).send({ message: "Screening updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to update screening" });
  } finally {
    client.release();
  }
};

const deleteScreening = async (req, res) => {
  const { id, hallNumber, screeningId } = req.params;

  const client = await poolDB.connect();

  try {
    const checkCinemaHallQuery = `
          SELECT ch.id_cinema_hall
          FROM "Cinema_Hall" ch
          JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
          WHERE c.id_cinema = $1 AND ch.hall_number = $2
        `;
    const checkCinemaHallParams = [id, hallNumber];
    const { rows: cinemaHallRows } = await client.query(
      checkCinemaHallQuery,
      checkCinemaHallParams
    );

    if (cinemaHallRows.length === 0) {
      res.status(404).send({ message: "Cinema or Cinema Hall not found" });
      return;
    }

    const id_cinema_hall = cinemaHallRows[0].id_cinema_hall;

    const deleteQuery = `
          DELETE FROM "Screening"
          WHERE id_screening = $1 AND id_cinema_hall = $2
        `;
    const deleteQueryParams = [screeningId, id_cinema_hall];

    const result = await client.query(deleteQuery, deleteQueryParams);

    if (result.rowCount === 0) {
      res.status(404).send({ message: "Screening not found" });
      return;
    }

    res.status(200).send({ message: "Screening deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to delete screening" });
  } finally {
    client.release();
  }
};

module.exports = {
  getScreenings,
  addScreening,
  updateScreeningsData,
  deleteScreening,
};