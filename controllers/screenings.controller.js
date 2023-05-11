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


const getScreenings = async (req, res) => {
    const {
      id,
      id_movie,
      id_cinema_hall,
      hall_number,
      id_screening_type,
      language,
      subtitle,
      cinema_name,
      cinema_city,
      date,
      time
    } = req.query;
    const client = await poolDB.connect();
  
    let query = `
      SELECT 
        s.id_screening, 
        s.id_movie, 
        ch.id_cinema_hall, 
        ch.hall_number, 
        st.id_screening_type, 
        st.language, 
        st.subtitle,
        c.name,
        a.city,
        s.date,
        s.time
      FROM "Screening" AS s
      INNER JOIN "Cinema_Hall" AS ch ON s.id_cinema_hall = ch.id_cinema_hall
      INNER JOIN "Screening_Type" AS st ON s.id_screening_type = st.id_screening_type
      INNER JOIN "Cinema" AS c ON ch.id_cinema = c.id_cinema
      INNER JOIN "Address" AS a ON c.id_address = a.id_address
    `;
  
    const queryParams = [];
    let queryConditions = "";
  
    if (id) {
      queryParams.push(id);
      queryConditions += ` AND s.id_screening = $${queryParams.length}`;
    }
  
    if (id_movie) {
      queryParams.push(id_movie);
      queryConditions += ` AND s.id_movie = $${queryParams.length}`;
    }
  
    if (id_cinema_hall) {
      queryParams.push(id_cinema_hall);
      queryConditions += ` AND ch.id_cinema_hall = $${queryParams.length}`;
    }
  
    if (hall_number) {
      queryParams.push(hall_number);
      queryConditions += ` AND ch.hall_number = $${queryParams.length}`;
    }
  
    if (id_screening_type) {
      queryParams.push(id_screening_type);
      queryConditions += ` AND st.id_screening_type = $${queryParams.length}`;
    }
  
    if (language) {
      queryParams.push(language);
      queryConditions += ` AND st.language = $${queryParams.length}`;
    }
  
    if (subtitle) {
      queryParams.push(subtitle);
      queryConditions += ` AND st.subtitle = $${queryParams.length}`;
    }

    if (cinema_name) {
      queryParams.push(cinema_name);
      queryConditions += ` AND c.name = $${queryParams.length}`;
    }

    if (cinema_city) {
      queryParams.push(cinema_city);
      queryConditions += ` AND a.city = $${queryParams.length}`;
    }
  
    if (date) {
      queryParams.push(date);
      queryConditions += ` AND s.date = $${queryParams.length}`;
    }
  
    if (time) {
      queryParams.push(time);
      queryConditions += ` AND s.time = $${queryParams.length}`;
    }

    if (queryConditions) {
      query += ` WHERE ${queryConditions.slice(5)} AND s.archived = false`;
    }
  
    query += ` GROUP BY s.id_screening, s.id_movie, ch.id_cinema_hall, ch.hall_number, st.id_screening_type, st.language, st.subtitle, s.date, s.time, c.name, a.city`;
  
    try {
      const { rows: movieRows } = await client.query(query, queryParams);
  
      if (movieRows.length === 0) {
        res.status(404).send({ message: "Screenings not found" });
      } else {
        res.status(200).json(movieRows);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: "Failed to get screenings list" });
    } finally {
      client.release();
    }
  };


module.exports = {
  getScreenings,
};
