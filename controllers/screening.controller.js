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

const getScreenings = async (req, res) => {
    const { name, hallNumber } = req.params;
    const { date, time } = req.query;
    const client = await poolDB.connect();
  
    try {
        const checkCinemaHallQuery = `
        SELECT ch.id_cinema_hall
        FROM "Cinema_Hall" ch
        JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
        WHERE c.name = $1 AND ch.hall_number = $2
      `;
      const checkCinemaHallParams = [name, hallNumber];
      const { rows: cinemaHallRows } = await client.query(
        checkCinemaHallQuery,
        checkCinemaHallParams
      );
  
      if (cinemaHallRows.length === 0) {
        res.status(404).send({ message: "Cinema or Cinema Hall not found" });
        return;
      }
  
      const id_cinema_hall = cinemaHallRows[0].id_cinema_hall;
  
      let query = `
      SELECT s.id_screening, m.title, ch.hall_number, st.language, st.subtitle, s.date, s.time
      FROM "Screening" s
      JOIN "Cinema_Hall" ch ON ch.id_cinema_hall = s.id_cinema_hall
      JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
      JOIN "Movie" m ON m.id_movie = s.id_movie
      JOIN "Screening_Type" st ON st.id_screening_type = s.id_screening_type
      WHERE s.id_cinema_hall = $1
    `;
      const queryParams = [id_cinema_hall];
  
      let queryConditions = "";
  
      if (date) {
        queryParams.push(date);
        queryConditions += ` AND s.date = $${queryParams.length}`;
      }
  
      if (time) {
        queryParams.push(time);
        queryConditions += ` AND s.time = $${queryParams.length}`;
      }
  
      if (queryConditions) {
        query += queryConditions;
      }
  
      const { rows: screeningRows } = await client.query(query, queryParams);
  
      if (screeningRows.length === 0) {
        res.status(404).send({ message: "Screenings not found" });
      } else {
        res.status(200).json(screeningRows);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: "Failed to get screenings list" });
    } finally {
      client.release();
    }
  };

  const getScreeningByName = async (req, res) => {
    const { name, hallNumber, screeningName } = req.params;
    const client = await poolDB.connect();
  
    try {
      const checkCinemaHallQuery = `
          SELECT ch.id_cinema_hall
          FROM "Cinema_Hall" ch
          JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
          WHERE c.name = $1 AND ch.hall_number = $2
        `;
      const checkCinemaHallParams = [name, hallNumber];
      const { rows: cinemaHallRows } = await client.query(
        checkCinemaHallQuery,
        checkCinemaHallParams
      );
  
      if (cinemaHallRows.length === 0) {
        res.status(404).send({ message: "Cinema or Cinema Hall not found" });
        return;
      }

      const id_cinema_hall = cinemaHallRows[0].id_cinema_hall;

      const query = `
          SELECT s.id_screening, m.title, ch.hall_number, st.language, st.subtitle, s.date, s.time
          FROM "Screening" s
          JOIN "Cinema" c ON c.id_cinema = ch.id_cinema
          JOIN "Movie" m ON m.id_movie = s.id_movie
          JOIN "Cinema_Hall" ch ON ch.id_cinema_hall = s.id_cinema_hall
          JOIN "Screening_Type" st ON st.id_screening_type = s.id_screening_type
          WHERE s.id_cinema_hall = $1 AND m.title = $2
        `;
      const queryParams = [id_cinema_hall, screeningName];
  
      const { rows: screeningRows } = await client.query(query, queryParams);
  
      if (screeningRows.length === 0) {
        res.status(404).send({ message: "Screening not found" });
      } else {
        res.status(200).json(screeningRows);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: "Failed to get screening" });
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
  addScreening,
  getScreenings,
  getScreeningByName,
  updateScreeningsData,
  deleteScreening,
};
